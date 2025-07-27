// npm i ai @ai-sdk/openai dotenv

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';
import fs from 'node:fs';

config();
const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});
 
async function main() {
  const result = streamText({
    model: my_model('openai/gpt-4o-mini'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          { type: 'image', image: fs.readFileSync('./data/cool-dog.jpg') },
        ],
      },
    ],
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);