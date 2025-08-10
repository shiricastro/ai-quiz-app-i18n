/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        edventure: {
          base:'#000000',
          light:'#fffcf8',
          secondary: '#E7CB2B',
          primary: '#23659D',
          red: '#cd4845',
        }
      },
      fontFamily: {
        questrial: ['Questrial', 'sans-serif'],
      },
      fontSize: {
        base: ['14px', { lineHeight: '1.5' }],
        heading: ['21px', { lineHeight: '1.3' }],
        subtitle: ['18px', { lineHeight: '1.4' }],
        small: ['12px', { lineHeight: '1.4' }],
        button: ['14px', { lineHeight: '1.4' }],
        'base-lg': ['17px', { lineHeight: '1.5' }],
        'heading-lg': ['30px', { lineHeight: '1.3' }],
        'subtitle-lg': ['22px', { lineHeight: '1.4' }],
        'small-lg': ['13px', { lineHeight: '1.4' }],
        'button-lg': ['17px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      spacing: {
        5: '20px',  
      },
    },
    
  },
  plugins: [],
}
