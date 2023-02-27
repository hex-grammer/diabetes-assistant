/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#3EB489',
        'primary-dark': '#447A61',
        'secondary': '#FF0133',
        'secondary-light': '#249EA0',
        'primary-btn': '#FAAB36',
        'secondary-btn': '#FFF9F0',
      },
      keyframes: {
        slideIn: {
          "0%": { right: "100%" },
          "100%": { right: "0%" }
        },
        slideOut: {
          "0%": { right: "0%" },
          "100%": { right: "100%" }
        },
      },
      animation: {
        slideIn: "slideIn 300ms ease-in",
        slideOut: "slideOut 300ms ease-out",
      }
    },
  },
  plugins: [],
};
