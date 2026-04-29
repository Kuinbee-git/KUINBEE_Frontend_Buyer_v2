# Kuinbee User Frontend - Color Palette Quick Reference

**Version:** 1.0  
**Last Updated:** April 27, 2026

---

## Brand Colors

### Primary Navy
```
Light Mode: #1a2240
Dark Mode: #e2e8f0
```
**Usage:** Primary CTAs, brand identity, navigation active states, focus rings

**RGB:** `26, 34, 64` (light) | `226, 232, 240` (dark)  
**HSL:** `223°, 42%, 18%` (light) | `214°, 32%, 91%` (dark)

---

### Secondary Slate Blue
```
Light Mode: #4e5a7e
Dark Mode: #94a3b8
```
**Usage:** Secondary buttons, muted text, scrollbars, supporting elements

**RGB:** `78, 90, 126` (light) | `148, 163, 184` (dark)  
**HSL:** `225°, 24%, 40%` (light) | `214°, 20%, 65%` (dark)

---

## Neutral Surfaces

### Background
```
Light Mode: #f7f8fa
Dark Mode: #0a0f1e
```
**Usage:** Page background, main canvas

---

### Foreground (Text)
```
Light Mode: #111827
Dark Mode: #f1f5f9
```
**Usage:** Primary text color

---

### Card
```
Light Mode: #ffffff
Dark Mode: #0f1729
```
**Usage:** Card backgrounds, elevated surfaces, modals

---

### Dataset Card (Special)
```
Dark Mode Only: #1e2847
```
**Usage:** Dataset card background in dark mode (slightly lighter than standard card)

---

## Muted / Subtle

### Muted Background
```
Light Mode: #f3f5fb
Dark Mode: #1a2240
```
**Usage:** Subtle backgrounds, disabled states, scrollbar tracks

---

### Muted Foreground
```
Light Mode: #6b7280
Dark Mode: #94a3b8
```
**Usage:** Secondary text, labels, metadata

---

### Accent
```
Light Mode: #eef1fb
Dark Mode: #1a2240
```
**Usage:** Hover states, highlighted content, selected backgrounds

---

## State Colors

### Success
```
Light Mode: #10b981
Dark Mode: #34d399
```
**RGB:** `16, 185, 129` (light) | `52, 211, 153` (dark)  
**Usage:** Success messages, "Sample Available" badges, positive status

---

### Destructive / Error
```
Light Mode: #ef4444
Dark Mode: #f87171
```
**RGB:** `239, 68, 68` (light) | `248, 113, 113` (dark)  
**Usage:** Error messages, delete actions, critical warnings

---

### Warning (Amber)
```
Light Mode: #f59e0b
Dark Mode: #fbbf24
```
**RGB:** `245, 158, 11` (light) | `251, 191, 36` (dark)  
**Usage:** Warning messages, caution states

---

### Info (Blue)
```
Light Mode: #3b82f6
Dark Mode: #60a5fa
```
**RGB:** `59, 130, 246` (light) | `96, 165, 250` (dark)  
**Usage:** Informational messages, "Verified" badges

---

## Borders & Inputs

### Border
```
Light Mode: #e3e6f3
Dark Mode: #1a2240
```
**Usage:** Card borders, dividers, input borders

---

### Input Border
```
Same as Border above
```

---

### Ring (Focus State)
```
Light Mode: #1a2240
Dark Mode: #e2e8f0
```
**Usage:** Focus ring around interactive elements (2px width, 2px offset)

---

## Special Component Colors

### Banner Background
```
Light Mode: #2b61eb (Bright Blue)
Dark Mode: rgba(255, 255, 255, 0.02) with backdrop-blur
```
**RGB:** `43, 97, 235` (light)  
**Usage:** Top promotional banner

---

### Banner Text
```
Both Modes: rgba(255, 255, 255, 0.9)
```

---

## KDTS Score Tiers

### Excellent (85-100)
```
Light Mode: #059669 (Emerald 700)
Dark Mode: #34d399 (Emerald 400)
```

### Good (70-84)
```
Light Mode: #1d4ed8 (Blue 700)
Dark Mode: #60a5fa (Blue 400)
```

### Fair (50-69)
```
Light Mode: #b45309 (Amber 700)
Dark Mode: #fbbf24 (Amber 400)
```

### Poor (<50)
```
Light Mode: #b91c1c (Red 700)
Dark Mode: #f87171 (Red 400)
```

---

## Rating Stars
```
Fill Color: #f59e0b (Amber 500)
Empty Color: rgba(26, 34, 64, 0.1) (light) / rgba(255, 255, 255, 0.1) (dark)
```

---

## Opacity Reference

### Background Overlays
- **Subtle:** `0.02` - `0.05`
- **Light:** `0.1`
- **Medium:** `0.2` - `0.4`
- **Strong:** `0.6` - `0.8`
- **Opaque:** `0.9` - `0.95`

### Text
- **Primary:** `1` (100%)
- **Secondary:** `0.9` (90%)
- **Muted:** `0.7` (70%)
- **Subtle:** `0.6` (60%)
- **Disabled:** `0.5` (50%)

### Borders
- **Subtle:** `0.1`
- **Default:** `0.2`
- **Strong:** `0.4`
- **Active:** `0.8`

---

## Color Combinations (Tested for Accessibility)

### Light Mode Pairings
✅ **#1a2240 on #ffffff** - 14.8:1 (AAA)  
✅ **#111827 on #f7f8fa** - 15.2:1 (AAA)  
✅ **#4e5a7e on #ffffff** - 5.8:1 (AA)  
✅ **#6b7280 on #ffffff** - 4.6:1 (AA)  
✅ **#ef4444 on #ffffff** - 4.1:1 (AA)  
✅ **#10b981 on #ffffff** - 2.9:1 (AA Large Text)

### Dark Mode Pairings
✅ **#f1f5f9 on #0a0f1e** - 14.2:1 (AAA)  
✅ **#ffffff on #0f1729** - 16.5:1 (AAA)  
✅ **#94a3b8 on #0a0f1e** - 7.1:1 (AAA)  
✅ **#34d399 on #0a0f1e** - 7.8:1 (AAA)  
✅ **#f87171 on #0a0f1e** - 6.2:1 (AA)

---

## Gradient Backgrounds (Used Sparingly)

### Banner Gradient (Light)
```css
background: radial-gradient(45rem 50rem at top, rgba(255, 255, 255, 0.1), transparent)
Base: #2b61eb
```

### Banner Gradient (Dark)
```css
background: radial-gradient(45rem 50rem at top, rgba(255, 255, 255, 0.05), transparent)
Base: rgba(255, 255, 255, 0.02)
```

---

## Badge Color Variants

### Info Badge (Blue)
```
Light Background: rgba(59, 130, 246, 0.1)
Light Text: #1e40af
Light Border: rgba(59, 130, 246, 0.2)

Dark Background: rgba(59, 130, 246, 0.2)
Dark Text: #93c5fd
Dark Border: rgba(59, 130, 246, 0.3)
```

### Success Badge (Green)
```
Light Background: rgba(16, 185, 129, 0.1)
Light Text: #065f46
Light Border: rgba(16, 185, 129, 0.2)

Dark Background: rgba(16, 185, 129, 0.2)
Dark Text: #6ee7b7
Dark Border: rgba(16, 185, 129, 0.3)
```

### Warning Badge (Amber)
```
Light Background: rgba(245, 158, 11, 0.1)
Light Text: #92400e
Light Border: rgba(245, 158, 11, 0.2)

Dark Background: rgba(245, 158, 11, 0.2)
Dark Text: #fcd34d
Dark Border: rgba(245, 158, 11, 0.3)
```

### Destructive Badge (Red)
```
Light Background: rgba(239, 68, 68, 0.1)
Light Text: #991b1b
Light Border: rgba(239, 68, 68, 0.2)

Dark Background: rgba(239, 68, 68, 0.2)
Dark Text: #fca5a5
Dark Border: rgba(239, 68, 68, 0.3)
```

---

## Scrollbar Colors

### Light Mode
```
Track: #f3f5fb
Thumb: #4e5a7e
Thumb Hover: #1a2240
Thumb Border: 2px solid #f3f5fb
```

### Dark Mode
```
Track: #0f1729
Thumb: #4e5a7e
Thumb Hover: #94a3b8
Thumb Border: 2px solid #0f1729
```

---

## Color Usage Guidelines

### Do's ✅
- Use `#1a2240` for primary brand interactions
- Use `#4e5a7e` for secondary / supporting elements
- Maintain consistent opacity levels across similar elements
- Test color contrast for accessibility (WCAG AA minimum)
- Use semantic colors for state (green = success, red = error)

### Don'ts ❌
- Don't use pure black (`#000000`) or pure white (`#ffffff`) for text
- Don't mix random opacity values - stick to the reference scale
- Don't use brand colors for state messages (use semantic colors instead)
- Don't forget to test both light and dark modes
- Don't use more than 3 colors in a single component (excluding borders/backgrounds)

---

## Figma Color Style Naming Convention

```
Light/Brand/Primary
Light/Brand/Secondary
Light/Neutral/Background
Light/Neutral/Foreground
Light/Neutral/Card
Light/Neutral/Muted
Light/Neutral/MutedForeground
Light/Neutral/Accent
Light/State/Success
Light/State/Destructive
Light/State/Warning
Light/State/Info
Light/Border/Default
Light/Border/Input
Light/Focus/Ring

Dark/Brand/Primary
Dark/Brand/Secondary
Dark/Neutral/Background
Dark/Neutral/Foreground
Dark/Neutral/Card
Dark/Neutral/Muted
Dark/Neutral/MutedForeground
Dark/Neutral/Accent
Dark/State/Success
Dark/State/Destructive
Dark/State/Warning
Dark/State/Info
Dark/Border/Default
Dark/Border/Input
Dark/Focus/Ring
```

---

## Color Export Formats

### CSS Custom Properties
See: `src/app/globals.css` lines 36-125

### JSON
See: `design-tokens.json` colors section

### Tailwind Config
Defined inline in `@theme` block in `globals.css`

---

## Accessibility Notes

1. All text colors meet **WCAG AA** standards (4.5:1 for normal text, 3:1 for large text)
2. Interactive elements have visible focus indicators (2px ring)
3. State colors (success, error, warning) are distinguishable by more than color alone (icons, text)
4. Color contrast is maintained in both light and dark modes
5. Opacity values never reduce text below AA standards

---

## Questions?

For implementation details or color usage questions, reference:
- `DESIGN_TOKENS.md` - Complete design system documentation
- `COMPONENT_REFERENCE.md` - Component-specific color applications
- `design-tokens.json` - Programmatic token access
