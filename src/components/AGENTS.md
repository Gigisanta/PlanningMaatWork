# COMPONENTS DIRECTORY

## OVERVIEW
52 React components organized into feature-based subdirectories (portfolio domain) and UI library (shadcn/ui).

## STRUCTURE
```
components/
├── portfolio/          # Portfolio editing domain (4 files, 584 lines max)
│   ├── Charts.tsx       # Allocation chart component
│   ├── PortfolioEditor.tsx  # Main wizard component (584 lines, 40+ props)
│   ├── PortfolioPreview.tsx  # PDF preview component
│   └── types.ts         # Shared interfaces (Instrument, Riesgo, etc.)
└── ui/                 # shadcn/ui library (48 files, 726 lines max)
    └── sidebar.tsx      # Largest UI component (726 lines, compound pattern)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| Portfolio editor | portfolio/PortfolioEditor.tsx | 584 lines, 40+ props, 5 wizard steps |
| Portfolio types | portfolio/types.ts | 44 lines, shared interfaces |
| Allocation chart | portfolio/Charts.tsx | 1.1K bytes, uses Recharts |
| UI components | ui/*.tsx | 48 shadcn/ui components - wrapper pattern |

## CONVENTIONS

### Component Organization
- Feature-based: portfolio/ contains domain-specific components
- UI library separation: ui/ for generic shadcn/ui components
- Type sharing: portfolio/types.ts imported by page.tsx, PortfolioEditor, PortfolioPreview

### Props Pattern
- PortfolioEditor receives 40+ props (anti-pattern - consider Context)
- Extensive prop drilling from page.tsx to PortfolioEditor
- No global state: Zustand installed but unused

### UI Components
- Wrapper pattern: Each wraps Radix UI primitive with Tailwind styling
- Compound components: sidebar.tsx uses React Context for sub-components
- Class merging: Uses cn() utility from src/lib/utils.ts

## ANTI-PATTERNS
- PortfolioEditor has 40+ props - consider React Context for wizard state
- No barrel exports - no index.ts for cleaner imports
- Props drilling extreme - page.tsx passes through 40+ props to PortfolioEditor

## NOTES
- shadcn/ui follows standard "new-york" design system
- All UI components import cn() utility from src/lib/utils.ts
- portfolio/types.ts is the only shared types file (no index.ts)
