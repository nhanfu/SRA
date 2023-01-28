/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./com/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
