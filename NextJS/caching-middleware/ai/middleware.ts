// npm i ioredis

import Redis from 'ioredis';
import {
  type LanguageModelV1,
  type LanguageModelV1Middleware,
  type LanguageModelV1StreamPart,
  simulateReadableStream,
} from 'ai';

const redis = new Redis(process.env.KV_URL!); 

export const cacheMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);

    const cachedRaw = await redis.get(cacheKey);
    const cached = cachedRaw ? JSON.parse(cachedRaw) as Awaited<ReturnType<LanguageModelV1['doGenerate']>> : null;

    if (cached !== null) {
      return {
        ...cached,
        response: {
          ...cached.response,
          timestamp: cached?.response?.timestamp
            ? new Date(cached?.response?.timestamp)
            : undefined,
        },
      };
    }

    const result = await doGenerate();
    redis.set(cacheKey, JSON.stringify(result));
    return result;
  },

  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify(params);

    const cachedRaw = await redis.get(cacheKey);
    const cached = cachedRaw ? JSON.parse(cachedRaw) as LanguageModelV1StreamPart[] : null;

    if (cached !== null) {
      const formattedChunks = cached.map(p => {
        if (p.type === 'response-metadata' && p.timestamp) {
          return { ...p, timestamp: new Date(p.timestamp) };
        } else return p;
      });

      return {
        stream: simulateReadableStream({
          initialDelayInMs: 0,
          chunkDelayInMs: 10,
          chunks: formattedChunks,
        }),
        rawCall: { rawPrompt: null, rawSettings: {} },
      };
    }

    const { stream, ...rest } = await doStream();

    const fullResponse: LanguageModelV1StreamPart[] = [];

    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
    >({
      transform(chunk, controller) {
        fullResponse.push(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        redis.set(cacheKey, JSON.stringify(fullResponse));
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
