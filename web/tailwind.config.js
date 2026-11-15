/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Architecture Palette
        editorial: {
          bg: '#EAE8DE',      // warm ivory
          surface: '#F3F1E9', // light surface
          text: '#111713',    // deep forest ink
          muted: '#596B78',   // slate
          divider: '#C9CCC1', // neutral divider
          accent: '#668C78',  // mangrove accent
          water: '#4F91A5',   // water / contextual accent
          earth: '#B18B59',   // earth / caution accent
          warning: '#B66C50', // warning / alert accent
          env: '#8B9A69',     // supporting environmental info
        },
        gis: {
          bg: '#111713',      // deep forest charcoal
          panel: '#202B24',   // dark panel
          surface: '#17221A', // deep elevation surface
          text: '#EAE8DE',    // warm ivory text
          muted: '#A9B5A5',   // sage muted text
          slate: '#596B78',   // slate
          divider: '#2C3A31', // subtle divider
          accent: '#668C78',  // mangrove accent
          water: '#4F91A5',   // water accent
          earth: '#B18B59',   // earth accent
          warning: '#B66C50', // alert accent
          env: '#8B9A69',     // environmental accent
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
