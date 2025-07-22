'use client';

import { useState } from 'react';

export default function Page() {
  const [generation, setGeneration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        onClick={async () => {
          setIsLoading(true);

          await fetch('/api/completion', {
            method: 'POST',
            body: JSON.stringify({
              prompt: 'Why is the sky blue?',
            }),
          }).then(response => {
            response.json().then(json => {
              setGeneration(json.text);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </div>

      {isLoading ? 'Loading...' : generation}
    </div>
  );
}