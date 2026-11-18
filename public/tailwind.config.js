/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Neutral scale from the "Inbox Ledger — App Design" mockups.
        gray: {
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
        canvas: '#F6F7F9',
        brand: {
          50: '#E6F4F1',
          100: '#CCFBEF',
          600: '#0F766E',
          700: '#115E59',
        },
        warn: {
          600: '#DC6803',
          700: '#B54708',
        },
        danger: {
          50: '#FEF3F2',
          600: '#D92D20',
          700: '#B42318',
        },
        info: {
          50: '#EFF8FF',
          700: '#175CD3',
        },
        success: {
          500: '#12B76A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
