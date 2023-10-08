const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    colors: {
      gray: "#cfdbd5",
      white: "#e8eddf",
      yellow: "#f5cb5c",
      black: "#333533",
      blacker: "#242423",
    },
    container: {
      screens: {
        DEFAULT: "768px",
        lg: "768px",
        xl: "768px",
        "2xl": "768px",
      },
    },
    extend: {
      fontFamily: {
        space: ['"Space Mono"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
