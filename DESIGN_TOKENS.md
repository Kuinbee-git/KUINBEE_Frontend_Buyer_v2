# Kuinbee User Frontend Design Tokens

**Version:** 1.0  
**Last Updated:** April 27, 2026  
**Purpose:** Design system reference for Kuinbee Marketplace user interface

---

## Typography

### Font Families

```css
Primary (Sans-serif): 'Inter', 'Inter Fallback', system-ui, sans-serif
Monospace: 'JetBrains Mono', 'JetBrains Mono Fallback', monospace
```

### Font Smoothing
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`

### Font Sizes (Tailwind Scale)
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)

### Font Weights
- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

---

## Color System

### Light Theme Colors

#### Neutral Surfaces
```css
Background: #f7f8fa
Foreground: #111827
Card: #ffffff
Card Foreground: #111827
Popover: #ffffff
Popover Foreground: #111827
```

#### Brand Colors (Identity)
```css
Primary: #1a2240 (Deep navy blue)
Primary Foreground: #ffffff
Secondary: #4e5a7e (Slate blue)
Secondary Foreground: #ffffff
```

#### Muted/Subtle
```css
Muted: #f3f5fb (Very light blue-gray)
Muted Foreground: #6b7280 (Medium gray)
Accent: #eef1fb (Light blue-gray)
Accent Foreground: #1a2240
```

#### State Colors
```css
Destructive: #ef4444 (Red)
Destructive Foreground: #ffffff
Success: #10b981 (Green)
Success Foreground: #ffffff
```

#### Borders & Inputs
```css
Border: #e3e6f3
Input: #e3e6f3
Ring: #1a2240
```

---

### Dark Theme Colors

#### Neutral Surfaces
```css
Background: #0a0f1e (Very dark navy)
Foreground: #f1f5f9 (Light gray-blue)
Card: #0f1729 (Dark navy)
Card Foreground: #f1f5f9
Popover: #0f1729
Popover Foreground: #f1f5f9
```

#### Brand Colors (Identity)
```css
Primary: #e2e8f0 (Light gray-blue)
Primary Foreground: #0a0f1e
Secondary: #94a3b8 (Medium gray-blue)
Secondary Foreground: #0a0f1e
```

#### Muted/Subtle
```css
Muted: #1a2240 (Navy)
Muted Foreground: #94a3b8
Accent: #1a2240
Accent Foreground: #f1f5f9
```

#### State Colors
```css
Destructive: #f87171 (Light red)
Destructive Foreground: #0a0f1e
Success: #34d399 (Light green)
Success Foreground: #0a0f1e
```

#### Borders & Inputs
```css
Border: #1a2240
Input: #1a2240
Ring: #e2e8f0
```

---

### Additional Component Colors

#### Banner (Light)
```css
Background: #2b61eb (Bright blue)
Text: rgba(255, 255, 255, 0.9)
Border: rgba(43, 97, 235, 0.8)
```

#### Banner (Dark)
```css
Background: rgba(255, 255, 255, 0.02) with backdrop-blur
Border: rgba(255, 255, 255, 0.1)
Text: rgba(255, 255, 255, 0.9)
```

#### Scrollbar (Light)
```css
Track: #f3f5fb
Thumb: #4e5a7e
Thumb Hover: #1a2240
```

#### Scrollbar (Dark)
```css
Track: #0f1729
Thumb: #4e5a7e
Thumb Hover: #94a3b8
```

---

## Spacing & Layout

### Border Radius
```css
Base Radius: 0.75rem (12px)
--radius-sm: 8px (radius - 4px)
--radius-md: 10px (radius - 2px)
--radius-lg: 12px (base radius)
--radius-xl: 16px (radius + 4px)
```

### Common Component Sizes

#### Buttons
- Default: `h-10` (40px height), `px-4 py-2`
- Small: `h-9` (36px height), `px-3`
- Large: `h-11` (44px height), `px-8`
- Icon: `h-10 w-10` (40px square)

#### Inputs
- Default: `h-10` (40px height), `px-3 py-2`
- Search (Large): `h-11` (44px height), `px-11 pr-4`

#### Cards
- Border Radius: `rounded-xl` (12px)
- Padding Header: `px-6 pt-6`
- Padding Content: `px-6 pb-6`
- Gap: `gap-6` (24px)

---

## Component Patterns

### Button Variants

#### Default (Primary)
```css
Background: var(--primary) #1a2240
Text: var(--primary-foreground) #ffffff
Hover: opacity 90%
```

#### Destructive
```css
Background: var(--destructive) #ef4444
Text: var(--destructive-foreground) #ffffff
Hover: opacity 90%
```

#### Outline
```css
Border: var(--input) #e3e6f3
Background: var(--background)
Hover Background: var(--accent) #eef1fb
Hover Text: var(--accent-foreground) #1a2240
```

#### Secondary
```css
Background: var(--secondary) #4e5a7e
Text: var(--secondary-foreground) #ffffff
Hover: opacity 80%
```

#### Ghost
```css
Hover Background: var(--accent) #eef1fb
Hover Text: var(--accent-foreground) #1a2240
```

#### Link
```css
Text: var(--primary) #1a2240
Underline Offset: 4px
Hover: underline
```

---

### Input Field States

#### Default
```css
Border: 1px solid var(--input)
Background: var(--background)
Text: text-sm
Placeholder: var(--muted-foreground)
Ring Offset: var(--background)
```

#### Focus
```css
Outline: none
Ring: 2px solid var(--ring)
Ring Offset: 2px
```

#### Disabled
```css
Cursor: not-allowed
Opacity: 50%
```

---

### Card Component

#### Structure
```css
Border: 1px solid border
Border Radius: rounded-xl (12px)
Background: var(--card)
Text: var(--card-foreground)
Display: flex flex-col
Gap: 24px (gap-6)
```

#### Card Title
```css
Font Weight: semibold
Leading: none
Tracking: tight
```

#### Card Description
```css
Text: text-sm
Color: var(--muted-foreground)
```

---

## Shadows & Effects

### Box Shadows (Common Usage)
```css
Small Shadow: shadow-sm
Default Shadow: shadow
Medium Shadow: shadow-md
Large Shadow: shadow-lg
Extra Large: shadow-xl
```

### Backdrop Effects
```css
Backdrop Blur: backdrop-blur-lg
Background Opacity: bg-background/80
```

### Transitions
```css
Standard: transition-colors
Duration: 200-400ms
Easing: ease-in-out
```

---

## Interactive States

### Focus Visible
```css
Outline: none
Ring: 2px solid var(--ring)
Ring Offset: 2px
```

### Hover
- Buttons: opacity 80-90% or background lightness shift
- Links: underline
- Interactive elements: background color shift to accent

### Disabled
```css
Pointer Events: none
Opacity: 50%
```

---

## Iconography

### Icon Sizes
```css
Default (inline SVG): size-4 (16px)
Small: size-3 (12px)
Medium: size-5 (20px)
Large: size-6 (24px)
```

### Icon Properties
```css
Pointer Events: none
Shrink: 0
```

### Common Icon Library
**Lucide React** - Used throughout the application

---

## Grid & Layout

### Container Widths
```css
Max Width Container: max-w-7xl
Padding X: px-4 md:px-6
```

### Common Grid Patterns
```css
Two Column (Desktop): grid-cols-1 lg:grid-cols-[280px_1fr]
Gap: gap-4 sm:gap-6 lg:gap-8
```

---

## Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Animation & Motion

### View Transitions
```css
Theme Transition: circular mask animation
Will Change: clip-path
Transform: translateZ(0)
Backface Visibility: hidden
Contain: layout style paint
```

### Fade In
```css
Duration: 0.15s
Easing: ease-out
Keyframes: opacity 0 to 1
```

### Banner Animation
```css
Duration: 400ms
Easing: ease-in-out
Grid Rows: 0fr to 1fr (collapsible)
Opacity: 0 to 1
```

---

## Accessibility

### Focus Indicators
- All interactive elements have visible focus rings
- Ring color: `var(--ring)` (#1a2240 light, #e2e8f0 dark)
- Ring width: 2px
- Ring offset: 2px

### Color Contrast
- All text meets WCAG AA standards
- Primary text: 4.5:1 minimum
- Large text: 3:1 minimum

### Screen Reader Support
- `sr-only` class for visually hidden content
- Proper ARIA labels on interactive elements

---

## Special Components

### Dataset Cards
```css
Background Light: white
Background Dark: #1e2847
Border Light: rgba(26, 34, 64, 0.2)
Border Dark: rgba(255, 255, 255, 0.1)
Border Radius: rounded-xl (12px)
Shadow: shadow-sm
Padding: p-4 to p-8
```

### Search Input (Large)
```css
Height: h-11 (44px)
Padding Left: pl-11 (for icon)
Padding Right: pr-4
Border Radius: rounded-xl
Background Light: rgba(255, 255, 255, 0.95)
Background Dark: rgba(255, 255, 255, 0.1)
Border Light: rgba(26, 34, 64, 0.2)
Border Dark: rgba(255, 255, 255, 0.2)
```

### Pagination Controls
```css
Button Height: h-8 (32px)
Padding: px-3
Font Size: text-sm
Border Radius: rounded-lg
Font Family: monospace (for numbers)
```

---

## Usage Guidelines

### When to Use Each Color

**Primary (#1a2240):**
- Main navigation elements
- Primary CTAs
- Brand identity elements
- Focus states

**Secondary (#4e5a7e):**
- Secondary buttons
- Scrollbars
- Supporting UI elements

**Muted (#f3f5fb light / #1a2240 dark):**
- Background surfaces
- Disabled states
- Subtle dividers

**Accent (#eef1fb light / #1a2240 dark):**
- Hover states
- Selected states
- Highlighted content

**Success (#10b981 / #34d399):**
- Success messages
- Positive confirmations
- Available/active status

**Destructive (#ef4444 / #f87171):**
- Error messages
- Delete actions
- Critical warnings

---

## Design Files Export

### Figma Color Styles
All colors listed above should be created as Figma color styles with the naming convention:
```
Light/Primary
Light/Background
Dark/Primary
Dark/Background
```

### Component Library
Key components to design:
1. Button (all variants)
2. Input Field
3. Card
4. Dataset Card (custom)
5. Navigation
6. Search Bar
7. Filter Sidebar
8. Pagination Controls

---

## Notes for Designers

1. **Dark Mode First**: The application has full dark mode support. Design both themes simultaneously.

2. **Consistency**: Use the defined color tokens rather than arbitrary values.

3. **Spacing**: Follow the 4px grid system (Tailwind's default spacing scale).

4. **Typography**: Inter is the primary font. Use JetBrains Mono only for code, monospace numbers, or technical data.

5. **Accessibility**: Maintain contrast ratios and ensure all interactive states are visually distinct.

6. **Component Variants**: All components should work in both light and dark themes without modification to the component code.

7. **Real Data**: Design with realistic data lengths and edge cases (long names, missing data, etc.).

---

## Questions or Clarifications

For technical implementation questions or to request additional component specifications, contact the development team.
