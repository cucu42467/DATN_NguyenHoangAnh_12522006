import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./thanh_phan/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        revolut: {
          dark: '#191c1f',
          white: '#ffffff',
          surface: '#f4f4f4',
          blue: '#494fdf',
          'action-blue': '#4f55f1',
          danger: '#e23b4a',
          'deep-pink': '#e61e49',
          warning: '#ec7e00',
          yellow: '#b09000',
          teal: '#00a87e',
          'light-green': '#428619',
          'light-blue': '#007bc2',
          brown: '#936d62',
          slate: '#505a63',
          gray: '#8d969e',
          'gray-tone': '#c9c9cd',
        }
      },
      fontFamily: {
        aeonik: ['Aeonik Pro', 'ui-sans-serif'],
        inter: ['Inter', 'ui-sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      spacing: {
        '18': '4.5rem', // for large headings if needed
      },
      fontSize: {
        'display-mega': ['8.5rem', { lineHeight: '1', letterSpacing: '-0.272em' }],
        hero: ['5rem', { lineHeight: '1' }],
      }
    },
  },
  plugins: [],
}

export default config
