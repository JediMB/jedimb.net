/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public_html/**/*.{html,php,js}'],
  theme: {
    colors: {
      transparent:  'transparent',
      current:      'currentColor',
      white:        '#ffffff',
      black:        '#000000',
      hotpink: {
        50:   'hsl(var(--color-hotpink-50))',
        100:  'hsl(var(--color-hotpink-100))',
        200:  'hsl(var(--color-hotpink-200))',
        300:  'hsl(var(--color-hotpink-300))',
        400:  'hsl(var(--color-hotpink-400))',
        500:  'hsl(var(--color-hotpink-500))',
        600:  'hsl(var(--color-hotpink-600))',
        700:  'hsl(var(--color-hotpink-700))',
        800:  'hsl(var(--color-hotpink-800))',
        900:  'hsl(var(--color-hotpink-900))',
        950:  'hsl(var(--color-hotpink-950))'
      },
      sandyyellow: {
        50:   'hsl(var(--color-sandyyellow-50))',
        100:  'hsl(var(--color-sandyyellow-100))',
        200:  'hsl(var(--color-sandyyellow-200))',
        300:  'hsl(var(--color-sandyyellow-300))',
        400:  'hsl(var(--color-sandyyellow-400))',
        500:  'hsl(var(--color-sandyyellow-500))',
        600:  'hsl(var(--color-sandyyellow-600))',
        700:  'hsl(var(--color-sandyyellow-700))',
        800:  'hsl(var(--color-sandyyellow-800))',
        900:  'hsl(var(--color-sandyyellow-900))',
        950:  'hsl(var(--color-sandyyellow-950))'
      },
      lightgreenishblue: {
        50:   'hsl(var(--color-lightgreenishblue-50))',
        100:  'hsl(var(--color-lightgreenishblue-100))',
        200:  'hsl(var(--color-lightgreenishblue-200))',
        300:  'hsl(var(--color-lightgreenishblue-300))',
        400:  'hsl(var(--color-lightgreenishblue-400))',
        500:  'hsl(var(--color-lightgreenishblue-500))',
        600:  'hsl(var(--color-lightgreenishblue-600))',
        700:  'hsl(var(--color-lightgreenishblue-700))',
        800:  'hsl(var(--color-lightgreenishblue-800))',
        900:  'hsl(var(--color-lightgreenishblue-900))',
        950:  'hsl(var(--color-lightgreenishblue-950))'
      },
      bluelotus: {
        50:   'hsl(var(--color-bluelotus-50))',
        100:  'hsl(var(--color-bluelotus-100))',
        200:  'hsl(var(--color-bluelotus-200))',
        300:  'hsl(var(--color-bluelotus-300))',
        400:  'hsl(var(--color-bluelotus-400))',
        500:  'hsl(var(--color-bluelotus-500))',
        600:  'hsl(var(--color-bluelotus-600))',
        700:  'hsl(var(--color-bluelotus-700))',
        800:  'hsl(var(--color-bluelotus-800))',
        900:  'hsl(var(--color-bluelotus-900))',
        950:  'hsl(var(--color-bluelotus-950))'
      }
    },
    extend: {},
  },
  plugins: [],
}

