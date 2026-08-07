# NetVision Design System Specification & Token System

> **Aesthetic Foundation**: Apple precision + Linear dark modernism + Stripe visual clarity + Vercel minimalism.  
> **Target Scale**: 100,000+ Concurrent Visual Learners  
> **Status**: APPROVED DESIGN SYSTEM (MILESTONE 2)

---

## 🎨 1. Color Palette & Tokens

### Base Theme Variables
```css
:root {
  --net-bg-dark: #09090b;          /* Zinc 950 Base */
  --net-card-dark: #121217;        /* Glass Card Background */
  --net-border-dark: #272732;      /* Subdued Border Token */
  --net-cyan-accent: #00f0ff;      /* Primary Active Packet Glow */
  --net-blue-accent: #3b82f6;      /* Connected Topology Edges */
  --net-purple-accent: #8b5cf6;    /* Server Nodes & XP Indicators */
  --net-emerald-success: #10b981;  /* Verified / Completed Status */
  --net-amber-warning: #f59e0b;   /* Congestion / Streak Flame */
  --net-rose-danger: #f43f5e;      /* Dropped Packets & Firewall ACL */
}
```

---

## ✒️ 2. Typography Scale

- **UI Headings**: Inter / Geist Sans
  - `Display 1`: 72px / Bold 800 / Tracking -0.03em
  - `Heading 1`: 48px / Bold 800
  - `Heading 2`: 32px / SemiBold 700
  - `Heading 3`: 24px / SemiBold 600
- **Packet & Code Payload**: JetBrains Mono
  - `Packet Mono`: 12px - 14px / Regular 400

---

## 📐 3. Spacing & Grid System

- **4px Base Grid**: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`
- **Border Radius**:
  - `sm`: `8px` (Inputs, Small Badges)
  - `md`: `12px` (Buttons, Modals, Dropdowns)
  - `lg`: `16px` (Glass Panels)
  - `xl`: `24px - 32px` (Hero Cards, Dashboard Headers)

---

## 🌟 4. Elevation & Shadow System

- `glow-cyan`: `0 0 25px -5px rgba(0, 240, 255, 0.3)`
- `glow-blue`: `0 0 25px -5px rgba(59, 130, 246, 0.3)`
- `glow-purple`: `0 0 25px -5px rgba(139, 92, 246, 0.3)`

---

## ♿ 5. Accessibility & WCAG AA Compliance

1. **Color Contrast Ratio**: All UI text complies with WCAG AA standard (> 4.5:1 ratio against `#09090b` zinc base).
2. **Keyboard Focus Outlines**: Visible `focus-visible:ring-2 focus-visible:ring-[#00f0ff]` outlines on all interactive elements.
3. **Screen Readers**: Descriptive ARIA labels on packet simulation controls and network nodes (`aria-label="Dispatch SYN Packet"`).
4. **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` by disabling high-frequency packet particle movement.

---

## 📁 6. Component Directory Inventory

All components are located in `frontend/components/ui/` and exported via `@netvision/ui`:

| Component | File Path | Usage |
|---|---|---|
| `Button` | `frontend/components/ui/Button.tsx` | Primary, Secondary, Cyan Glow, Danger, Ghost, Outline |
| `Card` | `frontend/components/ui/Card.tsx` | Glassmorphic container with Header, Title, Content, Footer |
| `CardsLibrary` | `frontend/components/ui/CardsLibrary.tsx` | `LessonCard`, `CourseCard`, `StatCard` |
| `Input` & `Select` | `frontend/components/ui/Input.tsx` | Text inputs, dropdowns, search boxes |
| `Modal` | `frontend/components/ui/Modal.tsx` | Framer Motion spring dialogs |
| `Tooltip` | `frontend/components/ui/Tooltip.tsx` | Interactive packet term inspection popups |
| `Toast` | `frontend/components/ui/Toast.tsx` | Notification provider and hook |
| `Table` | `frontend/components/ui/Table.tsx` | Data tables for user directory and packet inspection |
| `Loading` | `frontend/components/ui/Loading.tsx` | Spinner, Skeleton loader, PulsePacketLoader |
| `Breadcrumbs` | `frontend/components/ui/Breadcrumbs.tsx` | Navigation hierarchy trail |
| `CircularProgress` | `frontend/components/ui/CircularProgress.tsx` | Radial completion meters |
| `Stepper` | `frontend/components/ui/Stepper.tsx` | Multi-step workflows |
| `Accordion` | `frontend/components/ui/Accordion.tsx` | Collapsible syllabus modules & FAQ |
| `Badge` | `frontend/components/ui/Badge.tsx` | Status indicators |
| `Alert` | `frontend/components/ui/Alert.tsx` | Info, Success, Warning, Error alerts |
| `EmptyState` | `frontend/components/ui/EmptyState.tsx` | Empty state cards with CTA |
| `Icons` | `frontend/components/ui/Icons.tsx` | Network domain icons (Router, Switch, Firewall, Server, PC) |
| `Animations` | `frontend/components/ui/Animations.tsx` | Framer Motion reusable animation variants |
