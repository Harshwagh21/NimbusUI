# AGENTS.md — NimbusUI (frontend)

Workspace-wide rules are in `../AGENTS.md` and apply here too. This file covers the frontend.

## Stack — fixed

Next.js App Router · React · TypeScript (strict) · Tailwind CSS · TanStack Query · Zustand ·
React Hook Form · Zod · Vitest + React Testing Library.

No component library swap, no Redux, no CSS-in-JS, no data-fetching library other than
TanStack Query, without an ADR.

## The boundary that matters most

**Next.js is the UI. Go is the backend.** Business rules are never reimplemented here.

- No business logic in route handlers or server actions. Talk to the Go API.
- Never call the database or object storage directly from the frontend.
- Validation is intentionally duplicated: Zod gives instant feedback, the Go API does the
  actual enforcement. The client's copy is never treated as a guarantee.

## Layout

```text
app/
  (auth)/login · register
  (app)/drive · drive/[folderId] · shared · starred · recent · trash · settings
  s/[token]/                      public share view, unauthenticated
components/
  ui/       primitives: button, input, dialog, dropdown, toast, skeleton
  drive/    file grid, file row, breadcrumbs, context menu, empty states
  upload/   dropzone, upload drawer, progress item
  layout/   sidebar, topbar, storage meter
hooks/      useFiles · useFolders · useUploadQueue · useAuth
lib/
  api/      typed client + one module per resource
  upload/   XHR uploader, multipart orchestration
  utils/    formatBytes, formatDate, mimeToIcon
stores/     Zustand: selection, viewMode, uiState
types/      API types mirroring the Go DTOs
```

## State — three kinds, three tools, one rule

| Kind | Tool |
| --- | --- |
| Server data | TanStack Query |
| UI state | Zustand |
| Form state | React Hook Form + Zod |

**The rule: server data is never copied into Zustand.** The query cache is the single source
of truth for anything that came from the API. Zustand holds only selection, view mode,
sidebar and drawer state, and context-menu position.

Query keys are structured — `['files', folderId]`, `['folders', parentId]`, `['me']` — so a
mutation invalidates exactly what changed. Rename, move, and star are optimistic with
rollback; permanent delete and share revocation are confirmed, never optimistic.

## API access

All requests go through the typed client in `lib/api`. No bare `fetch` in a component.

The client owns the base URL, credentials mode, error-envelope parsing, and the 401 refresh
flow. Refresh is **single-flight**: concurrent 401s trigger one refresh and then replay, not a
stampede. If refresh fails, clear the session and redirect to login once.

Access tokens stay in memory. Refresh tokens live in an `HttpOnly` cookie set by the API and
are never read by JavaScript. Nothing sensitive goes in `localStorage`.

## Uploads

Use `XMLHttpRequest` with `upload.onprogress` — `fetch` cannot report upload progress, and a
progress bar is a requirement. `xhr.abort()` gives cancel for free.

The upload queue has a concurrency cap, per-file retry, per-file cancel, and survives
navigation within the app. Progress is announced via `aria-live` for screen readers.

## Component standards

- Server Components by default; add `'use client'` only when state, effects, or event handlers
  are actually needed.
- Under 150 lines per component. Extract logic into a hook before it grows past that.
- Props are explicitly typed. No `any`, no unexplained non-null assertions.
- Every async surface designs all four states: loading skeleton, empty, error with retry, and
  success. Shipping only the happy path is incomplete work.
- Reuse the primitives in `components/ui`. Check there before writing a new button or dialog.
- `formatBytes` and friends live in `lib/utils` — never reimplemented inline.

## UI/UX bar

- Keyboard first: arrows navigate the grid, `Enter` opens, `F2` renames, `Delete` trashes,
  `/` focuses search, `Esc` clears selection.
- Accessible: real labels, visible focus rings, `aria` attributes on menus and dialogs,
  contrast that passes AA, `prefers-reduced-motion` respected.
- Responsive from 360 px upward. The sidebar collapses; the grid reflows.
- Every destructive action is confirmed and every action gives feedback within 100 ms.
- Nimbus personality only in empty states, onboarding copy, and `/about`. Subtle.
- Original visual identity. Never copy Google Drive's branding or Dragon Ball artwork.

## Testing — write first

- Components: React Testing Library, asserting behaviour a user can observe. Query by role
  and label, not by class name or test id where a role exists.
- Hooks: tested with a mocked API client.
- Mock the API at the client boundary. Never hit a real backend in a unit test.
- Always cover the failure path: invalid credentials, a failed upload, an empty folder, a
  network error.

## Never do these

- Duplicate backend business rules
- Copy server data into a client store
- Put a secret or an object-storage credential in client code or `NEXT_PUBLIC_*`
- Trust a client-side validation result as authoritative
- Use `any`, or silence a type error with a cast instead of fixing it
- Leave a loading or error state undesigned

## Commands

```powershell
npm run dev · npm run build · npm run lint · npm run test · npm run test:watch
```

## Before finishing any task

1. `npm run lint`, `npm run test`, and `npm run build` are green
2. Keyboard navigation and focus order checked by hand
3. The Obsidian feature note is written or updated (see the documentation contract in `../AGENTS.md`)
4. `NC_Progress_Log.md` has an entry
