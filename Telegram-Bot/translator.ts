import { generateText, generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const my_model = createOpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.LIARA_API_KEY!,
});

const translationSchema = z.object({
  translation: z.object({
    text_language: z.string(),
    text_to_translate: z.string(),
    target_language: z.string(),
    translated_text: z.string(),
    explanations_related_to_translation_in_target_language: z.string(),
  }),
});

export async function translateWithFeedback(text: string, targetLanguage: string) {
  let currentTranslation = '';
  let currentObjectTranslation = { translation: {
    text_language: '',
    text_to_translate: text,
    target_language: targetLanguage,
    translated_text: '',
    explanations_related_to_translation_in_target_language: '',
  }};
  let iterations = 0;
  const MAX_ITERATIONS = 3;

  const { object: firstTranslation } = await generateObject({
    model: my_model('openai/gpt-4o-mini'),
    system: 'You are an expert literary translator.',
    prompt: `Translate this text to ${targetLanguage}, preserving tone and cultural nuances:\n\n${text}`,
    schema: translationSchema,
  });

  currentTranslation = firstTranslation.translation.translated_text;
  currentObjectTranslation = firstTranslation as {
    translation: {
      text_language: string;
      text_to_translate: string;
      target_language: string;
      translated_text: string;
      explanations_related_to_translation_in_target_language: string;
    };
  };

  while (iterations < MAX_ITERATIONS) {
    const { object: evaluation } = await generateObject({
      model: my_model('openai/gpt-4.1-mini'),
      schema: z.object({
        qualityScore: z.number().min(1).max(10),
        preservesTone: z.boolean(),
        preservesNuance: z.boolean(),
        culturallyAccurate: z.boolean(),
        specificIssues: z.array(z.string()),
        improvementSuggestions: z.array(z.string()),
      }),
      system: 'You are an expert in evaluating literary translations.',
      prompt: `Evaluate this translation:\n\nOriginal: ${text}\nTranslation: ${currentTranslation}\n\nConsider:\n1. Overall quality\n2. Preservation of tone\n3. Preservation of nuance\n4. Cultural accuracy`,
    });

    if (
      evaluation.qualityScore >= 8 &&
      evaluation.preservesTone &&
      evaluation.preservesNuance &&
      evaluation.culturallyAccurate
    ) {
      break;
    }

    const { object: improvedTranslation } = await generateObject({
      model: my_model('openai/gpt-4.1'),
      system: 'You are an expert literary translator.',
      prompt: `Improve this translation based on the following feedback:\n\n${evaluation.specificIssues.join('\n')}\n\n${evaluation.improvementSuggestions.join('\n')}\n\nOriginal: ${text}\nCurrent Translation: ${currentTranslation}`,
      schema: translationSchema,
    });

    currentTranslation = improvedTranslation.translation.translated_text;
    currentObjectTranslation = improvedTranslation as {
      translation: {
        text_language: string;
        text_to_translate: string;
        target_language: string;
        translated_text: string;
        explanations_related_to_translation_in_target_language: string;
      };
    };
    iterations++;
  }

  return {
    currentObjectTranslation,
    iterations,
  };
}
