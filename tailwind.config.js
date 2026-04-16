/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B0F19', // Fondo oscuro (Vento)
          light: '#1F2937',
        },
        accent: {
          DEFAULT: '#3B82F6', // Azul vibrante
          hover: '#2563EB',
        }
      }
    },
  },
  plugins: [],
}
