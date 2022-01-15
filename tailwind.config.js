/* eslint-disable no-undef */
/*global module*/
const defaultTheme = require('tailwindcss/stubs/defaultConfig.stub');

module.exports = {
  content: ['./app/**/*.{hbs,html}'],
  theme: {
    ...defaultTheme,
    extend: {},
  },
  plugins: [],
};
