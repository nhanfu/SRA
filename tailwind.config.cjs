/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./com/static/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
