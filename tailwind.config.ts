import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      keyframes: {
        sound: {
          '0%': { opacity: '0.35', height: '5%' },
          '100%': { opacity: '1', height: '100%' },
        },
      },
      animation: {
        sound: 'sound 0ms -600ms linear infinite alternate',
      },
      height: {
        'screen--header': 'calc(100vh - 6rem)',
      },
      minHeight: {
        'screen--header': 'calc(100vh - 6rem)',
      },
      maxHeight: {
        'screen--header': 'calc(100vh - 6rem)',
      },
    },
  },
  plugins: [],
}
export default config
