/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        ailms: {
          teal: '#075D66',
          'teal-hover': '#054950',
          'teal-light': '#0a7580',
          'teal-subtle': '#f0f7f8',
          bg: '#EAF2F4',
          navy: '#172B3A',
          grey: '#718096',
        },
        navy: {
          800: '#0f172a',
          900: '#172B3A',
          950: '#0b1120',
        }
      },
    },
  },
  plugins: [],
}
