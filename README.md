# KindPC India

KindPC is an AI-powered buying advisor for Indian shoppers choosing a laptop, desktop, or custom PC build. It turns a buyer's budget and intended use into practical recommendations with compatibility checks, clear explanations, direct product links, and price context.

## Features

- Guided brief for product type, use case, budget, and priority
- Laptop recommendations for gaming, coding, AI, study, and creative work
- Complete custom PC builds with component compatibility checks
- Hard budget enforcement
- Direct retailer product links and transparent price timestamps
- Best-value, performance, and upgrade-friendly modes
- Warnings for PSU quality, BIOS support, clearance, and bottlenecks
- Responsive chat interface for mobile and desktop

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm start
```

## Environment variables

```text
GEMINI_API_KEY=your_server_side_key
OPENAI_API_KEY=your_server_side_key
```

Keep API keys in server-side environment variables. Never commit them to the repository.

## Live site

[Open KindPC India](https://kindpc-india-git-main-munugurayash2008-4311s-projects.vercel.app)

## Main source files

- `app/page.tsx` — advisor interface and guided brief
- `app/api/agent/route.ts` — server-side AI endpoint
- `lib/catalog.ts` — verified product catalogue
- `lib/recommender.ts` — budget-aware recommendation logic
- `lib/market.ts` — retailer and market-price handling
- `lib/agent.ts` — AI advisor instructions and response logic
