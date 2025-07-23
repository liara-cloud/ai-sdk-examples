// npm i ai @ai-sdk/openai

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  // 'data' contains the additional data that you have sent:
  const { messages, data } = await req.json();

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  // Call the language model
  const result = streamText({
    model: my_model('openai/gpt-4o-mini'),
    messages: [
      ...initialMessages,
      {
        role: 'user',
        content: [
          { type: 'text', text: currentMessage.content },
          { type: 'image', image: new URL(data.imageUrl) },
        ],
      },
    ],
  });

  // Respond with the stream
  return result.toDataStreamResponse();
}