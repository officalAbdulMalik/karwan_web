---
name: nextjs-production
description: "Use for all Next.js, TypeScript, React, styling, architecture, data-access, API, and UI work in this project."
applyTo: "src/**/*.{ts,tsx,css},next.config.ts,tsconfig.json,package.json,eslint.config.mjs"
---

# Next.js Production Instructions

Build this project as a production Next.js application using the App Router, TypeScript, and server-first rendering. Keep changes consistent with the repository's existing conventions and make the smallest complete change that satisfies the request.

## Architecture

- Keep route files in `src/app` thin. They own URLs, layouts, metadata, loading and error states, and composition only.
- Organize business capabilities in `src/features/<feature>`. Keep feature components, schemas, actions, server queries, services, DTOs, and types together.
- Use `src/components/ui` for generic visual primitives, `src/components/layout` for shells and navigation, and `src/components/shared` for reusable product components.
- Use `src/server` for shared server infrastructure such as authentication, database access, observability, and rate limiting.
- Use `src/config` for typed non-secret configuration and `src/lib` for small framework-independent utilities.
- A feature may import another feature only through that feature's deliberate public `index.ts` API. Do not reach into private implementation files.
- Keep route-only components in a private `_components` folder until they represent a reusable business concept.
- Do not add abstractions, global state, providers, or dependencies without a concrete use case.

Recommended shape for new features:

```text
src/features/<feature>/
  actions/
  components/
  schemas/
  server/
  types/
  index.ts
```

## Server and client boundaries

- Server Components are the default. Add `use client` only to the smallest interactive leaf that needs state, effects, browser APIs, event handlers, or a client-only library.
- Never import database clients, secrets, auth internals, server-only feature modules, or environment validation into Client Components.
- Add `import 'server-only'` to database, auth, environment, Data Access Layer, and other secret-bearing server modules.
- Read data directly through server-only functions from Server Components. Do not call the application's own Route Handler from a Server Component.
- Pass small, serializable DTOs to Client Components. Never pass raw ORM records or private fields.
- Prefer native forms and Server Actions with `useActionState` for first-party mutations. Use client form libraries only for genuinely complex forms.

## Data access and security

- Treat every Server Action and Route Handler as a public entry point.
- Every read or mutation involving private data must authenticate, authorize the specific resource or tenant, validate untrusted input, perform the operation safely, and return only the minimum safe result.
- Keep feature-specific queries and services in `src/features/<feature>/server`.
- Queries should return explicit DTOs, not database models. Map dates and other non-serializable values before crossing a client boundary.
- Put business operations and transactions in services, not pages or UI components.
- Validate Server Action input, route params, query strings, headers, and request bodies with Zod at the trust boundary.
- Use stable typed action results with `ok`, `data`, `message`, and optional `fieldErrors` fields.
- Revalidate affected paths or tags after successful mutations, before redirecting.
- Never expose stack traces, raw database errors, secrets, session tokens, authorization headers, payment data, or unnecessary personal data.
- For multi-tenant data, include tenant or organization scope in every query and mutation, not only in UI filters.

## Routing and rendering

- Use route groups such as `(marketing)`, `(auth)`, `(app)`, and `(admin)` when layouts or access boundaries differ without changing URLs.
- Add `loading.tsx`, `error.tsx`, and `not-found.tsx` when the route has meaningful loading, recovery, or missing-resource states.
- Use Suspense around slow, independent content with a skeleton that approximates the final layout.
- Parallelize independent server reads with `Promise.all`; avoid request waterfalls.
- Use URL search params for shareable filters, sorting, pagination, search, and selected tabs.
- Keep persistent business state in the database, temporary UI state local, and global client state rare and narrowly scoped.
- Decide caching per read. Keep authenticated and permission-sensitive data fresh unless a reviewed, user-scoped cache policy exists.
- Do not enable experimental or project-wide caching behavior casually; document the chosen policy when introducing it.

## UI and accessibility

- Follow the existing design system. Prefer semantic tokens such as `background`, `foreground`, `card`, `primary`, `muted`, `destructive`, `success`, `warning`, `border`, and `ring` over color-specific APIs.
- Reuse existing UI primitives before creating new ones. Keep components focused, composable, keyboard accessible, and resilient to long labels and localized content.
- Use Lucide icons when an icon is appropriate. Icon-only controls need an accessible name and a tooltip when the meaning is not obvious.
- Use semantic HTML before ARIA. Every input needs a visible associated label, every error needs a related description, and every interactive control needs a visible focus state.
- Preserve a logical heading hierarchy, landmarks, keyboard order, and screen-reader names. Do not rely on color alone to communicate state.
- Every page and component design must be fully responsive on mobile as well as desktop. Build mobile-first, support at least 320px widths, and verify common intermediate widths instead of designing only for one desktop and one phone size.
- Make layouts, typography, navigation, forms, buttons, dialogs, tables, media, and interactive states adapt without horizontal overflow, clipped text, overlapping content, or inaccessible controls. Use content-driven sizing and intentional scrolling when a wide data table cannot collapse.
- Avoid fixed heights for text containers and preserve stable dimensions for grids, tables, controls, and media.
- Design loading, empty, error, unauthorized, partial, offline or retry, and success states when they apply.
- Respect `prefers-reduced-motion`, maintain WCAG 2.2 AA contrast, and keep touch targets approximately 44px or larger where practical.
- Use `next/image` with stable dimensions or aspect ratios and `next/font` for fonts. Do not introduce decorative gradients, blobs, or oversized marketing layouts into product screens.

## Forms, actions, and APIs

- Use a single shared Zod schema for client hints and server validation; client validation is never a security boundary.
- Preserve user input after validation errors, show field-level errors, prevent duplicate submissions, and expose pending and success status through accessible live regions where useful.
- Use Route Handlers only for public HTTP contracts, webhooks, mobile clients, file or stream responses, or integrations. Authenticate or verify signatures, validate all input, authorize access, and map failures to stable safe responses.
- For destructive actions, name the resource, state whether recovery is possible, use an explicit destructive label, disable while pending, and make repeated requests idempotent when possible.

## TypeScript and naming

- Keep strict TypeScript enabled. Prefer inferred types from schemas and functions; use `unknown` for untrusted input and narrow it safely. Do not use `any` to silence errors.
- Model finite states with unions instead of free-form strings. Avoid one-letter variables and vague names such as `data`, `helper`, `manager`, or `common` when a specific name is available.
- Use PascalCase for components, kebab-case for component files, `use` prefixes for hooks, verb plus `Action` for Server Actions, `get` or `list` for queries, and noun plus `Schema` or `Dto` for schemas and DTOs.

## Testing and validation

- Test schemas, formatters, calculations, permission rules, reducers, services, and other pure business logic with the repository's configured unit-test tooling when present.
- Use Playwright for critical user journeys, authentication, role-based permissions, async Server Components, deep links, and responsive smoke tests when configured.
- Prefer role, label, and text locators over implementation details or test IDs.
- After changes, run the narrowest relevant check first, then use the available project checks. The standard targets are:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- Do not claim a change is complete without reporting validation status. Do not fix unrelated failures unless they block the requested change.

## Project hygiene

- Keep secrets out of source control. Use `.env.example` with safe placeholders and validate server environment variables in a server-only module when environment configuration is introduced.
- Keep `next.config.ts`, ESLint, TypeScript, and package scripts aligned with the current Next.js version. Do not use removed commands such as `next lint`.
- Update documentation when a new architectural convention, environment variable, public API, or setup step is introduced.
- Never commit changes or create branches unless explicitly requested.
