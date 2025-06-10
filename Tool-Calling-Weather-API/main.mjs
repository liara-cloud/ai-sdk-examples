import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, tool } from 'ai';
import { z } from 'zod';

import { config } from 'dotenv';
config();

const getCurrentWeatherTool = tool({
  description: "Get current temperature for a given location.",
  parameters: z.object({
    location: z.string().describe("City and country e.g. Bogotá, Colombia"),
    unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  }),
  execute: async ({ location, unit }) => {
    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
      const data = await response.json();

      const current = data.current_condition[0];
      const temperature = unit === 'celsius'
        ? current.temp_C
        : current.temp_F;

      const condition = current.weatherDesc[0].value;

      return {
        location,
        temperature: parseInt(temperature, 10),
        unit,
        condition,
      };
    } catch (error) {
      return {
        location,
        temperature: null,
        unit,
        condition: "Unable to fetch weather data.",
        error: error.message,
      };
    }
  },
});

const { steps } = await generateText({
  model: createOpenAICompatible({
    baseURL: process.env.BASE_URL,
    name: 'example',
    apiKey: process.env.LIARA_API_KEY,
  }).chatModel("openai/gpt-4o-mini"),
  
  tools: {
    getCurrentWeather: getCurrentWeatherTool,
  },
  
  prompt: 'What is the weather like in Tehran in fahrenheit today?',
});


const toolResults = steps.flatMap(step => step.toolResults);
if (toolResults.length > 0) {
  for (const tool of toolResults) {
    if (tool.toolName === "getCurrentWeather") {
      const args = tool.result;
      console.log(`The current weather in ${args.location} is ${args.temperature}°${args.unit === "celsius" ? "C" : "F"} and ${args.condition}.`);
    } else {
      console.log(`Tool "${tool.toolName}" was called, but no handler is defined for it.`);
    }
  }
} else {
  console.log("No tool call was triggered.");
}

