// npm i ai @ai-sdk/openai zod

import { createOpenAI } from '@ai-sdk/openai'
import { Message, streamText } from 'ai';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

export const maxDuration = 30

// Stub for loading message history
async function loadHistory(): Promise<Message[]> {
  // TODO: Implement actual history loading from storage
  return [];
}

export async function POST(req: Request) {
  // we receive only the text from the last message
  const text = await req.json()

  // e.g. load message history from storage
  const history = await loadHistory()

  // Call the language model
  const result = streamText({
    model: my_model('openai/gpt-4o-mini'),
    messages: [...history, { role: 'user', content: text }],
    onFinish({ text }) {
      // e.g. save the message and the response to storage
    }
  })

  // Respond with the stream
  return result.toDataStreamResponse()
}