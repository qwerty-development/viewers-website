/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'qwerty-black': '#000000',
        'qwerty-dark-blue': '#01303F',
        'qwerty-gray': '#696969',
        'qwerty-white': '#FFFFFF',
      },
      fontFamily: {
        'telegraph-black': ['Telegraph-Black', 'sans-serif'],
        'telegraph-bold': ['Telegraph-Bold', 'sans-serif'],
        'telegraph-medium': ['Telegraph-Medium', 'sans-serif'],
        'telegraph-ultralight': ['Telegraph-UltraLight', 'sans-serif'],
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}