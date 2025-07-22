'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');

  const { messages, append } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      <input
        value={input}
        onChange={event => {
          setInput(event.target.value);
        }}
        onKeyDown={async event => {
          if (event.key === 'Enter') {
            append({
              content: input,
              role: 'user',
            });
          }
        }}
      />

      {messages.map((message, index) => (
        <div key={index}>
          {message.parts.map(part => {
            if (part.type === 'text') {
              return <div key={`${message.id}-text`}>{part.text}</div>;
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}