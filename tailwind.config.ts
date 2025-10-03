import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#022B3A',
          50: '#E6F0F3',
          100: '#CCE1E7',
          200: '#99C3CF',
          300: '#66A5B7',
          400: '#33879F',
          500: '#022B3A',
          600: '#02222E',
          700: '#011A23',
          800: '#011117',
          900: '#00090C'
        },
        secondary: {
          DEFAULT: '#1F7A8C',
          50: '#E8F5F7',
          100: '#D1EBEF',
          200: '#A3D7DF',
          300: '#75C3CF',
          400: '#47AFBF',
          500: '#1F7A8C',
          600: '#196270',
          700: '#134954',
          800: '#0C3138',
          900: '#06181C'
        },
        accent: {
          DEFAULT: '#BFDBF7',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#F7FBFE',
          400: '#DBEBFA',
          500: '#BFDBF7',
          600: '#8BBFEF',
          700: '#57A3E7',
          800: '#2387DF',
          900: '#1A6BB5'
        },
        light: {
          DEFAULT: '#E1E5F2',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#F9FAFB',
          500: '#E1E5F2',
          600: '#B8C0DC',
          700: '#8F9BC6',
          800: '#6676B0',
          900: '#4D5A8A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(2, 43, 58, 0.1), 0 10px 20px -2px rgba(2, 43, 58, 0.05)',
        'medium': '0 4px 25px -5px rgba(2, 43, 58, 0.15), 0 10px 30px -5px rgba(2, 43, 58, 0.1)',
        'large': '0 10px 40px -10px rgba(2, 43, 58, 0.2), 0 20px 50px -10px rgba(2, 43, 58, 0.15)'
      }
    }
  },
  plugins: []
} satisfies Config