# PORTFOLIO COMPONENTS DIRECTORY

## OVERVIEW
Financial planning portfolio editing domain - 4 files for editor, preview, charts, and types.

## STRUCTURE
```
portfolio/
├── Charts.tsx              # Allocation chart visualization (1.1K bytes)
├── PortfolioEditor.tsx     # Main wizard component (584 lines, 40+ props)
├── PortfolioPreview.tsx     # PDF preview component (5.7K bytes)
└── types.ts                # Shared TypeScript interfaces (44 lines)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| Main editor | PortfolioEditor.tsx | 584 lines, 5 wizard steps, 40+ props |
| Chart visualization | Charts.tsx | Uses Recharts for allocation display |
| PDF preview | PortfolioPreview.tsx | Renders portfolio for html2canvas/jsPDF export |
| Type definitions | types.ts | Instrument, AsignacionEstrategica, Riesgo, etc. |

## CONVENTIONS

### Wizard Pattern
- 5 steps: Profile → Health → Goals → Portfolio → Other
- Conditional rendering: One section per step
- Props interface: 40+ fields passed from parent

### Component Coupling
- Imports from: src/components/ui/* (many UI components)
- Imports from: src/components/portfolio/types.ts
- Imports from: src/components/portfolio/Charts.tsx

### Data Flow
- Receives all state via props (no Context)
- Emits changes via onChange callbacks
- No internal state management

## ANTI-PATTERNS
- 40+ props interface - consider React Context for wizard state
- 584 lines with 5 conditional sections - extract step components
- Props drilling extreme - parent passes through 40+ props

## NOTES
- types.ts exported to page.tsx and PortfolioPreview
- No barrel export - types imported directly as `@/components/portfolio/types`
