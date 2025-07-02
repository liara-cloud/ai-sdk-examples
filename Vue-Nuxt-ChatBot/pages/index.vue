<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';

const { messages, input, handleSubmit } = useChat({ maxSteps: 5 });
</script>

<template>
  <div>
    <div
      v-for="m in messages"
      :key="m.id ? m.id : index"
    >
      {{ m.role === 'user' ? 'User: ' : 'AI: ' }}
      <div v-for="part in m.parts" :key="part.id">
        <div v-if="part.type === 'text'">{{ part.text }}</div>
        <div v-if="part.type === 'tool-invocation'">
          {{ part.toolInvocation }}
        </div>
      </div>
    </div>

    <form @submit="handleSubmit">
      <input
        v-model="input"
        placeholder="Say something..."
      />
    </form>
  </div>
</template>