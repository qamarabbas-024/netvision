# NetVision Master UI/UX Design System & Wireframe Specification

> **Aesthetic Philosophy**: Apple precision + Linear dark modernism + Stripe visual clarity.  
> **Color System**: Dark Mode First (`#09090b` zinc base, `#121217` glass card, `#00f0ff` cyan accent, `#3b82f6` blue accent, `#8b5cf6` violet glow).  
> **Typography**: Inter / Geist Sans for UI text, JetBrains Mono for code, IP addresses, and packet headers.

---

## 🎨 Global Design System Tokens

### 1. Color Palette
- **Background Base**: `#09090b` (Zinc 950)
- **Glass Panel Surface**: `rgba(18, 18, 23, 0.75)` with `backdrop-filter: blur(16px)`
- **Border Tokens**: Subdued `#272732`, Active Accent `#00f0ff`/30
- **Glow Accents**:
  - `Cyan`: `#00f0ff` (Packet movement, primary CTA, active nodes)
  - `Blue`: `#3b82f6` (Connected edges, info tooltips)
  - `Emerald`: `#10b981` (Verified success, delivered packets, 100% quiz score)
  - `Amber`: `#f59e0b` (Congestion warning, review flag)
  - `Rose`: `#f43f5e` (Dropped packets, firewall blocks, error alerts)

### 2. Typography & Hierarchy
- **Display Headings**: 48px - 72px / Bold 800 / Tracking Tight (-0.03em)
- **Section Titles**: 24px - 36px / SemiBold 600
- **Body Text**: 14px - 16px / Regular 400 / Line Height 1.6
- **Monospace Packet / IP Data**: 12px - 14px / JetBrains Mono

### 3. Spacing & Elevation
- **Grid Scale**: 4px base (8px, 16px, 24px, 32px, 48px, 64px)
- **Border Radius**: 12px for badges/buttons, 16px - 24px for glass panels
- **Elevation**: 
  - Level 1: Flat glass panel with 1px `#272732` border
  - Level 2 (Hover): Glow shadow `0 0 25px -5px rgba(0, 240, 255, 0.25)`

---

## 📄 Page Wireframe Specifications

---

### 1. Landing Page

#### Layout
Sticky glass header navigation → Full-screen Hero with live interactive packet flow animation card → 3-column Feature Grid → Interactive Mini-Sandbox Preview → Course Catalog Highlights → Global Impact Stats → Modern Footer.

#### Components
- `HeaderNav`: Logo with cyan glow symbol, Nav links (Courses, Simulations, Sandbox, Why NetVision), `SignIn`, `GetStarted` CTA.
- `HeroSection`: Tagline badge, 72px Display Title ("Learn Networking by Seeing It"), Animated Subtitle, Dual CTAs (`Start Learning Free`, `Launch Sandbox`).
- `PacketFlowCard`: Interactive hero preview component showing a client PC sending a TCP handshake packet to a Server node across a Router.
- `FeatureCards`: 3D glass cards with micro-hover lift and glowing icon containers.

#### User Flow
1. Visitor arrives → Engaged by dynamic packet animation in Hero within 5 seconds.
2. Clicks "Launch Sandbox Demo" → Instantly opens embedded interactive sandbox preview without registration required.
3. Clicks "Get Started Free" → Transitions smoothly to `/register`.

#### Responsive Behavior
- **Desktop (1440px+)**: Full 2-column Hero split (Text left, Packet animation right).
- **Mobile (< 768px)**: Stacked single column layout; Hero animation auto-rescale to fit viewport.

---

### 2. Learner Dashboard (`/dashboard`)

#### Layout
Top stats banner (Progress %, Lessons Completed, Active Streak, Certificates Earned) → 2-column main area (Left: "Continue Learning" active course card + Recent Lessons; Right: Achievement Showcase + Daily Quest / Leaderboard).

#### Components
- `WelcomeHeader`: Personalized welcome ("Welcome back, Alex ⚡"), Current streak pill (🔥 7 Day Streak).
- `ActiveCourseCard`: Course thumbnail, Progress bar (65% completed), "Resume Lesson 4: Subnetting Basics" button.
- `StreakProgressMeter`: Radial chart showing weekly study goals met.
- `AchievementGrid`: Badge grid displaying unlocked vs. locked badges with tooltips.

#### User Flow
1. Student logs in → Directed straight to Dashboard.
2. Single-click on "Resume Lesson" → Opens active lesson viewer.

---

### 3. Course Catalog (`/courses`)

#### Layout
Search & Category Filter bar (All, Fundamentals, TCP/IP, Protocols, Security, Wireless) → 3-column Course Card Grid → "Request a Topic" footer banner.

#### Components
- `CategoryFilterPills`: Interactive toggle pills with active glow indicator.
- `CourseCard`: Level badge (Beginner / Intermediate / Advanced), Icon container, Estimated completion hours, Module list count, Enrolled student count, Progress indicator if enrolled.

#### User Flow
1. User filters by "Protocols" → Smooth Framer Motion layout transition filters grid.
2. User selects "Mastering DNS & Resolution" → Opens Course Detail Modal with full module syllabus.

---

### 4. Lesson Viewer (`/courses/[slug]/lessons/[lessonSlug]`)

#### Layout
Split-pane learning interface:
- **Left Sidebar (30%)**: Collapsible Module Syllabus, Lesson Progress Checklist, Navigation controls.
- **Main Canvas (70%)**: Multi-tab step container: `Theory` → `Animation` → `Interactive Simulation` → `Quiz` → `Summary`.

#### Components
- `ProgressBarHeader`: Segmented progress bar showing completed steps in current lesson.
- `TheoryDoc`: Rendered Markdown with interactive packet term tooltips (e.g., hovering over "TTL" pops up packet header diagram).
- `VisualAnimationPlayer`: 60 FPS animated visual canvas with Play, Pause, Scrub bar, and Speed controls (0.5x, 1x, 2x).

#### User Flow
1. Learner reads theory section → Clicks "Next: Visual Animation".
2. Visual animation plays step-by-step → Learner interacts with packet inspector.
3. Learner advances to Quiz → Completes 3 questions to unlock lesson completion status.

---

### 5. Interactive Simulation Page (`/simulations/[type]`)

#### Layout
Top Control Bar (Protocol Selector: DNS / ARP / TCP / ICMP; Speed Slider; Reset Button) → Center Full-screen Interactive Canvas → Bottom Packet Inspector Table & Event Log.

#### Components
- `SimulationToolbar`: Play/Pause controls, Step-Forward button, Packet Packet Type Selector.
- `TopologyCanvas`: Node rendering (`Client`, `DNS Server`, `Gateway Router`) with active packet pulse paths.
- `PacketInspectorPanel`: Collapsible raw packet payload viewer showing OSI Layer breakdown (Layer 2 MAC, Layer 3 IP, Layer 4 Port).

#### User Flow
1. User selects "TCP 3-Way Handshake".
2. Clicks "Dispatch SYN Packet" → Packet pulses across link to Server.
3. Inspector shows `SYN` flag set in Layer 4 header → Server responds with `SYN-ACK`.

---

### 6. Networking Sandbox Lab (`/sandbox`)

#### Layout
Left Device Palette Sidebar (PC, Laptop, Server, Router, Switch, Firewall, Cloud, Internet) → Full-screen Drag-and-Drop Canvas (`@xyflow/react`) → Right Device Inspector Panel & Console.

#### Components
- `DevicePalette`: Drag items onto canvas.
- `CanvasControls`: Zoom In/Out, Fit View, Clear Topology, Load Sample Lab, Export Topology JSON.
- `DeviceInspectorModal`: Configure IP Address, Subnet Mask, Default Gateway, Routing Table, Firewall Rules.
- `PacketRunner`: Select Source Node & Destination Node → Click "Run Ping Test" → Watch real packet traverse topology or drop at misconfigured router.

#### User Flow
1. Drag PC1 and Router1 onto canvas → Connect via Ethernet cable.
2. Click PC1 → Configure IP `192.168.1.10/24`.
3. Click "Dispatch Ping" → Observe ARP request resolve MAC address before ICMP packet moves.

---

### 7. Quiz System (`/quiz/[quizId]`)

#### Layout
Centered Glass Quiz Card with Progress Indicator → Question Text → 4 Interactive Option Buttons → Explanation Card → Next Question CTA.

#### Components
- `QuizHeader`: Question counter (Question 3 of 5), Timer pill, Exit button.
- `OptionButton`: State feedback (Default dark border, Hover glow, Selected cyan border, Correct green fill, Incorrect red fill).
- `ExplanationCard`: Appears after submission with detailed breakdown of why the correct option is right.

#### User Flow
1. Selects option B → Clicks "Submit Answer".
2. Option B glows Green with subtle checkmark animation → Explanation card slides down smoothly.
3. Clicks "Continue" → Advances to next question.

---

### 8. Certificate Page (`/certificates/[id]`)

#### Layout
Centered Certificate Display Frame → Download SVG/PDF Button → Share on LinkedIn / Twitter CTA → Verification QR Code & Unique Hash.

#### Components
- `CertificateFrame`: Dark gold/cyan glowing border certificate featuring Learner Name, Course Title, Issue Date, Digital Signature, and Verification Hash.
- `VerificationBadge`: Live verification check confirming certificate validity against NetVision API.

---

### 9. User Profile (`/profile/[username]`)

#### Layout
User Header (Avatar, Username, Role Badge, Join Date) → Stat Cards Grid (Total Study Time, Simulations Completed, Lab Points) → Earned Certificates Gallery → Activity Heatmap.

#### Components
- `ProfileHeader`: Glass banner with editable avatar container.
- `ActivityHeatmap`: GitHub-style contribution grid displaying daily networking learning activity over the past year.

---

### 10. Settings (`/settings`)

#### Layout
Left Settings Menu (Account, Profile, Security, Preferences, Notifications) → Right Content Configuration Panel.

#### Components
- `AccountForm`: Update Name, Email, Password (Argon2 validation).
- `PreferencesToggle`: Theme selector (Dark default, Light mode preview), Animation Speed default, Sound effects toggle.

---

### 11. Admin Panel (`/admin`)

#### Layout
Admin Sidebar Navigation (Overview Analytics, User Management, Course Editor, Lab Manager, Audit Logs) → Top Stats Row → Main Data Table / Visual Editor.

#### Components
- `AnalyticsCard`: Total active users, Course completion rate chart, Server health indicators.
- `UserManagementTable`: Search bar, Role selector, Ban/Suspend actions, Pagination.
- `CourseSyllabusEditor`: Drag-and-drop module and lesson re-ordering editor.

---

## 🎨 Summary of Animation & Responsive Design Specifications

- **Micro-Animations**: Framer Motion `spring` transitions (stiffness 300, damping 30) for modals, hover scaling (1.02x), and tab switches.
- **Packet Particles**: CSS Keyframe / Canvas particle paths using glowing blur radial dots.
- **Responsive Layout Breakpoints**:
  - `Mobile`: `< 640px` (Drawer menus, stacked single-column UI)
  - `Tablet`: `640px - 1024px` (2-column grids, collapsible sidebars)
  - `Desktop`: `> 1024px` (Full split views, interactive 60 FPS simulation canvas)
