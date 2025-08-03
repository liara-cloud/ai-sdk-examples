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

export async function continueConversation(history: Message[]) {
  'use server';

  const { text, toolResults } = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are a friendly assistant!',
    messages: history,
    tools: {
      celsiusToFahrenheit: {
        description: 'Converts celsius to fahrenheit',
        parameters: z.object({
          value: z.string().describe('The value in celsius'),
        }),
        execute: async ({ value }) => {
          const celsius = parseFloat(value);
          const fahrenheit = celsius * (9 / 5) + 32;
          return `${celsius}°C is ${fahrenheit.toFixed(2)}°F`;
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