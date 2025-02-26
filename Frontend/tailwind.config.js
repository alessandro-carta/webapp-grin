/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blu-3': '#3536c1',
        'blu-2': '#1E6CD8'
      },
    },
  },
  plugins: [],
}

