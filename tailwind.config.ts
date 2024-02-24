import type { Config } from "tailwindcss"
import plugin from 'tailwindcss/plugin'

const config = {
  darkMode: ["class"],
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "sm": "640px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Varela Round"', "sans-serif"],
        customs: ['"Among Us"', '"Varela Round"']
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        custom: 'inset 0px 2px 0px 0px rgba(255,255,255,.15), 0px 3px 0px 0px rgba(255,255,255,0.15)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      textShadow: {
        custom: 'rgb(23, 5, 87) 3px 0px 0px, rgb(23, 5, 87) 2.83487px 0.981584px 0px, rgb(23, 5, 87) 2.35766px 1.85511px 0px, rgb(23, 5, 87) 1.62091px 2.52441px 0px, rgb(23, 5, 87) 0.705713px 2.91581px 0px, rgb(23, 5, 87) -0.287171px 2.98622px 0px, rgb(23, 5, 87) -1.24844px 2.72789px 0px, rgb(23, 5, 87) -2.07227px 2.16926px 0px, rgb(23, 5, 87) -2.66798px 1.37182px 0px, rgb(23, 5, 87) -2.96998px 0.42336px 0px, rgb(23, 5, 87) -2.94502px -0.571704px 0px, rgb(23, 5, 87) -2.59586px -1.50383px 0px, rgb(23, 5, 87) -1.96093px -2.27041px 0px, rgb(23, 5, 87) -1.11013px -2.78704px 0px, rgb(23, 5, 87) -0.137119px -2.99686px 0px, rgb(23, 5, 87) 0.850987px -2.87677px 0px, rgb(23, 5, 87) 1.74541px -2.43999px 0px, rgb(23, 5, 87) 2.44769px -1.73459px 0px, rgb(23, 5, 87) 2.88051px -0.838247px 0px',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), 
  require('tailwindcss-textshadow'),
// function ({ addUtilities, addVariant }) {
//       // addVariant('data-open', '&:[data-state=open]')
//       addUtilities({
//         '.line-loading-bg': {
//           background: 'rgb(0, 0, 0)',
//           background:
//             'linear-gradient(90deg,rgba(0, 0, 0, 0) 0%,rgba(255, 255, 255, 0.65) 50%,rgba(0, 0, 0, 0) 100%)',
//         },
//         '.line-loading-bg-light': {
//           background: 'rgb(0, 0, 0)',
//           background:
//             'linear-gradient(90deg,rgba(0, 0, 0, 0) 0%,rgba(33, 33, 33, 0.65) 50%,rgba(0, 0, 0, 0) 100%)',
//         },
//         ".dropdown-content[data-state='open']": {
//           animation: 'fadeIn 50ms ease-out',
//         },
//         ".dropdown-content[data-state='closed']": {
//           animation: 'fadeOut 50ms ease-in',
//         },
//         "[data-state='open'] .accordion-content-animation": {
//           animation: 'slideDown 200ms ease-out',
//         },
//         "[data-state='closed'] .accordion-content-animation": {
//           animation: 'slideUp 200ms ease-in',
//         },
//         '.text-code': {
//           margin: '0 0.2em',
//           padding: '0.2em 0.4em 0.1em',
//           background: 'hsla(0, 0%, 58.8%, 0.1)',
//           border: '1px solid hsla(0, 0%, 39.2%, 0.2)',
//           borderRadius: '3px',
//         },
//         '.no-scrollbar': {
//           /* Hide scrollbar for IE, Edge*/
//           '-ms-overflow-style': 'none',

//           /* Firefox */
//           'scrollbar-width': 'none' /* Firefox */,

//           /* Hide scrollbar for Chrome, Safari and Opera */
//           '&::-webkit-scrollbar': {
//             display: 'none',
//           },
//         },
//         /* Add fadeout effect */
//         '.mask-fadeout-right': {
//           '-webkit-mask-image': 'linear-gradient(to right, white 98%, transparent 100%)',
//           'mask-image': 'linear-gradient(to right, white 98%, transparent 100%)',
//         },
//         '.mask-fadeout-left': {
//           '-webkit-mask-image': 'linear-gradient(to left, white 98%, transparent 100%)',
//           'mask-image': 'linear-gradient(to left, white 98%, transparent 100%)',
//         },
//         'input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button':
//           {
//             '-webkit-appearance': 'none',
//             margin: '0',
//           },
//       })
//       addVariant('data-open-parent', '[data-state="open"] &')
//       addVariant('data-closed-parent', '[data-state="closed"] &')
//       addVariant('data-open', '&[data-state="open"]')
//       addVariant('data-closed', '&[data-state="closed"]')
//       addVariant('data-show', '&[data-state="show"]')
//       addVariant('data-hide', '&[data-state="hide"]')
//       addVariant('data-checked', '&[data-state="checked"]')
//       addVariant('data-unchecked', '&[data-state="unchecked"]')
//       addVariant('aria-expanded', '&[aria-expanded="true"]')
//       // addVariant('parent-data-open', '[data-state="open"]&')
//     },
],
} satisfies Config

export default config