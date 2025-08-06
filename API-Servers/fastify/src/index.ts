import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import Fastify from 'fastify';
import { config } from 'dotenv';


config();

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});
const fastify = Fastify({ logger: true });

fastify.post('/', async function (request, reply) {
  const result = streamText({
    model: my_model('openai/gpt-4o-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  reply.header('Content-Type', 'text/plain; charset=utf-8');

  return reply.send(result.textStream);
});

fastify.listen({ port: 8080 });


// import { createOpenAI } from '@ai-sdk/openai';
// import { createDataStream, streamText } from 'ai';
// import Fastify from 'fastify';
// import { config } from 'dotenv';

// config();

// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL!,
//   apiKey: process.env.LIARA_API_KEY!,
// });

// const fastify = Fastify({ logger: true });

// fastify.post('/stream-data', async function (request, reply) {
//   // immediately start streaming the response
//   const dataStream = createDataStream({
//     execute: async dataStreamWriter => {
//       dataStreamWriter.writeData('initialized call');

//       const result = streamText({
//         model: my_model('openai/gpt-4o-mini'),
//         prompt: 'Invent a new holiday and describe its traditions.',
//       });

//       result.mergeIntoDataStream(dataStreamWriter);
//     },
//     onError: error => {
//       // Error messages are masked by default for security reasons.
//       // If you want to expose the error message to the client, you can do so here:
//       return error instanceof Error ? error.message : String(error);
//     },
//   });

//   // Mark the response as a v1 data stream:
//   reply.header('X-Vercel-AI-Data-Stream', 'v1');
//   reply.header('Content-Type', 'text/plain; charset=utf-8');

//   return reply.send(dataStream);
// });

// fastify.listen({ port: 8080 });

// import { createOpenAI } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import Fastify from 'fastify';
// import { config } from 'dotenv';

// config();

// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL!,
//   apiKey: process.env.LIARA_API_KEY!,
// });

// const fastify = Fastify({ logger: true });

// fastify.post('/', async function (request, reply) {
//   const result = streamText({
//     model: my_model('openai/gpt-4o-mini'),
//     prompt: 'Invent a new holiday and describe its traditions.',
//   });

//   reply.header('Content-Type', 'text/plain; charset=utf-8');

//   return reply.send(result.toDataStream());
// });

// fastify.listen({ port: 8080 });