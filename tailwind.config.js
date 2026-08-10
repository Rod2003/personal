const colors = require('tailwindcss/colors');

const mochaColors = {
  background: '#2B2420',
  foreground: '#C4BCB8',
  white: '#FFFFFF',
  yellow: { ...colors.yellow, DEFAULT: '#9B7653' },
  green: { ...colors.green, DEFAULT: '#A89E4D' },
  gray: { ...colors.gray, DEFAULT: '#7A6E5D' },
  blue: { ...colors.blue, DEFAULT: '#6B9799' },
  red: { ...colors.red, DEFAULT: '#B34F63' },
  ring: '#71717A',
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: mochaColors,
    },
  },
};
