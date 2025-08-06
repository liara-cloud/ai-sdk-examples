import { Controller, Post, Res } from '@nestjs/common';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Response } from 'express';
import { config } from 'dotenv';
config();

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

@Controller()
export class AppController {
  @Post()
  async example(@Res() res: Response) {
    const result = streamText({
      model: my_model('openai/gpt-4o-mini'),
      prompt: 'Invent a new holiday and describe its traditions.',
    });

    result.pipeTextStreamToResponse(res);
  }
}

// import { Controller, Post, Res } from '@nestjs/common';
// import { createOpenAI } from '@ai-sdk/openai';
// import { pipeDataStreamToResponse, streamText } from 'ai';
// import { Response } from 'express';
// import { config } from 'dotenv';
// config();

// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL!,
//   apiKey: process.env.LIARA_API_KEY!,
// });

// @Controller()
// export class AppController {
//   @Post('/stream-data')
//   async streamData(@Res() res: Response) {
//     pipeDataStreamToResponse(res, {
//       execute: async (dataStreamWriter) => {
//         dataStreamWriter.writeData('initialized call');

//         const result = streamText({
//           model: my_model('openai/gpt-4o-mini'),
//           prompt: 'Invent a new holiday and describe its traditions.',
//         });

//         result.mergeIntoDataStream(dataStreamWriter);
//       },
//       onError: (error) => {
//         // Error messages are masked by default for security reasons.
//         // If you want to expose the error message to the client, you can do so here:
//         return error instanceof Error ? error.message : String(error);
//       },
//     });
//   }
// }

// import { Controller, Post, Res } from '@nestjs/common';
// import { createOpenAI } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import { Response } from 'express';
// import { config } from 'dotenv';
// config();

// const my_model = createOpenAI({
//   baseURL: process.env.BASE_URL!,
//   apiKey: process.env.LIARA_API_KEY!,
// });

// @Controller()
// export class AppController {
//   @Post()
//   async example(@Res() res: Response) {
//     const result = streamText({
//       model: my_model('openai/gpt-4o-mini'),
//       prompt: 'Invent a new holiday and describe its traditions.',
//     });

//     result.pipeDataStreamToResponse(res);
//   }
// }