/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cblu-3': '#3536c1',
        'cblu-2': '#1E6CD8',
        'cgray-2': '#aeaeae',
        'cerror': '#ef4444'
      },
    },
  },
  plugins: [],
}

