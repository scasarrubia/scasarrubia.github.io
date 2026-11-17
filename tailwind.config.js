/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        institutional: {
          ink: '#1f2f2b',
          green: '#123c35',
          greenDark: '#0d2f2a',
          gold: '#e5b54b',
          goldDark: '#b77c17',
          paper: '#f7f8f4',
          mist: '#e7f0e8'
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        institutional: '0 .8rem 1.8rem rgba(31, 47, 43, .1)'
      }
    }
  },
  corePlugins: {
    preflight: false
  }
};
