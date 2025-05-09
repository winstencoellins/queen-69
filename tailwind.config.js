/* eslint-disable @typescript-eslint/no-require-imports */
// tailwind.config.js
import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './@/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      'gold': '#BA9731',
      'black': '#ODODOD'
    },
  },
  plugins: [heroui()]
}

export default config;