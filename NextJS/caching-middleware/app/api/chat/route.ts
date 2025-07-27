// npm i ai @ai-sdk/openai zod

import { createOpenAI } from '@ai-sdk/openai'
import { cacheMiddleware } from '@/ai/middleware';
import { wrapLanguageModel, streamText, tool } from 'ai';
import { z } from 'zod';

const my_model = createOpenAI({

  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

const wrappedModel = wrapLanguageModel({
  model: my_model('openai/gpt-4o-mini'),
  middleware: cacheMiddleware,
});


export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: wrappedModel,
    messages,
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
    },
  });
  return result.toDataStreamResponse();
}
