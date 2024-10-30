/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F3F7F9"
      },
      backgroundImage: {
        'gray-sclae': "url('/src/assets/aluminum.jpg')",
        'right-curtain': "url('/right-curtain.svg')"
      }
    },
  },
  plugins: [],
}

