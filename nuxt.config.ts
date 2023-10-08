// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleFonts: {
    families: {
      Asap: {
        wght: [300, 400, 500],
      },
      "Maven Pro": [500, 700],
    },
  },
  runtimeConfig: {
    spotifyClientId: "",
    spotifyClientSecret: "",
    spotifyRedirectUri: "",
  },
});
