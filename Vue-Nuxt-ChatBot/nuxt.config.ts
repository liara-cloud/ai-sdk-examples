// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    liaraApiKey: process.env.LIARA_API_KEY,
    baseUrl: process.env.BASE_URL,
  },
})
