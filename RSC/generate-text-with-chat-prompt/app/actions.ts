'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

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

  const { text } = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are a friendly assistant!',
    messages: history,
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant' as const,
        content: text,
      },
    ],
  };
}