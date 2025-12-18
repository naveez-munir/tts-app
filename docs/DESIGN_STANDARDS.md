# DESIGN & RESPONSIVENESS STANDARDS

---

## Design Principles

- ⚠️ **CRITICAL**: Create 100% original design and copywriting
- ⚠️ **DO NOT copy** ots-uk.co.uk design, layout, colors, or content
- ✅ **Use ots-uk.co.uk ONLY as functional reference**
- ✅ **Create unique branding**: original palette, typography, logo, UI patterns
- ✅ **Professional aesthetic**: trustworthy, modern, clean
- ✅ **Accessibility**: WCAG 2.1 AA compliance

---

## Tailwind CSS 4 Configuration

### `@theme inline` in globals.css
- All colors defined in `@theme inline` - NO hardcoded hex values
- Semantic color names: primary, secondary, accent, neutral, success, warning, error
- Each color: shades 50-900
- Typography scale, spacing, border radius, shadows in `@theme inline`

### Global CSS Rules

**❌ NEVER:**
- Add global element styles (`*`, `html`, `body`, `a`, `button`)
- Add global resets (`margin: 0`, `padding: 0`)
- Add custom utility classes in global CSS
- Add global styles affecting Tailwind properties

**✅ ONLY use globals.css for:**
- `@import "tailwindcss"`
- `@theme inline` configuration block

---

## Responsive Design

### Mobile-First Approach
- Design for mobile first (320px minimum)
- Must work on: iPhone SE (375px), mobile (390-428px), tablet (768-1024px), desktop (1280px+)

### Breakpoints
| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

### Rules

**❌ NEVER:**
- Use hardcoded pixels: `w-[900px]`, `h-[450px]`, `text-[18px]`

**✅ ALWAYS:**
- Use Tailwind utilities: `w-full`, `max-w-4xl`, `h-screen`, `text-lg`
- Use responsive variants: `w-full md:w-1/2 lg:w-1/3`
- Flexible layouts: flexbox and grid
- Touch-friendly: minimum 44px × 44px tap targets
- Readable text: minimum 16px base font, line-height 1.5-1.75
- Proper spacing that scales with breakpoints

