# HN Electronics Storefront

Next.js frontend storefront for HN Electronics. Queries custom backend catalog API.

## Setup

1. Copy `.env.local.example` to `.env.local` (or configure manually).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Configuration

Set backend URL in `.env.local`:
```env
WC_BASE_URL=http://localhost:8787/api
NEXT_PUBLIC_WC_BASE_URL=http://localhost:8787/api
```
