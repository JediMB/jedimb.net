/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public_html/**/*.{html,php,js}'],
  theme: {
    screens: {
      sm: '20rem',
      md: '37.5rem',
      lg: '55rem'
    },
    colors: {
      transparent:  'transparent',
      current:      'currentColor',
      white:        '#ffffff',
      black:        '#000000',
      gray: {
        50:   'hsl(0, 0%, 5%)',
        100:  'hsl(0, 0%, 10%)',
        200:  'hsl(0, 0%, 20%)',
        300:  'hsl(0, 0%, 30%)',
        400:  'hsl(0, 0%, 40%)',
        500:  'hsl(0, 0%, 50%)',
        600:  'hsl(0, 0%, 60%)',
        700:  'hsl(0, 0%, 70%)',
        800:  'hsl(0, 0%, 80%)',
        900:  'hsl(0, 0%, 90%)',
        950:  'hsl(0, 0%, 95%)'
      },
      hotpink: {
        50:   'hsl(330, 88%, 93%)',
        100:  'hsl(331, 88%, 90%)',
        200:  'hsl(330, 88%, 83%)',
        300:  'hsl(330, 88%, 77%)',
        400:  'hsl(330, 88%, 70%)',
        500:  'hsl(330, 88%, 67%)',
        600:  'hsl(330, 65%, 60%)',
        700:  'hsl(330, 43%, 47%)',
        800:  'hsl(330, 43%, 34%)',
        900:  'hsl(330, 43%, 20%)',
        950:  'hsl(331, 42%, 14%)'
      },
      sandyyellow: {
        50:   'hsl(54, 93%, 94%)',
        100:  'hsl(53, 95%, 91%)',
        200:  'hsl(53, 97%, 86%)',
        300:  'hsl(53, 96%, 80%)',
        400:  'hsl(53, 97%, 75%)',
        500:  'hsl(53, 97%, 72%)',
        600:  'hsl(53, 69%, 65%)',
        700:  'hsl(53, 38%, 50%)',
        800:  'hsl(53, 38%, 36%)',
        900:  'hsl(53, 38%, 22%)',
        950:  'hsl(53, 37%, 14%)'
      },
      lightgreenishblue: {
        50:   'hsl(154, 88%, 93%)',
        100:  'hsl(153, 92%, 90%)',
        200:  'hsl(153, 90%, 84%)',
        300:  'hsl(153, 91%, 77%)',
        400:  'hsl(153, 91%, 71%)',
        500:  'hsl(153, 90%, 68%)',
        600:  'hsl(153, 68%, 61%)',
        700:  'hsl(153, 43%, 47%)',
        800:  'hsl(153, 43%, 34%)',
        900:  'hsl(153, 42%, 20%)',
        950:  'hsl(153, 42%, 14%)'
      },
      bluelotus: {
        50:   'hsl(244, 79%, 93%)',
        100:  'hsl(244, 82%, 89%)',
        200:  'hsl(244, 80%, 82%)',
        300:  'hsl(244, 81%, 75%)',
        400:  'hsl(244, 80%, 68%)',
        500:  'hsl(244, 79%, 65%)',
        600:  'hsl(244, 60%, 58%)',
        700:  'hsl(244, 43%, 45%)',
        800:  'hsl(244, 43%, 33%)',
        900:  'hsl(244, 43%, 19%)',
        950:  'hsl(244, 42%, 13%)'
      }
    },
    extend: {
      gridTemplateColumns: {
        'sidebar-left': 'var(--sidebar-width, 120px) 1fr',
        'sidebar-right': '1fr var(--sidebar-width, 120px)'
      }
    },
  },
  plugins: [],
}

