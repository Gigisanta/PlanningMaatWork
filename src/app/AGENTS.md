# APP DIRECTORY

## OVERVIEW
Next.js 16 App Router directory containing the main application page, API routes, and global layout.

## STRUCTURE
```
app/
├── layout.tsx              # Root layout with providers (theme, toast)
├── page.tsx               # Main financial planning wizard (557 lines)
├── globals.css             # Global styles with Tailwind directives
└── api/
    ├── route.ts            # Generic API route handler
    └── generate-plan/
        └── route.ts    # POST /api/generate-plan (390 lines)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| Main page | page.tsx | 579 lines - wizard, library, 51 useState hooks |
| PDF generation | api/generate-plan/route.ts | 14 lines - POST endpoint wrapping generatePlan.ts |

## CONVENTIONS

### File Organization
- **App Router pattern**: Files map to URL routes (/ → page.tsx, /api/generate-plan → route.ts)
- **Route handlers**: API routes export async functions with HTTP methods
- **Page components**: Use 'use client' directive for interactive features

### API Routes
- **POST handler**: api/generate-plan/route.ts accepts PlanData and returns HTML string
- **Response format**: Plain text HTML (not JSON)
- **No validation**: Input uses TypeScript interface but no runtime validation

### Page Structure
- **Single page app**: page.tsx contains entire financial planning application
- **Wizard pattern**: 5-step form (Profile → Health → Goals → Portfolio → Other)
- **Library system**: Official templates + saved portfolios in localStorage

## ANTI-PATTERNS
- **Large page.tsx**: 579 lines with 51 useState calls - should split into smaller components or use Zustand
- **No data validation**: API route trusts client input without Zod schema validation
- **Mixed concerns**: page.tsx handles UI, business logic, state management, persistence

## NOTES
- API returns JSON {html} for PDF generation (html2canvas + jsPDF on client)
- No server-side rendering optimization - generates HTML on-demand
- Deepest route: api/generate-plan/route.ts (depth 4 from root)
- API route is thin wrapper (14 lines) - logic in generatePlan.ts (1,561 lines)
