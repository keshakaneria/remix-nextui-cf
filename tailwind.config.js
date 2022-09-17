/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

// "postinstall": "remix setup cloudflare",
//     "build": "remix build",
//     "dev:remix": "remix watch",
//     "dev:wrangler": "cross-env NODE_ENV=development wrangler pages dev ./public",
//     "dev": "remix build && run-p dev:*",
//     "start": "cross-env NODE_ENV=production npm run dev:wrangler"