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
        'right-curtain': "url('/right-curtain.svg')",
        'left-curtain': "url('/left-curtain.svg')"
      },
      keyframes: {
        upward: {
          "0%": {
            top: "1000px"
          },
          "100%": {
            top: "0px"
          }
        }
      },
      animation: {
        upward: "upward 0.5s ease-in-out",
      }
    },
  },
  plugins: [],
}

