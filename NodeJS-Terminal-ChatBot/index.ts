import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText, tool } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';
import * as readline from 'node:readline/promises';

dotenv.config();

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: my_model('openai/gpt-4o-mini'),
      messages,
      tools: {
        weather: tool({
          description: 'Get the weather in a location (in Celsius)',
          parameters: z.object({
            location: z
              .string()
              .describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: Math.round((Math.random() * 30 + 5) * 10) / 10, // Random temp between 5°C and 35°C
          }),
        }),
        convertCelsiusToFahrenheit: tool({
          description: 'Convert a temperature from Celsius to Fahrenheit',
          parameters: z.object({
            celsius: z
              .number()
              .describe('The temperature in Celsius to convert'),
          }),
          execute: async ({ celsius }) => {
            const fahrenheit = (celsius * 9) / 5 + 32;
            return { fahrenheit: Math.round(fahrenheit * 100) / 100 };
          },
        }),
      },
      maxSteps: 5,
      onStepFinish: step => {
        console.log(JSON.stringify(step, null, 2));
      },
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);