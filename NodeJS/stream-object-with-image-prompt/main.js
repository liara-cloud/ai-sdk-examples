// npm i ai @ai-sdk/openai dotenv zod 

import { streamObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';
import { z } from 'zod';
import fs from 'node:fs';


config();
const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});


async function main() {
  const { partialObjectStream } = streamObject({
    model: my_model('openai/gpt-4o-mini'),
    maxTokens: 512,
    schema: z.object({
      stamps: z.array(
        z.object({
          country: z.string(),
          date: z.string(),
        }),
      ),
    }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'list all the stamps in these passport pages?',
          },
          {
            type: 'image',
            image: fs.readFileSync('./data/some.jpg'),
          },
        ],
      },
    ],
  });

  for await (const partialObject of partialObjectStream) {
    console.clear();
    console.log(partialObject);
  }
}

main();


// // npm i ai @ai-sdk/openai dotenv zod 

// import { streamObject } from 'ai';
// import { createOpenAI } from '@ai-sdk/openai';
// import { config } from 'dotenv';
// import { z } from 'zod';

// config();
// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL,
//   apiKey: process.env.LIARA_API_KEY,
// });


// async function main() {
//   const { partialObjectStream } = streamObject({
//     model: my_model('openai/gpt-4o-mini'),
//     maxTokens: 512,
//     schema: z.object({
//       stamps: z.array(
//         z.object({
//           country: z.string(),
//           date: z.string(),
//         }),
//       ),
//     }),
//     messages: [
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'list all the stamps in these passport pages?',
//           },
//           {
//             type: 'image',
//             image: new URL(
//               'https://media.liara.ir/ai/ai-sdk/cookbook/nodejs/WW2_Spanish_official_passport.jpg',
//             ),
//           },
//         ],
//       },
//     ],
//   });

//   for await (const partialObject of partialObjectStream) {
//     console.clear();
//     console.log(partialObject);
//   }
// }

// main();