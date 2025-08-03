'use server';

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';

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

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = streamText({
      model: my_model('openai/gpt-4o-mini'),
      system:
        "You are a dude that doesn't drop character until the DVD commentary.",
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}