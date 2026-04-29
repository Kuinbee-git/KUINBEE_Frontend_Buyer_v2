# Kuinbee User Frontend - Design System Documentation

**Version:** 1.0  
**Last Updated:** April 27, 2026  
**Purpose:** Design handoff package for designers and Claude Design integration

---

## 📦 What's Included

This design system extraction includes **4 comprehensive files** that document every aspect of the Kuinbee user frontend design:

### 1. **DESIGN_TOKENS.md** (Main Reference)
Complete design system specification including:
- Typography (fonts, sizes, weights)
- Color system (light & dark themes)
- Spacing & layout
- Border radius
- Component specifications
- Shadows & effects
- Interactive states
- Accessibility guidelines
- Animation & motion

**Use this for:** Complete design system overview, implementation reference

---

### 2. **design-tokens.json** (Programmatic Access)
Machine-readable JSON following the [Design Tokens Format](https://design-tokens.org) standard.

**Use this for:**
- Import into Figma via plugins (e.g., Tokens Studio)
- Programmatic access in design tools
- Integration with design automation tools
- Version control and change tracking

---

### 3. **COMPONENT_REFERENCE.md** (Visual Guide)
Detailed component specifications with visual diagrams:
- Dataset Card (primary component)
- Buttons (all variants)
- Input fields
- Cards
- Badges
- Navigation
- Filter sidebar
- Pagination
- Banner
- Loading states
- Scrollbars

**Use this for:** Component design, Figma component library creation, implementation specs

---

### 4. **COLOR_PALETTE.md** (Quick Reference)
Easy-to-scan color reference including:
- All color values (hex, RGB, HSL)
- Color usage guidelines
- Accessibility contrast ratios
- Badge color variants
- KDTS score tier colors
- Opacity reference scales
- Figma color style naming conventions

**Use this for:** Quick color lookups, ensuring consistency, accessibility checks

---

## 🎨 For Designers

### Getting Started

1. **Review `DESIGN_TOKENS.md`** first to understand the overall system
2. **Reference `COLOR_PALETTE.md`** when choosing colors
3. **Use `COMPONENT_REFERENCE.md`** when designing new features or components
4. **Import `design-tokens.json`** into your design tool for automatic sync

### Creating Figma Components

Follow the **Component Export Checklist** in `COMPONENT_REFERENCE.md`:
- Create both light and dark theme variants
- Design all interactive states (default, hover, focus, disabled)
- Use Inter font (sans-serif) and JetBrains Mono (monospace)
- Follow the spacing scale (4px grid)
- Match border radius hierarchy
- Set up auto-layout properly

### Color Naming in Figma

Use the naming convention from `COLOR_PALETTE.md`:
```
Light/Brand/Primary
Light/Neutral/Background
Dark/Brand/Primary
Dark/Neutral/Background
etc.
```

This ensures consistency and makes it easy to swap between themes.

---

## 🤖 For Claude Design Integration

### Token Structure

The `design-tokens.json` file follows the Design Tokens Community Group standard and can be consumed by:
- Design token plugins
- Style dictionary tools
- Design-to-code pipelines
- AI design assistants

### Key Sections
```json
{
  "typography": { ... },
  "colors": {
    "light": { ... },
    "dark": { ... }
  },
  "spacing": { ... },
  "borderRadius": { ... },
  "components": {
    "button": { ... },
    "input": { ... },
    "card": { ... }
  },
  "shadows": { ... },
  "animation": { ... }
}
```

---

## 🛠️ For Developers

### Implementation References

All design tokens are already implemented in:
- **CSS Custom Properties:** `src/app/globals.css` (lines 36-168)
- **Tailwind Theme:** Inline `@theme` block in `globals.css`
- **Component Library:** `src/shared/components/ui/*`

### Component Examples

Real-world implementations can be found in:
- **Dataset Card:** `src/features/datasets/components/dataset-card.tsx`
- **Button:** `src/shared/components/ui/button.tsx`
- **Input:** `src/shared/components/ui/input.tsx`
- **Card:** `src/shared/components/ui/card.tsx`

### Making Changes

1. Update the source CSS variables in `globals.css`
2. Components automatically inherit changes via Tailwind's custom properties
3. Update this documentation to reflect changes
4. Regenerate `design-tokens.json` if needed

---

## 📊 Design System Stats

- **Total Colors:** 32 (16 light + 16 dark)
- **Typography Scales:** 6 sizes, 4 weights
- **Component Variants:** 15+ documented components
- **Accessibility:** WCAG AA compliant (4.5:1 minimum contrast)
- **Theme Support:** Full light & dark mode
- **Animation Duration:** 150ms - 600ms range
- **Border Radius:** 4px - 16px scale
- **Spacing Scale:** 4px base grid

---

## 🎯 Design Principles

### 1. Consistency
- All components use the same color palette
- Spacing follows the 4px grid system
- Border radius follows a hierarchical scale

### 2. Accessibility
- Text contrast meets WCAG AA standards
- Focus indicators are always visible (2px ring)
- Interactive states are clearly defined

### 3. Dark Mode First
- Both themes designed simultaneously
- No afterthought dark mode adaptations
- Equal attention to both experiences

### 4. Performance
- Backdrop blur for glass-morphism effects
- GPU acceleration hints for animations
- Content-visibility for large lists

### 5. Flexibility
- Components work with various content lengths
- Responsive breakpoints for all screen sizes
- Graceful degradation for edge cases

---

## 📐 Component Hierarchy

### Primary Components
1. **Dataset Card** - Main content display
2. **Navigation** - Top sticky header
3. **Filter Sidebar** - Left-side filters
4. **Search Input** - Large prominent search

### Secondary Components
1. Buttons (all variants)
2. Input fields
3. Badges
4. Cards
5. Pagination

### Tertiary Components
1. Loading states
2. Skeleton loaders
3. Scrollbars
4. Dividers
5. Icons

---

## 🔄 Version History

### v1.0 (April 27, 2026)
- Initial design system extraction
- Documented all existing components
- Created JSON token file
- Established naming conventions

---

## 📝 Usage Examples

### Example 1: Creating a New Button Variant

**Reference:** `COMPONENT_REFERENCE.md` → Section 2: Button Component

1. Check existing variants (default, secondary, outline, ghost, destructive)
2. Follow the same structure:
   - Height: 40px
   - Padding: 16px horizontal
   - Border radius: 6px
   - Font: 14px medium
3. Apply appropriate colors from `COLOR_PALETTE.md`
4. Create hover, focus, and disabled states
5. Test in both light and dark modes

---

### Example 2: Designing a New Card Type

**Reference:** `COMPONENT_REFERENCE.md` → Section 4: Card Component

1. Base structure:
   - Background: `#ffffff` (light) / `#0f1729` (dark)
   - Border: 1px, `var(--border)`
   - Border radius: 12px
   - Padding: 24px
   - Gap: 24px
2. Add specific content sections (header, body, footer)
3. Ensure consistent spacing and typography
4. Test with various content lengths

---

### Example 3: Adding a New Color

**Reference:** `COLOR_PALETTE.md` → Accessibility Notes

1. Choose a base color
2. Test contrast against relevant backgrounds:
   - Text on white: minimum 4.5:1
   - Text on dark background: minimum 4.5:1
3. Create light and dark mode variants
4. Add to `globals.css` as CSS custom property
5. Document in `COLOR_PALETTE.md`
6. Update `design-tokens.json`

---

## 🤝 Collaboration Workflow

### Designer → Developer Handoff

1. **Designer** creates components in Figma following this system
2. **Designer** exports specs and assets
3. **Developer** references these docs for implementation
4. **Developer** uses existing components from `src/shared/components/ui/`
5. Both verify the implementation matches the design

### Feedback Loop

1. **Developer** finds design ambiguity
2. **Developer** references these docs first
3. If not covered, **Developer** asks designer for clarification
4. **Designer** updates Figma and these docs
5. **Developer** implements the clarified design

---

## 📚 Additional Resources

### Internal References
- **Source Code:** `/frontend/user/src/`
- **Components:** `/frontend/user/src/shared/components/ui/`
- **Styles:** `/frontend/user/src/app/globals.css`

### External Tools
- **Figma Tokens Plugin:** Import `design-tokens.json`
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Picker:** https://coolors.co/
- **Icon Library:** Lucide React (https://lucide.dev/)

### Design Token Standards
- **Spec:** https://design-tokens.org/
- **Examples:** https://github.com/design-tokens/community-group

---

## ✅ Checklist for New Features

Before starting a new feature, ensure you have:

- [ ] Reviewed the existing component library
- [ ] Checked if existing components can be reused
- [ ] Verified color choices against the palette
- [ ] Designed both light and dark mode variants
- [ ] Defined all interactive states
- [ ] Tested accessibility (contrast, focus indicators)
- [ ] Followed the spacing scale (4px grid)
- [ ] Used appropriate border radius
- [ ] Documented any new patterns
- [ ] Updated design tokens if needed

---

## 🆘 Getting Help

### Documentation Issues
If you find errors or missing information in these docs:
1. Check the source code for current implementation
2. Raise the issue with the development team
3. Update the docs once clarified

### Design Questions
For design direction or new component patterns:
1. Review existing similar components
2. Check with the design team
3. Document the decision in these files

### Technical Implementation
For technical implementation questions:
1. Reference the component source code
2. Check `globals.css` for token values
3. Consult with the development team

---

## 📄 File Locations

```
/frontend/user/
├── DESIGN_TOKENS.md           (This folder)
├── design-tokens.json          (This folder)
├── COMPONENT_REFERENCE.md      (This folder)
├── COLOR_PALETTE.md            (This folder)
├── README_DESIGN_SYSTEM.md     (This file)
├── src/
│   ├── app/
│   │   └── globals.css         (Token implementation)
│   └── shared/
│       └── components/
│           └── ui/             (Component implementations)
└── ...
```

---

## 🎉 You're All Set!

You now have complete design system documentation for the Kuinbee user frontend. Use these files as your single source of truth for:

✅ Color choices  
✅ Typography decisions  
✅ Component specifications  
✅ Layout patterns  
✅ Interaction states  
✅ Accessibility standards  

**Happy designing!** 🎨✨
