# Public Polling Design System Tokens
## Phase 2: Production-Ready Specification

### Color Palettes

#### Theme 1: Civic Slate (Primary)
Institutional slate blue with sage green accents. WCAG AA+ compliant.

**Base Colors:**
- Background: `hsl(210, 22%, 97%)`
- Background Elevated: `hsl(0, 0%, 100%)`
- Foreground: `hsl(217, 27%, 18%)`

**Primary (Government Authority):**
- Default: `hsl(217, 30%, 32%)`
- Hover: `hsl(217, 30%, 26%)`
- Active: `hsl(217, 30%, 22%)`

**Accent (Institutional Sage):**
- Default: `hsl(152, 26%, 42%)`
- Hover: `hsl(152, 26%, 36%)`

**Status Colors:**
- Success: `hsl(152, 45%, 45%)`
- Warning: `hsl(38, 88%, 52%)`
- Danger: `hsl(4, 68%, 52%)`
- Info: `hsl(207, 75%, 50%)`

**Chart Colors (Colorblind-Safe):**
- Yes: `hsl(152, 48%, 48%)`
- No: `hsl(4, 65%, 55%)`
- Neutral: `hsl(217, 18%, 65%)`
- Grid: `hsl(210, 18%, 88%)`

#### Theme 2: Nordic Frost (Alternative)
Cool blue-gray with teal accents.

**Primary:** `hsl(210, 38%, 35%)`
**Accent:** `hsl(185, 52%, 42%)`

### Typography

**Font Family:**
- Primary: IBM Plex Sans (400, 500, 600, 700)
- Monospace: IBM Plex Mono

**Type Scale:**
| Size | Rem | Pixels | Line Height | Usage |
|------|-----|---------|-------------|-------|
| xs | 0.75rem | 12px | 1rem | Captions, metadata |
| sm | 0.875rem | 14px | 1.25rem | Labels, small body |
| base | 1rem | 16px | 1.5rem | Body text |
| lg | 1.125rem | 18px | 1.75rem | Emphasis text |
| xl | 1.25rem | 20px | 1.75rem | Section titles |
| 2xl | 1.5rem | 24px | 2rem | Page subtitles |
| 3xl | 1.875rem | 30px | 2.25rem | Page titles |
| 4xl | 2.25rem | 36px | 2.5rem | Hero titles |

### Spacing Scale

Based on 8px grid system:
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)
- 20: 5rem (80px)

### Border Radius

- sm: 0.25rem (4px)
- DEFAULT: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)

### Elevation (Shadows)

- xs: `0 1px 2px 0 hsl(217 27% 18% / 0.04)`
- sm: `0 1px 3px 0 hsl(217 27% 18% / 0.06)`
- md: `0 4px 6px -1px hsl(217 27% 18% / 0.08)`
- lg: `0 10px 15px -3px hsl(217 27% 18% / 0.1)`
- xl: `0 20px 25px -5px hsl(217 27% 18% / 0.12)`

### Motion & Transitions

**Durations:**
- Fast: 100ms
- Base: 150ms
- Slow: 200ms
- Slower: 300ms

**Easing Functions:**
- Standard: `cubic-bezier(0.4, 0, 0.2, 1)`
- Emphasized: `cubic-bezier(0.2, 0, 0, 1)`
- Decelerate: `cubic-bezier(0, 0, 0.2, 1)`

**Reduced Motion:**
All animations respect `prefers-reduced-motion: reduce` and default to instant transitions.

### Responsive Breakpoints

| Breakpoint | Min Width | Container Padding |
|------------|-----------|-------------------|
| Default | - | 1rem (16px) |
| sm | 640px | 1.5rem (24px) |
| md | 768px | 2rem (32px) |
| lg | 1024px | 2.5rem (40px) |
| xl | 1280px | 3rem (48px) |
| 2xl | 1536px | 3rem (48px) |

### Touch Targets

**Minimum sizes for accessibility:**
- Buttons: 44px × 44px
- Touch areas: 48px × 48px
- Icons (clickable): 24px with 44px touch area

### Icon Specifications

**Stroke Width:** 2px
**Sizes:**
- sm: 16px
- DEFAULT: 20px
- lg: 24px
- xl: 32px

### Accessibility

**Contrast Ratios (WCAG AA+):**
- Normal text (16px+): 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components: 3:1 minimum

**Focus States:**
- Ring width: 2px
- Ring offset: 2px
- Ring color: Primary color

### Component States

**Interactive Elements:**
- Default: Base styling
- Hover: Subtle background/color shift
- Active: Increased contrast
- Focus: Visible ring outline
- Disabled: 40% opacity + cursor-not-allowed

### Data Visualization

**Chart Defaults:**
- Grid opacity: 0.2
- Line width: 2px
- Point radius: 4px
- Hover point radius: 6px

**Opacity Levels:**
- Full: 1.0
- Hover: 0.85
- Inactive: 0.4

### Verification Badges

- Stage 1 (Basic): `hsl(42, 88%, 58%)`
- Stage 2 (Social): `hsl(152, 48%, 48%)`
- Stage 3 (Gov ID): `hsl(217, 75%, 52%)`

### Export Format

This specification can be exported as:
- CSS Custom Properties (see `src/index.css`)
- Tailwind Config (see `tailwind.config.ts`)
- JSON tokens (available on request)
- Figma variables (import ready)

### Implementation Notes

1. All colors use HSL format for better accessibility control
2. Font loading uses Google Fonts with `font-display: swap`
3. Motion respects user preferences automatically
4. All components support keyboard navigation
5. ARIA labels provided for all interactive elements

### Version

Design System Version: 2.0.0
Last Updated: January 3, 2025
Maintained by: Public Polling Design Team
