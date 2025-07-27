// npm i ai @ai-sdk/openai dotenv zod @ai-sdk/deepseek

import { generateObject, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { config } from 'dotenv';
import { z } from 'zod';

config();

const openai_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

const deepseek_model = createDeepSeek({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

async function main() {
  const { text: rawOutput } = await generateText({
    model: deepseek_model('deepseek/deepseek-r1-distill-llama-70b'),
    prompt:
      'Predict the top 3 largest city by 2050. For each, return the name, the country, the reason why it will on the list, and the estimated population in millions.',
  });

  const { object } = await generateObject({
    model: openai_model('openai/gpt-4o-mini'),
    prompt: 'Extract the desired information from this text: \n' + rawOutput,
    schema: z.object({
      name: z.string().describe('the name of the city'),
      country: z.string().describe('the name of the country'),
      reason: z
        .string()
        .describe(
          'the reason why the city will be one of the largest cities by 2050',
        ),
      estimatedPopulation: z.number(),
    }),
    output: 'array',
  });

  console.log(object);
}

main().catch(console.error);