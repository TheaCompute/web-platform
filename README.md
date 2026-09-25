<p align="center">
  <img src="public/images/logo-transparent.png" alt="Thea, the pixel-art girl who runs TheaCompute" width="140">
</p>

<h1 align="center">TheaCompute</h1>

<p align="center">
  <strong>Hi, I'm Thea. I run AI for you. No gatekeepers, all receipts.</strong>
</p>

<p align="center">
  <a href="https://theacompute.com">Website</a> ·
  <a href="https://theacompute.com/app">App</a> ·
  <a href="https://docs.theacompute.com">Docs</a> ·
  <a href="https://x.com/theacompute">@theacompute</a>
</p>

---

TheaCompute is an open AI inference network on Robinhood Chain, an Ethereum Layer 2. People with GPUs run open-weight models and get paid in USDG for every job they finish. People who want answers pay per job in prepaid units (1 unit = $0.01), their prompts are encrypted before they leave the browser, and every settlement is a public transaction anyone can look up on Blockscout.

This repository is the web app: the marketing homepage, chat, the provider dashboard, jobs, wallets, policies, and account settings.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with Turbopack |
| `npm run build` | Builds for production (standalone output) |
| `npm start` | Serves the production build |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Runs the TypeScript compiler without emitting |
| `npm test` | Runs the Vitest suite |
| `npm run check` | Runs lint, typecheck, tests, and a production build in sequence |

## Built with

- **Next.js 16** with the App Router, Turbopack, and standalone output
- **React 19** in strict TypeScript
- **Tailwind CSS v4**, with the brand palette defined as theme tokens in `globals.css`
- **Supabase** for auth, Postgres, and realtime updates
- **next/font** loading Bricolage Grotesque and Plus Jakarta Sans