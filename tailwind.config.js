/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <--- YE LINE CHECK KAREIN
  ],
  theme: {
    extend: {
      colors: {
        neonPurple: "#D200FF",
        neonBlue: "#00E5FF",
        darkBg: "#050505",
      },
    },
  },
  plugins: [],
};