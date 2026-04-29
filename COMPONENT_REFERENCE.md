# Kuinbee User Frontend - Component Reference Guide

**Version:** 1.0  
**Last Updated:** April 27, 2026  
**For:** Designers & Claude Design Integration

---

## Component Library Overview

This document provides visual specifications and implementation examples for all major UI components in the Kuinbee user frontend. Use this as a reference when designing new features or creating design files.

---

## 1. Dataset Card (Primary Component)

### Visual Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [Verified Badge] [Sample Badge]              [❤ Save Button]│
│                                                               │
│ Title of the Dataset (2 lines max, truncated)                │
│                                                               │
│ by Provider Name                                              │
│                                                               │
│ Country · 1.5M rows · CSV · 45.2 MB                          │
│                                                               │
│ [tag1] [tag2] [tag3] +5 more                                 │
│ ─────────────────────────────────────────────────────────── │
│ ⭐⭐⭐⭐⭐ 4.8 (24)  🏆 KDTS 87.5  1.2K views 543 downloads  │
│                                                    ₹25,000    │
└─────────────────────────────────────────────────────────────┘
```

### Specifications

#### Container
- Background: `#ffffff` (light) / `#1e2847` (dark)
- Border: `1px solid rgba(26, 34, 64, 0.4)` (light) / `rgba(255, 255, 255, 0.1)` (dark)
- Border Radius: `12px`
- Padding: `20px` (all sides)
- Shadow: `shadow-sm`
- Hover: Background shifts to `rgba(26, 34, 64, 0.04)` (light) / `rgba(255, 255, 255, 0.05)` (dark)

#### Row 1: Badges & Save Button
- **Badges:**
  - Height: `20px` (h-5)
  - Padding: `4px 8px`
  - Border Radius: `4px`
  - Font: `12px` semi-bold
  - Variants:
    - Verified (blue): `bg-blue-100 text-blue-700` (light) / `bg-blue-900/30 text-blue-300` (dark)
    - Sample (green): `bg-emerald-100 text-emerald-700` (light) / `bg-emerald-900/30 text-emerald-300` (dark)
    - Info (gray): `bg-gray-100 text-gray-700` (light) / `bg-gray-800 text-gray-300` (dark)

- **Save Button:**
  - Height: `28px` (h-7)
  - Padding: `0 8px`
  - Border Radius: `4px`
  - Border: `1px solid rgba(26, 34, 64, 0.15)` → `0.25` when saved
  - Icon: Heart (16px)
  - States:
    - Default: transparent background
    - Saved: `bg-[#1a2240]/10 border-[#1a2240]/25` with filled heart
    - Hover: border opacity increases

#### Row 2: Title
- Font: `16px` (text-base) semi-bold
- Color: `#1a2240` (light) / `#ffffff` (dark)
- Line Height: `1.375` (leading-snug)
- Max Lines: 2 (line-clamp-2)
- Margin Bottom: `8px`

#### Row 3: Provider
- Font: `14px` (text-sm)
- Color: `#4e5a7e` (light) / `rgba(255, 255, 255, 0.7)` (dark)
- Provider Name: `#1a2240` (light) / `#ffffff` (dark) medium weight
- Margin Bottom: `12px`

#### Row 4: Metadata Line
- Font: `14px` (text-sm)
- Color: `#4e5a7e` (light) / `rgba(255, 255, 255, 0.7)` (dark)
- Separator: ` · ` (middot with spaces)
- Parts: Country, Rows, Format, File Size
- Margin Bottom: `12px`

#### Row 5: Tags
- Tag Height: `20px`
- Padding: `2px 8px`
- Border Radius: `4px`
- Background: `rgba(26, 34, 64, 0.05)` (light) / `rgba(255, 255, 255, 0.05)` (dark)
- Border: `1px solid rgba(26, 34, 64, 0.1)` (light) / `rgba(255, 255, 255, 0.1)` (dark)
- Font: `12px`
- Color: `#4e5a7e` (light) / `rgba(255, 255, 255, 0.7)` (dark)
- Gap: `6px`
- Margin Bottom: `16px`

#### Divider
- Height: `1px`
- Background: `rgba(26, 34, 64, 0.1)` (light) / `rgba(255, 255, 255, 0.1)` (dark)
- Margin Bottom: `16px`

#### Row 6: Footer Stats & Price
- **Rating:**
  - Stars: 14px icons
  - Fill: `#f59e0b` (amber-500)
  - Score: `#1a2240` (light) / `#ffffff` (dark) medium weight
  - Review Count: `#4e5a7e` (light) / `rgba(255, 255, 255, 0.7)` (dark)

- **KDTS Score:**
  - Icon: Award (14px)
  - Label: `#4e5a7e` (light) / `rgba(255, 255, 255, 0.7)` (dark)
  - Score Color (Tiered):
    - 85+: `#059669` (emerald-700) / `#34d399` (emerald-400)
    - 70-84: `#1d4ed8` (blue-700) / `#60a5fa` (blue-400)
    - 50-69: `#b45309` (amber-700) / `#fbbf24` (amber-400)
    - <50: `#b91c1c` (red-700) / `#f87171` (red-400)

- **Stats:**
  - Font: `14px`
  - Color: `#4e5a7e` (light) / `rgba(255, 255, 255, 0.7)` (dark)

- **Price:**
  - Font: `16px` (text-base) semi-bold
  - Color: `#1a2240` (light) / `#ffffff` (dark)
  - Alignment: Right
  - Tabular Numbers: Yes

---

## 2. Button Component

### Variants

#### Default (Primary)
```css
Height: 40px (h-10)
Padding: 16px horizontal, 8px vertical
Background: #1a2240
Text: #ffffff
Font: 14px medium
Border Radius: 6px
Hover: opacity 90%
Focus: 2px ring #1a2240 with 2px offset
Transition: 200ms
```

#### Secondary
```css
Background: #4e5a7e
Text: #ffffff
Hover: opacity 80%
All other specs same as Default
```

#### Outline
```css
Border: 1px solid #e3e6f3
Background: transparent
Text: #1a2240 (light) / #ffffff (dark)
Hover Background: #eef1fb (light) / #1a2240 (dark)
Hover Text: #1a2240
```

#### Ghost
```css
Background: transparent
Border: none
Text: #1a2240 (light) / #ffffff (dark)
Hover Background: #eef1fb (light) / #1a2240 (dark)
```

#### Destructive
```css
Background: #ef4444
Text: #ffffff
Hover: opacity 90%
```

### Sizes

- **Small:** `height: 36px`, `padding-x: 12px`
- **Default:** `height: 40px`, `padding-x: 16px`
- **Large:** `height: 44px`, `padding-x: 32px`
- **Icon:** `40x40px` square

### States

- **Default:** As specified above
- **Hover:** Background opacity or color shift
- **Focus:** 2px ring with ring-offset-2
- **Active:** Scale slightly (98%)
- **Disabled:** `opacity: 50%`, `pointer-events: none`
- **Loading:** Show spinner icon, disable pointer events

---

## 3. Input Field

### Default Input
```css
Height: 40px (h-10)
Padding: 12px horizontal, 8px vertical
Border: 1px solid #e3e6f3
Border Radius: 6px
Background: #ffffff (light) / #0a0f1e (dark)
Text: 14px
Placeholder: #6b7280
Font: Inter
```

### Search Input (Large)
```css
Height: 44px (h-11)
Padding Left: 44px (for icon)
Padding Right: 16px
Border: 1px solid rgba(26, 34, 64, 0.2) (light) / rgba(255, 255, 255, 0.2) (dark)
Border Radius: 12px
Background: rgba(255, 255, 255, 0.95) (light) / rgba(255, 255, 255, 0.1) (dark)
Text: 16px
Placeholder: rgba(78, 90, 126, 0.6) (light) / rgba(255, 255, 255, 0.4) (dark)
Icon Position: left 14px, centered vertically
Icon Size: 20px
Icon Color: #4e5a7e (light) / rgba(255, 255, 255, 0.6) (dark)
```

### States

- **Default:** Border `#e3e6f3`
- **Focus:** 2px ring `#1a2240`, ring-offset-2, no outline
- **Error:** Border `#ef4444`, text `#ef4444`
- **Disabled:** `opacity: 50%`, `cursor: not-allowed`

---

## 4. Card Component

### Structure
```
┌──────────────────────────────────────┐
│  [Card Header]                       │
│  [Card Title]                        │
│  [Card Description]                  │
│                                      │
│  [Card Content]                      │
│                                      │
│  [Card Footer]                       │
└──────────────────────────────────────┘
```

### Specifications

#### Container
```css
Background: #ffffff (light) / #0f1729 (dark)
Border: 1px solid var(--border)
Border Radius: 12px
Display: flex column
Gap: 24px
Shadow: shadow
```

#### Card Header
```css
Padding: 24px 24px 0
Display: flex column
Gap: 6px
```

#### Card Title
```css
Font: 16px semi-bold
Line Height: 1
Letter Spacing: tight
```

#### Card Description
```css
Font: 14px
Color: #6b7280 (muted-foreground)
```

#### Card Content
```css
Padding: 0 24px 24px
```

#### Card Footer
```css
Padding: 0 24px 24px
Display: flex row
Align: center
```

---

## 5. Badge Component

### Variants

#### Info (Blue)
```css
Background: rgba(59, 130, 246, 0.1) (light) / rgba(59, 130, 246, 0.2) (dark)
Text: #1e40af (light) / #93c5fd (dark)
Border: 1px solid rgba(59, 130, 246, 0.2)
```

#### Success (Green)
```css
Background: rgba(16, 185, 129, 0.1) (light) / rgba(16, 185, 129, 0.2) (dark)
Text: #065f46 (light) / #6ee7b7 (dark)
Border: 1px solid rgba(16, 185, 129, 0.2)
```

#### Warning (Amber)
```css
Background: rgba(245, 158, 11, 0.1) (light) / rgba(245, 158, 11, 0.2) (dark)
Text: #92400e (light) / #fcd34d (dark)
Border: 1px solid rgba(245, 158, 11, 0.2)
```

#### Destructive (Red)
```css
Background: rgba(239, 68, 68, 0.1) (light) / rgba(239, 68, 68, 0.2) (dark)
Text: #991b1b (light) / #fca5a5 (dark)
Border: 1px solid rgba(239, 68, 68, 0.2)
```

### Common Properties
```css
Height: 20px
Padding: 4px 8px
Border Radius: 4px
Font: 12px semi-bold
Display: inline-flex
Align Items: center
Gap: 4px (for icon)
```

---

## 6. Navigation (NotchNavigation)

### Structure
```css
Background: rgba(247, 248, 250, 0.8) (light) / rgba(10, 15, 30, 0.8) (dark)
Backdrop Filter: blur(16px)
Border Bottom: 1px solid rgba(227, 230, 243, 0.4) (light) / rgba(255, 255, 255, 0.1) (dark)
Height: 64px
Padding: 0 24px
Sticky: top 0
Z-Index: 40
```

### Logo Section
- Logo Height: 32px
- Logo + Text layout: horizontal flex, gap 12px

### Navigation Links
```css
Font: 14px medium
Color: #4e5a7e (light) / rgba(255, 255, 255, 0.7) (dark)
Hover Color: #1a2240 (light) / #ffffff (dark)
Padding: 8px 12px
Border Radius: 6px
Hover Background: rgba(26, 34, 64, 0.05) (light) / rgba(255, 255, 255, 0.05) (dark)
Transition: 200ms
```

---

## 7. Filter Sidebar

### Container
```css
Width: 280px
Background: #ffffff (light) / #0f1729 (dark)
Border: 1px solid var(--border)
Border Radius: 12px
Padding: 20px
Height: fit-content
Sticky: top 100px
```

### Section Headers
```css
Font: 14px semi-bold
Color: #1a2240 (light) / #ffffff (dark)
Margin Bottom: 12px
```

### Section Divider
```css
Height: 1px
Background: rgba(26, 34, 64, 0.1) (light) / rgba(255, 255, 255, 0.1) (dark)
Margin: 16px 0
```

### Filter Options
```css
Font: 14px
Padding: 8px 12px
Border Radius: 6px
Hover Background: rgba(26, 34, 64, 0.05) (light) / rgba(255, 255, 255, 0.05) (dark)
```

---

## 8. Pagination Controls

### Container
```css
Background: #ffffff (light) / #1e2847 (dark)
Border: 1px solid rgba(227, 230, 243, 0.4) (light) / rgba(255, 255, 255, 0.1) (dark)
Border Radius: 12px
Padding: 16px
Display: flex row
Justify: space-between
Align: center
Shadow: shadow-sm
```

### Buttons
```css
Height: 32px (h-8)
Padding: 0 12px
Font: 14px medium
Border Radius: 8px
Border: 1px solid rgba(26, 34, 64, 0.2) (light) / rgba(255, 255, 255, 0.2) (dark)
Background: rgba(255, 255, 255, 0.95) (light) / rgba(255, 255, 255, 0.1) (dark)
Icon Size: 16px
Gap: 8px
Transition: 200ms
```

- **Disabled State:**
  - Border: `rgba(227, 230, 243, 0.4)` (light) / `rgba(255, 255, 255, 0.1)` (dark)
  - Text: `rgba(78, 90, 126, 0.5)` (light) / `rgba(255, 255, 255, 0.4)` (dark)
  - Cursor: `not-allowed`

### Page Counter
```css
Font: 14px monospace
Current Page: #1a2240 (light) / #ffffff (dark)
Separator: #4e5a7e (light) / rgba(255, 255, 255, 0.7) (dark)
Total: #4e5a7e (light) / rgba(255, 255, 255, 0.7) (dark)
Layout: "1 / 10 · 243 total"
```

---

## 9. Banner (Dismissible)

### Structure
```css
Background: #2b61eb (light) / rgba(255, 255, 255, 0.02) with backdrop-blur (dark)
Border Bottom: 1px solid rgba(43, 97, 235, 0.8) (light) / rgba(255, 255, 255, 0.1) (dark)
Padding: 10px 24px
Height: auto (collapsible)
Display: flex
Justify: center
Align: center
Gap: 24px
Shadow: sm (dark mode)
Position: relative (for close button)
```

### Text
```css
Font: 14px
Color: rgba(255, 255, 255, 0.9)
Strong Text: #ffffff, semi-bold, tracking-wide
```

### CTA Button
```css
Background: #ffffff (light) / rgba(255, 255, 255, 0.04) (dark)
Text: #2b61eb (light) / rgba(255, 255, 255, 0.9) (dark)
Border: 1px solid transparent (light) / rgba(255, 255, 255, 0.1) (dark)
Padding: 4px 14px
Border Radius: 6px
Font: 14px semi-bold
Hover Background: #eff6ff (light) / rgba(255, 255, 255, 0.08) (dark)
Shadow: sm
Icon: ArrowRight (16px), gap 6px
```

### Close Button
```css
Position: absolute right 16px
Padding: 12px
Border Radius: 9999px (full circle)
Icon: X (20px)
Icon Color: rgba(255, 255, 255, 0.8)
Hover Background: rgba(255, 255, 255, 0.1)
Hover Icon: #ffffff
```

### Animation
```css
Duration: 400ms
Easing: ease-in-out
Enter: grid-rows-[1fr], opacity 1
Exit: grid-rows-[0fr], opacity 0
Origin: top
```

---

## 10. Loading States

### Skeleton Card
```css
Background: #ffffff (light) / #1e2847 (dark)
Border: 1px solid rgba(227, 230, 243, 0.4) (light) / rgba(255, 255, 255, 0.1) (dark)
Border Radius: 12px
Padding: 20px
Animation: pulse (2s infinite)
```

### Skeleton Elements
```css
Background: rgba(26, 34, 64, 0.1) (light) / rgba(255, 255, 255, 0.1) (dark)
Border Radius: 4px
Various heights and widths matching actual content
```

### Spinner
```css
Icon: Loader2 from Lucide
Size: 16px (default), 20px (large)
Color: #4e5a7e (light) / rgba(255, 255, 255, 0.6) (dark)
Animation: spin (1s linear infinite)
```

---

## 11. Scrollbar Styling

### Webkit (Chrome, Safari, Edge)

#### Light Mode
```css
Width: 12px
Height: 12px
Track: #f3f5fb, border-radius 6px
Thumb: #4e5a7e, border-radius 6px, border 2px solid #f3f5fb
Thumb Hover: #1a2240
```

#### Dark Mode
```css
Track: #0f1729
Thumb: #4e5a7e, border 2px solid #0f1729
Thumb Hover: #94a3b8
```

### Firefox
```css
Scrollbar Width: thin
Scrollbar Color: #4e5a7e #f3f5fb (light) / #4e5a7e #0f1729 (dark)
```

---

## Design System Notes

### Consistency Rules

1. **Border Radius Hierarchy:**
   - Small elements (badges, tags): `4px`
   - Inputs, buttons: `6px`
   - Cards, modals: `12px`
   - Large search inputs: `12px`

2. **Spacing Scale:** 4px base (Tailwind default)
   - Tight: `4px` (gap-1)
   - Small: `8px` (gap-2)
   - Medium: `12px` (gap-3)
   - Default: `16px` (gap-4)
   - Large: `24px` (gap-6)

3. **Typography Scale:**
   - Small text: `12px`
   - Body text: `14px`
   - Base: `16px`
   - Headings: `18px`, `20px`, `24px`

4. **Color Opacity Pattern:**
   - Subtle backgrounds: `0.05` to `0.1`
   - Borders: `0.1` to `0.25`
   - Muted text: `0.6` to `0.7`
   - Active text: `0.9` to `1`

5. **Interactive States:**
   - Hover: Background opacity shift or slight color change
   - Focus: Always show 2px ring with 2px offset
   - Active: Optional scale (98%)
   - Disabled: 50% opacity

---

## Component Export Checklist for Figma

When creating Figma components, ensure:

- [ ] Both light and dark theme variants exist
- [ ] All interactive states are designed (default, hover, focus, active, disabled)
- [ ] Typography uses Inter (Sans) or JetBrains Mono (Monospace)
- [ ] Colors use the defined design tokens (no arbitrary values)
- [ ] Border radius follows the hierarchy
- [ ] Spacing follows the 4px grid
- [ ] Components are properly auto-layout enabled
- [ ] Variants are set up for sizes (sm, default, lg)
- [ ] Icons are from Lucide React library
- [ ] Responsive behavior is documented

---

## Questions or Issues?

For implementation questions or missing specifications, contact the development team or reference:
- `DESIGN_TOKENS.md` for color and typography details
- `design-tokens.json` for programmatic access to tokens
- Component source files in `src/shared/components/ui/` for implementation reference
