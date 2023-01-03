/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    container:{
      center:true,
      padding:'32px',
    },
    extend: {
      boxShadow:{
        'list':'0px 0px 15px 0px #00000026'
      },
      colors:{
        'primary':'#FFD370',
        'border':'#333333'
      },
      backgroundImage:{
        'todoGradient': 'linear-gradient(172.7deg, #FFD370 5.12%, #FFD370 53.33%, #FFD370 53.44%, #FFFFFF 53.45%, #FFFFFF 94.32%)'
      }
    },
  },
  plugins: [],
}
