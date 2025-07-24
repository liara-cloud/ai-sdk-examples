'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/use-object/schema';
import { z } from 'zod';

export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/use-object',
    schema: z.array(notificationSchema),
  });

  return (
    <div>
      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>

      {isLoading && (
        <div>
          <div>Loading...</div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      {object?.map((notification, index) => (
        <div key={index}>
          <p>{notification.name}</p>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}