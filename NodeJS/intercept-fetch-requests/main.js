// npm i ai @ai-sdk/openai dotenv zod 

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';

config();
const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,

  // example fetch wrapper that logs the input to the API call:
  fetch: async (url, options) => {
    console.log('URL', url);
    console.log('Headers', JSON.stringify(options?.headers ?? {}, null, 2));
    console.log(
      `Body ${JSON.stringify(
        options?.body ? JSON.parse(options.body) : {},
        null,
        2
      )}`,
    );
    return await fetch(url, options);
  },
});


const { text } = await generateText({
  model: my_model('openai/gpt-4o-mini'),
  prompt: 'Why is the sky blue?',
});

console.log(text);