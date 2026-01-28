# TeleZapys CRM

Telegram Mini App CRM for beauty masters. Built with Next.js App Router, Supabase, and Stripe subscriptions.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in your Supabase, Stripe, and Telegram credentials.

3. (Optional) Start Supabase locally:

```bash
npx supabase init
npx supabase start
```

4. Run the dev server:

```bash
npm run dev
```

## Notes

- Telegram `initData` is validated in `middleware.ts` for protected routes.
- Stripe webhooks are handled by `app/api/webhooks/stripe/route.ts`.
- Supabase Edge Functions live in `supabase/functions`.
- Database schema lives in `supabase/migrations`.
