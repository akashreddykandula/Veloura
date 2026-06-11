export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'Georgia', 'serif']
      },
      colors: {
        ink: '#121212',
        ivory: '#faf7f1',
        stone: '#e8e0d4',
        gold: '#b59a65'
      },
      boxShadow: {
        soft: '0 18px 55px rgba(18,18,18,.10)'
      }
    }
  },
  plugins: []
};
