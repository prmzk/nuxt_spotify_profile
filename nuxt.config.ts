// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "nuxt-icon"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleFonts: {
    families: {
      "Space Mono": [500, 700],
      "Maven Pro": [400, 500, 600, 700],
    },
  },
  runtimeConfig: {
    spotifyClientId: "",
    spotifyClientSecret: "",
    spotifyRedirectUri: "",
  },
});
