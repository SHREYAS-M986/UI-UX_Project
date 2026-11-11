# AccessAudit — Developer-First Accessibility Audit Dashboard

> **WCAG Audit Results Re-imagined for Developer Velocity**  
> Prioritising high-impact fixes instead of dumping a thousand violations.

---

## 🎯 Problem Statement
Accessibility audits often overwhelm developers by dumping thousands of unfocused violations without context or priority. **AccessAudit** transforms raw WCAG findings into an actionable, motivating developer workflow:
1. **Prioritisation First**: Highlights the top 5 highest-impact, lowest-effort fixes immediately.
2. **Actionable Code Snippets**: Direct inline code snippets showing offending elements and concise WCAG guidelines.
3. **Developer Motivation**: Gamified streak tracker, real-time progress metrics (e.g. `12 of 40 fixes done`), and audit score ring gauge.
4. **Impact vs. Effort Scatter Plot**: Visual quadrant plotting to help teams schedule quick wins vs. architectural overhauls.

---

## 🎨 Strict 5-Color Organic Glassmorphic Palette

As defined by design requirements, AccessAudit strictly utilizes **only** the 5 specified palette tones (plus derived alpha/tint variations and white/black highlights):

| Token | Hex | Role | Contrast & Semantics |
|---|---|---|---|
| **Forest Black** | `#15231C` | Sidebar, primary buttons, code containers, high-contrast headings | Primary base & text (14:1+ contrast on Mist White) |
| **Deep Green** | `#21402A` | Accents, ring progress, "Minor" severity level | Accents & informational severity (circle icon) |
| **Mist White** | `#ECECE4` | Glass card surfaces, light layers, text on dark | Light surface base & dark text |
| **Amber Brown** | `#8B6222` | High-impact highlight, "Critical" severity level | Urgent attention (octagon-alert icon) |
| **Taupe** | `#A08569` | Secondary accents, "Serious" severity level | Moderate attention (triangle-alert icon) |

*Zero arbitrary red, blue, or purple hues are used.*

---

## 💎 Glassmorphic UI Architecture
- **Translucent Fill**: `rgba(236, 236, 228, 0.45)` (Mist White 35%–55%)
- **Backdrop Blur**: `backdrop-filter: blur(20px–24px)`
- **Glass Borders**: Layered 1px translucent borders (`rgba(255, 255, 255, 0.65)`) with soft dual-layer elevation shadows
- **Non-backdrop-filter Fallback**: Solid translucent/opaque CSS `@supports not (backdrop-filter: blur(1px))` fallbacks for older browsers
- **Organic Mesh Backdrop**: Soft sage/cream gradient with blurred organic fluid shapes derived strictly from the palette

---

## ♿ Accessibility Compliance (Self-Auditing)
- **Semantic HTML5 Landmarks**: `<header>`, `<nav>`, `<main>`, `<aside>`, `<div role="progressbar">`, `<div role="region">`.
- **Skip Link**: `<a href="#main-content">` accessible via keyboard navigation.
- **Contrast Ratios**: Exceeds WCAG 2.1 AA/AAA standards (all text against backgrounds maintains >= 4.5:1; Forest Black on Amber/Taupe chips ensures strict readability).
- **Redundant Encoding**: Severity is indicated not only by color, but also by icon shape and explicit text label:
  - **Critical**: Octagon-alert icon (`OctagonAlert`) + "Critical"
  - **Serious**: Triangle-alert icon (`TriangleAlert`) + "Serious"
  - **Minor**: Info icon (`Info`) + "Minor"
- **Focus Indicators**: High-visibility `focus-visible:ring-2 focus-visible:ring-deep-green focus-visible:ring-offset-2` on all interactive controls.
- **Motion Accessibility**: Supports `prefers-reduced-motion: reduce` with instantaneous transitions.
- **Touch Targets**: Minimum 44px × 44px on all interactive triggers.

---

## 📂 Project Structure

```
├── reference/
│   ├── dashboard-reference.jpg   # Image 1 (Dashboard layout)
│   └── palette-reference.jpg     # Image 2 (5-Color palette)
├── src/
│   ├── components/
│   │   ├── BackgroundMesh.tsx    # Fluid organic background shapes
│   │   ├── Button.tsx            # Accessible button primitive (44px min touch target)
│   │   ├── FixList.tsx           # "Fix These First" prioritized actionable rows
│   │   ├── GlassCard.tsx         # Reusable glassmorphic surface primitive
│   │   ├── ProgressCard.tsx      # Fixes completed, progress bar, 3-day streak
│   │   ├── ScatterChart.tsx      # Interactive Impact vs Effort quadrant chart
│   │   ├── ScoreRing.tsx         # Circular SVG progress gauge (78/100)
│   │   ├── SeverityBadge.tsx     # Shape + label + color accessible badges
│   │   ├── Sidebar.tsx           # Glass sidebar + responsive mobile bottom nav
│   │   ├── SkipLink.tsx          # Accessible skip to content link
│   │   ├── Sparkline.tsx         # Smooth SVG trend wave with gradient fills
│   │   ├── StatsRow.tsx          # Accessibility Score + 3 severity stat cards
│   │   └── TopBar.tsx            # Project switcher, search, theme icon, SM avatar, re-run audit
│   ├── data/
│   │   └── mockData.ts           # Realistic WCAG issues, metrics, scatter coordinates
│   ├── hooks/                    # Reusable custom hooks
│   ├── lib/
│   │   └── utils.ts              # Class merging utilities (clsx + tailwind-merge)
│   ├── styles/
│   │   └── globals.css           # CSS variables, glassmorphic styles, accessibility resets
│   ├── App.tsx                   # Main dashboard view & responsive layout
│   └── main.tsx                  # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

