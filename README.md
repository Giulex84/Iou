# IOU Pi DApp

A Pi-styled IOU tracker built with Next.js and React. It stores IOUs in Supabase and integrates with the Pi Browser SDK for authenticated, Pi-first experiences.

## Stack Overview

- **Next.js / React** – provides the hybrid app shell, routing, server actions, and the interactive component model that powers each IOU screen.
- **Supabase** – offers the Postgres database and generated APIs the app uses to persist IOUs with the finalized schema (description, amount, other_party, direction, created_by_uid, is_settled).
- **Pi Browser SDK** – delivers Pi-first capabilities so the DApp can authenticate Pi users, launch compliant Pi payments, and run smoothly inside the Pi Browser.

## Key Technologies

- **Next.js + React** – provides the app shell, client/server components, routing, and the interactive UI.
- **Supabase** – supplies the Postgres database, authentication sync, and row-level APIs used to persist IOUs (description, amount, involved party, transaction type, and settlement state).
- **Pi Browser SDK** – connects the DApp to the Pi ecosystem so users can authenticate and test payments directly inside the Pi Browser.

## Development

1. Install dependencies with `npm install`.
2. Run the development server with `npm run dev` and open the Pi Browser or your browser at the shown URL.
3. Set `NEXT_PUBLIC_PI_SANDBOX=true` (default) and provide `PI_TESTNET_API_KEY` so payments run in the official Pi testnet sandbox.
4. Update Supabase credentials in `lib/supabase.ts` to point to your project.
5. Deploy with your preferred Next.js hosting provider.

## Compliance Checklist

- Pi SDK is loaded in `app/layout.tsx` with `PiProvider` enforcing Pi Browser usage and authentication before payment flows.
- Payments are created with the SDK in `hooks/usePiPayment.ts` and completed server-side through `/api/payment/*` routes using the sandbox API by default (`NEXT_PUBLIC_PI_SANDBOX=true`).
- `PI_TESTNET_API_KEY` is required for server payment actions; production can switch to mainnet by setting `NEXT_PUBLIC_PI_SANDBOX=false` and `PI_API_KEY`.
- The UI is designed to run inside Pi Browser, surfacing authentication status and test-payment prompts so the DApp is review-ready for the Pi Core Team.
- Legacy `/api/pi/*` endpoints and unused history components have been removed so only the compliant Pi payment flow ships in the app bundle.
