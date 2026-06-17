/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uisek: {
          DEFAULT: '#085394',
          dark: '#074E99',
          light: '#eff3f8',
        },
        tabla: {
          header: '#6366F1',
          texto: '#003399',
          borde: '#3366CC',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
