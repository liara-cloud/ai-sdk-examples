// npm i ai @ai-sdk/openai zod

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    system:
      'You are a helpful assistant. Respond to the user in Markdown format.',
    model: my_model('openai/gpt-4o-mini', { structuredOutputs: true }),
    messages,
  });

  return result.toDataStreamResponse();
}