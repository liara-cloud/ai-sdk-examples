// npm i ai @ai-sdk/openai

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';


interface ModelMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});


export async function POST(req: Request) {
  const { messages }: { messages: ModelMessage[] } = await req.json();

  const { response } = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return Response.json({ messages: response.messages });
}