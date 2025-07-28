// npm i ai @ai-sdk/openai dotenv zod 

import { streamObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';
import { z } from 'zod';

config();
const my_model = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

const result = streamObject({
  model: my_model('openai/gpt-4o-mini'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

result.object
  .then(({ recipe }) => {
    // do something with the fully typed, final object:
    console.log('Recipe:', JSON.stringify(recipe, null, 2));
  })
  .catch(error => {
    // handle type validation failure
    // (when the object does not match the schema):
    console.error(error);
  });

// note: the stream needs to be consumed because of backpressure
for await (const partialObject of result.partialObjectStream) {
}

// Uncomment the following lines to use the other way of handling the result and Comment out the above code block:
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

// const result = streamObject({
//   model: my_model('openai/gpt-4o-mini'),
//   schema: z.object({
//     recipe: z.object({
//       name: z.string(),
//       ingredients: z.array(z.string()),
//       steps: z.array(z.string()),
//     }),
//   }),
//   prompt: 'Generate a lasagna recipe.',
//   onFinish({ object, error }) {
//     // handle type validation failure (when the object does not match the schema):
//     if (object === undefined) {
//       console.error('Error:', error);
//       return;
//     }

//     console.log('Final object:', JSON.stringify(object, null, 2));
//   },
// });

// for await (const chunk of result.partialObjectStream) {} 
