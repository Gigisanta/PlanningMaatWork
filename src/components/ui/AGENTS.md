# UI COMPONENTS DIRECTORY

## OVERVIEW
48 shadcn/ui components - Radix UI primitives wrapped with Tailwind CSS styling using "new-york" variant.

## STRUCTURE
```
ui/
├── accordion.tsx          # Collapsible content
├── alert.tsx             # Alert banners
├── alert-dialog.tsx       # Modal alerts
├── avatar.tsx            # User images/initials
├── badge.tsx             # Status badges
├── breadcrumb.tsx        # Navigation breadcrumbs
├── button.tsx            # Primary actions
├── calendar.tsx          # Date picker
├── card.tsx              # Content containers
├── carousel.tsx          # Image sliders
├── chart.tsx             # Data visualization
├── checkbox.tsx          # Toggle checkboxes
├── collapsible.tsx       # Show/hide sections
├── command.tsx           # Command palette
├── context-menu.tsx       # Right-click menus
├── dialog.tsx            # Modal dialogs
├── drawer.tsx            # Side panels
├── dropdown-menu.tsx     # Menu buttons
├── form.tsx              # Compound form components (with React Context)
├── hover-card.tsx        # Popover cards
├── input-otp.tsx        # One-time password input
├── input.tsx             # Text inputs
├── label.tsx             # Field labels
├── menubar.tsx           # Top navigation
├── navigation-menu.tsx    # Navigation dropdowns
├── pagination.tsx         # Page navigation
├── popover.tsx           # Floating content
├── progress.tsx          # Loading bars
├── radio-group.tsx       # Radio button groups
├── resizable.tsx         # Resizable panels
├── scroll-area.tsx       # Custom scrollbars
├── select.tsx            # Dropdown selects
├── separator.tsx         # Visual dividers
├── sheet.tsx             # Slide-over panels
├── skeleton.tsx          # Loading placeholders
├── slider.tsx            # Range sliders
├── sonner.tsx            # Toast notifications
├── switch.tsx            # Toggle switches
├── table.tsx             # Data tables
├── tabs.tsx              # Tab navigation
├── textarea.tsx          # Multi-line inputs
├── toast.tsx             # Toast provider
├── toggle-group.tsx      # Button groups
├── toggle.tsx            # Single toggles
└── tooltip.tsx           # Hover tooltips
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|-----------|-------|
| Complex component | sidebar.tsx (726 lines) | Largest UI component with context management |
| Form components | form.tsx | Uses React Context for compound pattern |
| Toast provider | toast.tsx | Wraps Sonner for notifications |

## CONVENTIONS

### Component Architecture
- **Wrapper pattern**: Each component wraps a Radix UI primitive with Tailwind styling
- **Props forwarding**: Pass through original props using {...props} spread
- **className merging**: Use cn() utility for conditional classes

### Styling
- **Base color**: neutral (from components.json config)
- **Icon library**: lucide-react
- **CSS variables**: true (HSL-based color tokens)
- **Dark mode**: class-based via next-themes

### Compound Components
- **form.tsx**: Uses React Context for FormField, FormItem, FormLabel, FormControl
- **sidebar.tsx**: Uses React Context for SidebarProvider

## ANTI-PATTERNS
- **No barrel exports**: No index.ts for cleaner imports
- **Inconsistent exports**: Some export named components, some default

## NOTES
- All components follow shadcn/ui "new-york" design system
- Generated via: `npx shadcn-ui@latest add [component]`
- Components use class-variance-authority for variant management
