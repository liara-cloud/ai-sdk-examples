// npm i ai @ai-sdk/openai zod

import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: my_model('openai/gpt-4o-mini'),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });

  return result.toTextStreamResponse();
}