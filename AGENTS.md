<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Conventions

### Page/Feature Organization

Each page is a feature. Its route folder `src/app/<feature>/` is self-contained — everything the feature uses is created inside it:

* `page.tsx` — the route; stays thin and renders the feature's components
* `actions/` — pure async functions that call the API (`<verb><Entity>Action.ts`)
* `hooks/` — TanStack Query hooks (`useQuery`/`useMutation`) that wrap the actions
* `components/`, `validations/`, `utils/`, `context/` — feature-specific UI and logic

Example: `src/app/login/` → `page.tsx`, `components/login-form.tsx`, `validations/auth.ts`.

Notes:

* Shared code outside the feature (shadcn components in `src/components/ui/`, `src/lib/`) is imported, never copied into the feature.
* Import feature files with the `@/app/<feature>/...` alias.
* Colocating is safe in the App Router: only special files (`page.tsx`, `route.ts`, `layout.tsx`, …) become routes.
* Don't create `src/pages/` — it is the Pages Router directory and every file in it would become a route.
* `actions/` here are client-side API calls, not Next.js Server Actions (`"use server"`).
