'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function getWeather({ city, unit }: { city: string; unit: 'C' | 'F' }) {
  // This function would normally make an
  // API request to get the weather.

  void city;
  void unit;

  return { value: 25, description: 'Sunny' };
}

export async function continueConversation(history: Message[]) {
  'use server';

  const { text, toolResults } = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are a friendly weather assistant!',
    messages: history,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          city: z.string().describe('The city to get the weather for'),
          unit: z
            .enum(['C', 'F'])
            .describe('The unit to display the temperature in'),
        }),
        execute: async ({ city, unit }) => {
          const weather = getWeather({ city, unit });
          return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
        },
      },
    },
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content:
          text || toolResults.map(toolResult => toolResult.result).join('\n'),
      },
    ],
  };
}