# SRC DIRECTORY

## OVERVIEW
Main source directory containing Next.js 16 App Router application with React components, hooks, utilities, and API routes.

## STRUCTURE
```
src/
├── app/              # Next.js App Router (pages + API routes)
│   ├── layout.tsx
│   ├── page.tsx       # Main application page (579 lines, 51 useState hooks)
│   ├── globals.css
│   └── api/
│       ├── route.ts
│       └── generate-plan/
│           └── route.ts  # PDF generation API (14 lines)
├── components/        # React components (52 files)
│   ├── ui/          # 48 shadcn/ui components
│   └── portfolio/   # Portfolio editor + preview + charts + types (4 files)
├── hooks/            # Custom React hooks (2 files)
└── lib/             # Utilities (db, generatePlan, utils - 3 files)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| Main app logic | src/app/page.tsx | 579 lines - 51 useState hooks, wizard, library |
| Portfolio generation | src/lib/generatePlan.ts | 1,561 lines - HTML template generator with embedded CSS |
| API endpoints | src/app/api/ | generate-plan endpoint (14 lines) wraps generatePlan |
| Component types | src/components/portfolio/types.ts | Shared TypeScript interfaces |

## CONVENTIONS

### State Management
- **Local component state**: 51 useState hooks in page.tsx (anti-pattern - consider Zustand)
- **No global state**: Zustand and TanStack Query listed in package.json but NOT used
- **localStorage persistence**: Auto-saves every 1s with debounce
- **Prop drilling**: Extensive props passed to PortfolioEditor and PortfolioPreview

### Code Organization
- **Feature-based**: src/components/portfolio/ contains editor, preview, charts, types
- **UI library**: src/components/ui/ has 48 shadcn/ui Radix primitives
- **Utilities**: src/lib/ for shared functions (utils, db, generatePlan)

### Import/Export Patterns
- No barrel exports (no index.ts files)
- Uses @/ path alias mapping to ./src/*
- Direct file imports throughout
- No circular dependencies detected

### Anti-Patterns
- **Massive duplication**: 12 files at root (page_*, editor_*, route_*) contain duplicate code
- **Prisma unused**: db.ts never imported - app uses localStorage

## COMMANDS
```bash
# Run dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## NOTES
- src/lib/generatePlan.ts is largest file in project (1,561 lines)
- src/app/page.tsx contains entire application (579 lines, 51 useState hooks)
- No barrel exports - all imports use direct file paths
- Only 1 truly shared utility: cn() from src/lib/utils.ts (44 imports)
