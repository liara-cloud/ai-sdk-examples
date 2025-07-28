// npm i ai @ai-sdk/openai dotenv zod 

import { generateText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';
import { z } from 'zod';

config();
const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

async function main() {
  const result = await generateText({
    model: my_model('openai/gpt-4o-mini'),
    maxTokens: 512,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
      cityAttractions: tool({
        parameters: z.object({ city: z.string() }),
      }),
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
  });

  // typed tool results for tools with execute method:
  for (const toolResult of result.toolResults) {
    switch (toolResult.toolName) {
      case 'weather': {
        toolResult.args.location; // string
        toolResult.result.location; // string
        toolResult.result.temperature; // number
        break;
      }
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);

// example 2:
// // npm i ai @ai-sdk/openai dotenv zod 

// import { generateText, tool } from 'ai';
// import { createOpenAI } from '@ai-sdk/openai';
// import { config } from 'dotenv';
// import { z } from 'zod';

// config();
// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL,
//   apiKey: process.env.LIARA_API_KEY,
// });

// async function main() {
//   const result = await generateText({
//     model: my_model('openai/gpt-4o-mini'),
//     maxTokens: 512,
//     tools: {
//       weather: tool({
//         description: 'Get the weather in a location',
//         parameters: z.object({
//           location: z.string().describe('The location to get the weather for'),
//         }),
//         execute: async ({ location }) => ({
//           location,
//           temperature: 72 + Math.floor(Math.random() * 21) - 10,
//         }),
//       }),
//       cityAttractions: tool({
//         parameters: z.object({ city: z.string() }),
//       }),
//     },
//     prompt:
//       'What is the weather in San Francisco and what attractions should I visit?',
//   });

//   // typed tool calls:
//   for (const toolCall of result.toolCalls) {
//     switch (toolCall.toolName) {
//       case 'cityAttractions': {
//         toolCall.args.city; // string
//         break;
//       }

//       case 'weather': {
//         toolCall.args.location; // string
//         break;
//       }
//     }
//   }

//   console.log(JSON.stringify(result, null, 2));
// }

// main().catch(console.error);


// example 3:
// npm i ai @ai-sdk/openai dotenv zod 

// import { generateText, tool } from 'ai';
// import { createOpenAI } from '@ai-sdk/openai';
// import { config } from 'dotenv';
// import { z } from 'zod';

// config();
// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL,
//   apiKey: process.env.LIARA_API_KEY,
// });

// const result = await generateText({
//   model: my_model('openai/gpt-4o-mini'),
//   tools: {
//     weather: tool({
//       description: 'Get the weather in a location',
//       parameters: z.object({
//         location: z.string().describe('The location to get the weather for'),
//       }),
//       execute: async ({ location }) => ({
//         location,
//         temperature: 72 + Math.floor(Math.random() * 21) - 10,
//       }),
//     }),
//     cityAttractions: tool({
//       parameters: z.object({ city: z.string() }),
//     }),
//   },
//   prompt:
//     'What is the weather in San Francisco and what attractions should I visit?',
// });

// console.log(result.toolResults);