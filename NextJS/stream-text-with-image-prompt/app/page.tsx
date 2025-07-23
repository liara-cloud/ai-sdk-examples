'use client';

import { useChat } from '@ai-sdk/react';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form
        onSubmit={e => {
          handleSubmit(e, {
            data: { imageUrl: 'https://media.liara.ir/ai/dog.png' },
          });
        }}
      >
        <input
          value={input}
          placeholder="What does the image show..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}