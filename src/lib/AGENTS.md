# LIB DIRECTORY

## OVERVIEW
Utilities and business logic - 3 files for HTML generation, Prisma DB, and utilities.

## STRUCTURE
```
lib/
├── generatePlan.ts    # HTML template generator (1,561 lines)
├── db.ts             # Prisma client (299 bytes, UNUSED)
└── utils.ts          # Utility functions (166 bytes)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| PDF/HTML generation | generatePlan.ts | 1,561 lines - embedded CSS, CACTUS colors |
| Classname utility | utils.ts | Exports cn() for Tailwind class merging |
| Prisma client | db.ts | NEVER IMPORTED - app uses localStorage |

## CONVENTIONS

### generatePlan.ts
- Pure function: `generatePlanHTML(data: PlanData): string`
- Self-contained: No imports
- Embedded CSS: ~1000 lines of inline styles
- Template literals: Heavy interpolation with conditional sections

### utils.ts
- Single export: `cn(...inputs: ClassValue[]): string`
- Combines clsx + tailwind-merge
- Used by: 48 shadcn/ui components

### db.ts
- Prisma singleton pattern
- Query logging enabled in dev
- NOT USED: App uses localStorage for all data

## ANTI-PATTERNS
- Monolithic generatePlan.ts: 1,561 lines - extract CSS to separate file
- Dead code: db.ts is never imported (Prisma unused)
- No template system: HTML strings hard-coded in function

## NOTES
- generatePlan.ts is the largest file in the project
- No runtime validation - trusts TypeScript interfaces only
- CACTUS color palette hardcoded in CSS variables
