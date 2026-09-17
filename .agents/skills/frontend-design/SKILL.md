---
name: frontend-design
description: >-
  World-class frontend design guidelines, design systems, modern typography, color theory,
  responsive layouts, micro-interactions, accessibility, and distinctive visual aesthetics.
  Use whenever designing, building, or refining web UI/UX, components, pages, or entire applications
  to avoid generic AI-generated looks and deliver bespoke, production-ready, breathtaking interfaces.
---

# 🎨 Frontend Design & Aesthetic Engineering Skill

> **Mission**: Build web interfaces that evoke an immediate emotional reaction of quality, craft, and distinction. Eliminate generic "AI slop" (bland white cards, uninspired blue buttons, flat borders, cookie-cutter layouts) in favor of bespoke, high-polish, production-grade frontend experiences.

---

## 1. The Anti-AI Slop Manifesto

Most AI-generated web interfaces look identical: plain white cards, default Tailwind blue (`#3B82F6`), basic `rounded-lg`, zero atmospheric depth, flat gray borders, and generic typography.

### 🚫 Rules to Break the Mold
- **NEVER** use flat `#000000` for dark themes. Use deep obsidian, slate, or cosmic navy (`#090D16`, `#0B0F19`, `#0D1117`).
- **NEVER** leave a plain gray container when you can give it atmospheric depth (subtle radial gradients, ambient colored glow, glassmorphism, or faint inner border highlights).
- **NEVER** use default system typography for display headings. Pair an expressive display typeface with a laser-sharp body font.
- **NEVER** use instant, abrupt state changes. Every interaction (hover, active, focus, open, close) should have deliberate motion design with easing and micro-transforms.
- **NEVER** create flat, lifeless borders. Use semi-transparent borders (`border-white/10` in dark mode, `border-slate-200/80` in light mode) paired with subtle inner highlights (`inset 0 1px 0 rgba(255,255,255,0.1)`).

---

## 2. Aesthetics & Visual Archetypes

Select an intentional aesthetic archetype based on the product's identity:

### Archetype A: Sleek High-Tech / Modern SaaS (e.g., Linear, Vercel, Raycast)
- **Palette**: Deep slate/obsidian backgrounds, luminous accent glows (cyan, electric indigo, emerald), crisp 1px borders with subtle gradients.
- **Atmosphere**: Frosted glass (`backdrop-blur-xl bg-slate-900/60`), subtle grid or dot patterns, radial mesh backdrops.
- **Typography**: Precision sans-serif (Inter, Geist, Satoshi), tight letter tracking (`tracking-tight`), monospaced badges (`JetBrains Mono`, `font-mono`).
- **Details**: Keyboard shortcut badges (`Kbd`), subtle active rings, card hover spotlight effects.

### Archetype B: Editorial / Luxury Modern (e.g., Stripe Press, Kinfolk, Apple)
- **Palette**: Warm oatmeals, alabaster neutrals, deep espresso or charcoal text, single jewel-tone accent.
- **Atmosphere**: Generous breathing room, asymmetric whitespace, subtle noise texture, organic card corners.
- **Typography**: Expressive editorial serif or humanist display (Syne, Clash Display, Plus Jakarta Sans) paired with ultra-readable body text.
- **Details**: Large fluid typography (`clamp()`), expansive hero images, thin delicate dividers.

### Archetype C: Neo-Tactile / Modern Dynamic
- **Palette**: Vibrant, curated primary colors with high contrast; bold surface distinctions.
- **Atmosphere**: Solid offset shadows (`box-shadow: 4px 4px 0px 0px rgba(0,0,0,1)` or softened variant), crisp borders, pill-shaped tags.
- **Typography**: Punchy bold display headings, uppercase tracking-wide eyebrow tags.
- **Details**: Tactile button presses (`active:translate-x-0.5 active:translate-y-0.5`), expressive micro-badges.

---

## 3. Typography System & Hierarchy

Typography communicates 90% of your interface's quality.

### Hierarchy Formula
1. **Eyebrow / Badge**: `text-xs font-semibold uppercase tracking-widest text-primary-500`
2. **Hero Title (H1)**: `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]`
3. **Section Header (H2)**: `text-3xl sm:text-4xl font-bold tracking-tight text-balance leading-snug`
4. **Card Title (H3)**: `text-lg sm:text-xl font-semibold tracking-tight leading-snug`
5. **Body Large (Hero Subtitle)**: `text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl`
6. **Body Default**: `text-base text-slate-600 dark:text-slate-400 leading-relaxed`
7. **Caption / Meta**: `text-xs sm:text-sm text-slate-500 dark:text-slate-400`

### Recommended Modern Font Pairings
- **SaaS / Developer**: `Plus Jakarta Sans` or `Geist` for headings + `Inter` for body + `JetBrains Mono` for code/stats.
- **Modern Brand**: `Outfit` or `Cabinet Grotesk` for headings + `Inter` / `DM Sans` for body.
- **Premium Tech**: `Syne` or `Clash Display` for titles + `Satoshi` for body.

### Modern Typography Best Practices
- Use `text-balance` (or `text-wrap: balance`) on headings to prevent single orphan words.
- Always apply negative tracking (`tracking-tight` or `tracking-tighter`) to display titles (above `28px`).
- Always apply generous line-height (`leading-relaxed`) to body text for optimal readability.

---

## 4. Color Architecture & Surface Layering

Adopt the **60-30-10 rule**:
- **60% Dominant Base**: Background canvas (`bg-slate-50` light / `bg-slate-950` or `#090D16` dark).
- **30% Secondary Surface**: Cards, sidebars, headers, modals (`bg-white` light / `bg-slate-900/80` dark).
- **10% Focal Accent**: Primary CTAs, active indicators, badges, highlights.

### Surface Elevation & Layering
Instead of muddy black drop shadows, stack depth using:
1. **Surface 0 (Canvas)**: `#0B0F19` (Dark) / `#F8FAFC` (Light)
2. **Surface 1 (Cards & Panels)**: `bg-slate-900/60 backdrop-blur-xl` + `border border-white/[0.08]`
3. **Surface 2 (Elevated / Popovers / Dropdowns)**: `bg-slate-800/90 backdrop-blur-2xl` + `shadow-2xl shadow-black/40` + `border border-white/[0.12]`
4. **Surface Highlight**: `shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]` (subtle specular top rim light).

### High-Contrast Accessibility
- Text on primary buttons must have at least **4.5:1** contrast ratio (WCAG AA) or **7:1** (WCAG AAA).
- Dark mode text should never be pure white on pure black; use `#F8FAFC` (slate-50) or `#E2E8F0` (slate-200) for comfortable reading without harsh glare.
- Interactive states (hover, focus) must have distinguishable contrast changes.

---

## 5. Micro-Interactions & Motion Design

Static interfaces feel dead. Thoughtful motion creates tactile delight and builds trust.

### Easing & Timing Curves
- Standard smooth entrance/exit: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy spring-out feel).
- Duration tokens:
  - Micro-interactions (hover, active, icons): `150ms - 200ms`
  - Overlays / dropdowns: `200ms - 250ms`
  - Page transitions / sheet drawers: `300ms - 400ms`

### Interactive Button States
```html
<button class="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950">
  <span>Get Started</span>
  <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" ...></svg>
</button>
```

### Card Hover Spotlight / Glow Effect
```html
<div class="group relative rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-500/10">
  <!-- Subtle top highlight rim -->
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  <!-- Card content -->
</div>
```

---

## 6. Layout Craftsmanship & Spatial Composition

### Bento Grids
Bento grids break monotony by varying column spans, row spans, and content density:
- **Hero Card (Col span 2 or 3)**: High-impact visualization, interactive preview, or primary metric.
- **Tall Card (Row span 2)**: Feature walkthrough, live feed, or vertical comparison.
- **Compact Metric Card (Col span 1)**: Single KPI with animated counter and trend badge.
- **Action Card**: Interactive quick-action or demo toggle.

### Responsive Rhythm
- Spacing rhythm: Use a consistent spacing multiplier (e.g. `4px`: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128).
- Section gaps: `py-16 sm:py-24 lg:py-32` creates breathing room that makes the site feel spacious and confident.
- Max container widths:
  - Text articles: `max-w-prose` (65ch)
  - Focused forms/auth: `max-w-md` or `max-w-lg`
  - Content dashboards: `max-w-7xl` or `max-w-screen-2xl` with fluid padding (`px-4 sm:px-6 lg:px-8`).

---

## 7. Signature Components Playbook

### 1. Navigation Header
- Floating glassmorphism header: `sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6`
- Container: `rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20`
- Active pill indicator with smooth sliding layout transition.

### 2. Modern Dropdown / Popover
- Smooth origin-based scale transition (`origin-top-right transform transition-all duration-200 ease-out`).
- Backdrop click dismiss and keyboard `Esc` listener.
- Item hover state: subtle background tint (`hover:bg-slate-100 dark:hover:bg-white/5`), icon color transition, and checkmark indicator for active items.

### 3. High-Conversion Hero Section
- Dynamic ambient background glow (blurred radial gradient spheres with `pointer-events-none`).
- Eyebrow badge with glowing pulse dot:
  ```html
  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
    </span>
    New Version 2.0 Available
  </span>
  ```
- Dual CTA: High-contrast primary button paired with subtle secondary/ghost button with icon.
- Social proof bar: Real avatars, star rating, trust logos with low-opacity monochrome hover reveals.

### 4. Interactive Forms & Inputs
- Floating label or clean top-aligned label with micro-description.
- Focus state: `focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition-all`.
- Inline error states with icon and clear assistive message.

### 5. Custom 404 & Empty States
- Engaging, themed visual element (e.g. glowing cosmic radar, broken wire animation).
- Clear heading explaining what happened and actionable recovery buttons (Go Home, Search, Contact Support).

---

## 8. Frontend Quality & Polish Checklist

Before completing any frontend work, verify:
- [ ] **Contrast Verification**: All text meets WCAG AA standards in both Light and Dark modes.
- [ ] **Fluid Responsiveness**: Flawless display across mobile (375px), tablet (768px), desktop (1280px), and wide screens (1920px).
- [ ] **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` for users with vestibular sensitivities.
- [ ] **Keyboard Accessibility**: All interactive elements are reachable via `Tab`, visually focused with `:focus-visible`, and triggerable via `Enter`/`Space`.
- [ ] **Semantic Markup**: Proper `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<h1>`-`<h6>` structure.
- [ ] **Zero Layout Shifts (CLS)**: Explicit dimensions on media, images, and skeletons.
- [ ] **No Placeholders**: Never leave broken links or `placeholder.com` images; use SVGs, generated artwork, or contextual illustrations.
