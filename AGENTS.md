# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-04 19:57:00 PM
**Updated:** 2026-03-04 21:00:00 PM
**Commit:** 604f153
**Branch:** main

## OVERVIEW
Next.js 16 financial planning application for Argentine market - generates PDF investment portfolios with client data, strategic allocation, and risk analysis. Uses Z.ai Code Scaffold with shadcn/ui components.

## STRUCTURE
```
./
├── src/
│   ├── app/              # Next.js 16 App Router (pages + API routes)
│   ├── components/        # React components (52 files)
│   │   ├── ui/          # 48 shadcn/ui components
│   │   └── portfolio/   # Portfolio editor + preview + types (4 files)
│   ├── hooks/            # Custom React hooks (use-toast, use-mobile, useLocalStorage)
│   ├── lib/             # Utilities (db, generatePlan, utils, pdf-cache)
│   ├── stores/           # Zustand state management (portfolio-store.ts)
│   └── types/           # Centralized type definitions (portfolio.ts)
├── prisma/              # Prisma schema (unused - app uses localStorage)
├── public/              # Static assets
├── .zscripts/           # Custom build/start scripts
└── Caddyfile            # Reverse proxy on port 81
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| Portfolio generation logic | src/lib/generatePlan.ts | 1,561 lines - HTML template generator with embedded CSS |
| Portfolio editor/preview | src/components/portfolio/ | PortfolioEditor (584 lines), PortfolioPreview, Charts, types.ts |
| API routes | src/app/api/ | generate-plan endpoint (14 lines), generic /api route |
| UI components | src/components/ui/ | 48 shadcn/ui components - sidebar.tsx is largest (726 lines) |
| Main page | src/app/page.tsx | 579 lines - wizard + library + 51 useState hooks |
| State management | src/stores/portfolio-store.ts | Zustand store (533 lines) - centralized state, actions, localStorage |
| Types | src/types/portfolio.ts | Centralized type definitions (imports from store) |
| Custom hooks | src/hooks/ | useLocalStorage, use-toast, use-mobile |
| PDF cache | src/lib/pdf-cache.ts | In-memory cache with 5-minute TTL |

## CONVENTIONS

### Build
- Uses Bun (not npm/yarn) - `bun install`, `bun run build`
- Standalone output: `next build` then copy static assets to `.next/standalone/`
- Custom scripts in `.zscripts/` (build.sh, start.sh, mini-services-*)
- Production: `bun .next/standalone/server.js`

### Linting
- ESLint 9 flat config with 26+ disabled rules
- TypeScript `noImplicitAny: false` (less strict)
- Next.js `typescript.ignoreBuildErrors: true` (build ignores type errors)
- React strict mode: true (enabled 2026-03-04)

### Deployment
- Caddy reverse proxy on port 81 (not 80/443)
- Caddy forwards `/` to localhost:3000
- WebSocket path: `/` with `XTransformPort` query param
- No CI/CD pipeline (no GitHub Actions, no Makefile)

### UI
- shadcn/ui components with "new-york" style
- Tailwind CSS 4 with custom HSL color scheme
- Path alias: `@/*` maps to `./src/*`
- Dark mode: class-based (`next-themes`)

### Import/Export Patterns
- No barrel exports (no index.ts files)
- Uses direct file imports with @/ alias
- No circular dependencies detected
- Only 1 truly shared utility: `cn()` from src/lib/utils.ts

## ANTI-PATTERNS (THIS PROJECT)
- No test infrastructure - no test files, no testing framework installed
- Hardcoded paths in build.sh: `/home/z/my-project` (line 13)
- Prisma unused: src/lib/db.ts is never imported (app uses localStorage)
- ESLint rules disabled: 26+ rules turned off (no-explicit-any, no-unused-vars, etc.)
- Type safety issues: 82 `any` type usages across codebase (needs to be addressed)
- Zustand store created but not yet integrated into page.tsx (requires migration)
- generatePlan.ts has embedded CSS (~1000 lines) - should be extracted to separate file

## UNIQUE STYLES
- CACTUS color palette: cactusDark (#2D5A3D), terracotta (#C17F59), sandLight (#F5F0E8)
- Financial planning wizard with 5 steps: Profile → Health → Goals → Portfolio → Other
- Portfolio library with 3 official templates (Conservador, Moderado, Agresivo)
- Local storage: auto-saves configuration every 1s with debounce
- PDF export using html2canvas + jsPDF
- Weight normalization: `adjustWeights()` distributes percentage changes across unlocked items
- Single-page app: src/app/page.tsx contains entire application (579 lines, 51 useState hooks)

## COMMANDS
```bash
bun run dev          # Dev server on port 3000 (logs to dev.log)
bun run build        # Production build + copy assets
bun run start        # Production server (logs to server.log)
bun run lint         # ESLint
bun run db:push     # Prisma schema sync (unused - app uses localStorage)
bun run db:generate  # Prisma client generation
bun run db:migrate   # Prisma migrations
bun run db:reset     # Reset database
```

## NOTES
- **Project uses Bun** - not npm/yarn/pnpm
- **Testing: None** - No test framework configured, no test files found
- **Database: Unused** - Prisma schema exists but app uses localStorage for all data
- **Large files**: generatePlan.ts (1,561 lines), sidebar.tsx (726 lines), PortfolioEditor.tsx (584 lines), page.tsx (579 lines)
- **Duplicate files at root**: 12 files (page_*, editor_*, route_*) confirmed - cleanup completed 2026-03-04
- **Caddyfile on port 81** - Document this for deployment teams
- **No CI/CD**: Manual deployment via .zscripts/ only
- **No barrel exports**: All imports use direct file paths
- **New files added** (2026-03-04): 
  - src/stores/portfolio-store.ts (533 lines) - Zustand store with all state and actions
  - src/hooks/useLocalStorage.ts - Custom hook for localStorage persistence
  - src/lib/pdf-cache.ts - In-memory cache for PDF generation with 5-minute TTL
  - src/types/portfolio.ts - Centralized type definitions
- **React Strict Mode enabled** - 2026-03-04 (next.config.ts: reactStrictMode: true)
- **Code splitting completed** - 2026-03-04 (evaluated and documented - components too coupled for lazy loading)
