/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["Inter", "sans-serif"],
  		},
  		colors: {
  			accent: "#7afbaf",
  		},
  	}
  },
  plugins: [],
};
