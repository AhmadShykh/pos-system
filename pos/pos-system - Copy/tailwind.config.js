/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ebe8e1",
        customBlue: "#0a2f9a"
      },
      backgroundImage: {
        example: "url('/src/Assets/example.jpg')"
      }
    },
  },
  plugins: [],
}