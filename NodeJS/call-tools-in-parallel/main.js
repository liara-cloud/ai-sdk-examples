// npm i ai @ai-sdk/openai dotenv zod 

import { generateText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';
import { z } from 'zod';

config();
const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

const result = await generateText({
  model: my_model('openai/gpt-4o-mini'),
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    cityAttractions: tool({
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => {
        if (city === 'San Francisco') {
          return {
            attractions: [
              'Golden Gate Bridge',
              'Alcatraz Island',
              "Fisherman's Wharf",
            ],
          };
        } else {
          return { attractions: [] };
        }
      },
    }),
  },
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?',
});

console.log(result);