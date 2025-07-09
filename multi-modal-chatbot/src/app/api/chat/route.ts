import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';


const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const messagesHaveImage = messages.some(
    (message: { experimental_attachments?: any[] }) =>
      message.experimental_attachments?.some(
        (a) =>
          typeof a.contentType === 'string' &&
          a.contentType.startsWith('image/')
      )
  );

  console.log('Messages have image:', messagesHaveImage);

  const result = streamText({
    model: messagesHaveImage
      ? my_model('openai/gpt-4.1')
      : my_model('deepseek/deepseek-chat-v3-0324'),
    messages,
  });

  return result.toDataStreamResponse();
}