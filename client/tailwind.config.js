/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        main: "#3B7A57",
        main_hover: "#255e35",
        yellow: "#de8f2f",
        yellow_hover: "#c77b1e",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("flowbite/plugin")],
};
