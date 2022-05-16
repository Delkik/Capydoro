module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'level-glow-color': 'rgb(199, 5, 5)',
        'focus-glow': 'rgb(199, 5, 5)',
        'short-break-glow': 'rgb(255, 255, 255)',
        'long-break-glow': 'rgb(40, 129, 217)'
      },

      backgroundImage: {
        'level-bara': "url('/capybara-pomo.png')"
      },

      keyframes: {
        modalSlideIn: {
          '0%': {
            transform: 'translateY(100vh)'
          },
          '100%': {
            transform: 'translateY(0px)'
          }
        },
        loadingSpin: {
          '0%': {
            transform: 'rotate(0)'
          },
          '100%': {
            transform: 'rotate(360)'
          }
        },
        profileSlideIn: {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(-2rem)'
          }
        }
      },

      animation: {
        modalSlideIn: 'modalSlideIn 0.5s ease',
        loadingSpin: 'loadingSpin 1s infinite linear',
        profileSlideIn: 'profileSlideIn 0.4s forwards linear',
      }
    },
  },
  plugins: [],
}
