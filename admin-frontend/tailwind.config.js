/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
    },
    extend: {
      colors: {
        "primary": "var(--surface-a)",
        "secondary": '#00fefc',
        "background-blue-dark": "#16191e"
      },
      backgroundImage: {
        'robotaniumLogo': "url(../src/assets/images/icononly_transparent_nobuffer.png)",
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '50%': '50%',
        '16': '4rem',
      }
    },
  },
  plugins: [],
}

