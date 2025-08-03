'use server';

import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export async function getNotifications(input: string) {
  'use server';

  const { object: notifications } = await generateObject({
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

  return { notifications };
}