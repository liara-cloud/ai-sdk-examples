// npm i @ai-sdk/openai@^1 ai@^4

'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    prompt: question,
  });

  return { text, finishReason, usage };
}