// npm i ai @ai-sdk/openai zod

import { createOpenAI } from '@ai-sdk/openai';
import { ToolInvocation, streamText } from 'ai';
import { z } from 'zod';

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});


interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

function getLocation() {
  return { lat: 37.7749, lon: -122.4194 };
}

function getWeather({ lat, lon, unit }: { lat: number; lon: number; unit: string }) {
  return { value: 25, description: 'Sunny' };
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are a helpful assistant.',
    messages,
    tools: {
      getLocation: {
        description: 'Get the location of the user',
        parameters: z.object({}),
        execute: async () => {
        const { lat, lon } = getLocation();
        return {
          lat,
          lon,
          message: `Your location is at latitude ${lat} and longitude ${lon}`,
        };
      }
      },
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          lat: z.number().describe('The latitude of the location'),
          lon: z.number().describe('The longitude of the location'),
          unit: z
            .enum(['C', 'F'])
            .describe('The unit to display the temperature in'),
        }),
        execute: async ({ lat, lon, unit }) => {
        const { value, description } = getWeather({ lat, lon, unit });
        return {
          temperature: value,
          unit,
          description,
          message: `It is currently ${value}°${unit} and ${description}!`,
        };
      }
      },
    },
  });

  return result.toDataStreamResponse();
}
