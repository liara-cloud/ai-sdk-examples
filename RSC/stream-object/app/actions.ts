'use server';

import { streamObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { z } from 'zod';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export async function generate(input: string) {
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = streamObject({
      model: my_model('openai/gpt-4o-mini'),
      system: 'You generate three notifications for a messages app.',
      prompt: input,
      schema: z.object({
        notifications: z.array(
          z.object({
            name: z.string().describe('Name of a fictional person.'),
            message: z.string().describe('Do not use emojis or links.'),
            minutesAgo: z.number(),
          }),
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}