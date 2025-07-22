// npm i ai @ai-sdk/openai

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';


const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});


export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return Response.json({ text });
}