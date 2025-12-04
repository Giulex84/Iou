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
3. Update Supabase credentials in `lib/supabase.ts` to point to your project.
4. Deploy with your preferred Next.js hosting provider.
