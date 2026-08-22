# NetVision — Master Design System Specification

> **Aesthetic Foundation**: Apple Precision + Linear Dark Modernism + Network Instrument Fidelity.  
> **Guiding Principle**: Readable and calm for prose; precise and instrument-like for interactive tools.

---

## 1. Visual Identity & Aesthetic Philosophy

* **Dark-First Precision**: High-contrast, deeply focused dark palette (`#09090b` zinc base) that eliminates visual noise and highlights packet flows and bit logic.
* **Instrument-Grade Controls**: Interactive elements should feel like hardware network analyzers and scientific instruments—crisp boundaries, live numerical feedback, and synchronized color semantics.
* **Calm Pedagogical Content**: Lesson reading views remain spacious, typography-focused, and distraction-free, avoiding the "busy monitoring console" anti-pattern for normal text.

---

## 2. Color System & Semantic Tokens

### Base Surfaces
* `bg-base` / `--net-bg-dark`: `#09090b` (Deep Zinc Base)
* `bg-surface` / `--net-card-dark`: `#121217` (Glass Card Surface)
* `bg-elevated`: `#1a1a24` (Elevated Panels & Popovers)
* `border-subtle` / `--net-border-dark`: `#272732` (Subdued Panel Borders)
* `border-active`: `#3f3f50` (Interactive Hover / Focus Borders)

### Domain & Protocol Accents
* `cyan-accent` / `--net-cyan-accent`: `#00f0ff` (Primary Interactive Glow, Network 1s, Packet Stream)
* `blue-accent` / `--net-blue-accent`: `#3b82f6` (Connected Topology Links & Infrastructure)
* `purple-accent` / `--net-purple-accent`: `#a855f7` (Subnet Masks, CIDR Prefixes, Server Nodes)
* `amber-accent` / `--net-amber-warning`: `#f59e0b` (Host Bits, Warnings, Dynamic Ephemeral States)
* `emerald-accent` / `--net-emerald-success`: `#10b981` (Verified States, Correct Answers, Completed Milestones)
* `rose-accent` / `--net-rose-danger`: `#ef4444` (Dropped Frames, Firewall Drops, Collision Anomalies)

### Typography & Text Tokens
* `text-primary`: `#ffffff` (White — Headings, Key Values, Active Metrics)
* `text-secondary`: `#d4d4d8` (Zinc-300 — Explanatory Text, Worked Examples)
* `text-muted`: `#a1a1aa` (Zinc-400 — Subtitles, Metadata, Cheatsheets)
* `text-dim`: `#71717a` (Zinc-500 — Captions, Field Labels, Bit Index Numbers)

---

## 3. Typography Hierarchy

* **Headings & Navigation**: Inter / Geist Sans
  * Display: `72px / Bold 800 / Tracking -0.03em`
  * Heading 1: `48px / Bold 800`
  * Heading 2: `32px / SemiBold 700`
  * Heading 3: `24px / SemiBold 600`
  * Body: `14px – 16px / Regular 400 / Line-Height 1.6`
* **Network Payloads, Bitmasks & CLI**: JetBrains Mono
  * Protocol Data & Packet Headers: `12px – 14px / Regular 400`
  * Bit Representation & Octet Values: `11px – 13px / Bold 700 / Monospace Tracking`

---

## 4. Layout, Spacing & Elevation

* **Grid Base**: 4px scaling (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
* **Radius Tokens**:
  * `rounded-lg`: `8px` (Inputs, Badges, Micro-Controls)
  * `rounded-xl`: `12px` (Cards, Nested Gauges)
  * `rounded-2xl`: `16px` (Glass Panels, Visualizer Enclosures)
* **Elevation & Glows**:
  * `glow-cyan`: `0 0 25px -5px rgba(0, 240, 255, 0.25)`
  * `glass-panel`: `bg-[#121217] backdrop-blur-md border border-[#272732]`

---

## 5. Interactive Instrument Design Standards

1. **Direct Manipulation**: Always pair sliders and toggles with immediate visual feedback (e.g. dragging CIDR prefix slider immediately re-calculates 32-bit boundary, subnets, and host capacities).
2. **Synchronized Representations**: Show binary, decimal, and network diagram representations simultaneously so the learner connects the theory with practical engineering reality.
3. **No Decorative Animations**: If a packet moves, it must demonstrate encapsulation, routing, switching, or protocol handshake state transitions.

---

## 6. Accessibility & Usability (WCAG AA)

* **Contrast**: All body text and control labels maintain > 4.5:1 contrast against `#09090b`.
* **Keyboard Accessibility**: Visible `focus-visible:ring-2 focus-visible:ring-[#00f0ff]` outlines on all inputs, sliders, and buttons.
* **Reduced Motion**: All packet animations and high-frequency canvas elements respect `@media (prefers-reduced-motion: reduce)`.
* **Responsive Layout**: Visualizers and practice blocks stack gracefully from mobile (360px) to ultra-wide displays.
