<div align="center">

# ⚡ VaroDashboard

### Self-hosted dashboard with *total design control*

**SvelteKit 2** · **Svelte 5 Runes** · **80+ CSS Variables** · **7 Themes** · **Script Engine**

[![Built with Svelte](https://img.shields.io/badge/Svelte_5-Runes-FF3E00?style=flat-square&logo=svelte)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-GPL--3.0-green?style=flat-square)](LICENSE)

[Quick Start](#-quick-start) · [Configuration](#-configuration) · [Themes](#-theme-system) · [Dev Guide](#-developer-guide)

</div>

---

## 🎯 What Is This?

VaroDashboard is a personal homepage/dashboard designed to replace tools like [Homepage](https://github.com/gethomepage/homepage), [Dashy](https://github.com/Lissy93/dashy), or [Homarr](https://github.com/ajnart/homarr) — with **zero design constraints**.

Every pixel is configurable: colors, fonts, spacing, borders, shadows, glassmorphism, card styles, layouts — all via CSS variables and JSON configs. No YAML, no container restarts, no hardcoded limits.

### How It Compares

| | Homepage | Dashy | **VaroDashboard** |
|---|:---:|:---:|:---:|
| Config format | YAML | YAML | **JSON** |
| Restart to apply | Yes | Sometimes | **Never** |
| Custom themes | Limited presets | CSS overrides | **80+ tokens + structural overrides** |
| Font customizable | No | No | **Per-theme** |
| Card style customizable | No | Partial | **Glass / Solid / Custom** |
| Script execution | No | No | **Yes, with params** |
| Runtime theme switching | Limited | Yes | **Yes, instant + persisted** |
| Technology | Go + React | Vue 2 | **SvelteKit 2 + Svelte 5** |
| Bundle size impact | ~300KB JS | ~500KB JS | **~40KB JS** (compiled) |

---

## ✨ Features

<table>
<tr><td>

**🎨 7 Built-in Themes**
Dark · Light · Midnight · Cyberpunk · Nord · Emerald · VaroServer

</td><td>

**⚙️ 80+ Design Tokens**
Override any CSS variable per-theme: colors, fonts, spacing, shadows, borders

</td></tr>
<tr><td>

**📦 Service Tiles**
Grouped cards with live HTTP status indicators, color-coded icons, and glow effects

</td><td>

**⚡ Script Execution**
Launch server scripts with parameterized forms — safely, with whitelist + sanitization

</td></tr>
<tr><td>

**🔍 Multi-Engine Search**
Google, DuckDuckGo, YouTube, GitHub, Reddit — `Ctrl+K` or `/` to focus, `Tab` to cycle

</td><td>

**🔖 Bookmark Groups**
Organized link collections with category headers

</td></tr>
<tr><td>

**📱 Responsive Layout**
Desktop, tablet, and mobile — CSS Grid auto-fill adapts to any screen

</td><td>

**🐳 Docker Ready**
Multi-stage Dockerfile, resource-capped compose, volume-mapped config

</td></tr>
</table>

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/VaroTv7/varodashboard.git
cd varodashboard
docker compose up -d
```

Dashboard at **`http://localhost:3456`**

### Option 2: From Source

```bash
git clone https://github.com/VaroTv7/varodashboard.git
cd varodashboard
npm install
npm run dev
```

Dashboard at **`http://localhost:5173`**

### Option 3: Production Build

```bash
npm run build
node build
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Services │ │ Scripts  │ │ Search   │ │ Theme System │   │
│  │ Tiles    │ │ Tiles    │ │ Widget   │ │ 80+ CSS Vars │   │
│  └────┬─────┘ └────┬─────┘ └──────────┘ └──────────────┘   │
│       │             │                                        │
├───────┼─────────────┼────────────────────────────────────────┤
│       │  SvelteKit  │  Server                                │
│  ┌────┴─────┐ ┌─────┴────┐ ┌────────────┐                   │
│  │ /api/    │ │ /api/    │ │ /api/      │                   │
│  │ status   │ │ scripts  │ │ config     │                   │
│  │ (HTTP    │ │ (exec    │ │ (JSON R/W) │                   │
│  │  ping)   │ │  engine) │ │            │                   │
│  └────┬─────┘ └────┬─────┘ └─────┬──────┘                   │
│       │             │             │                           │
│       ▼             ▼             ▼                           │
│  Your Services  Your Scripts   config/*.json                 │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | SvelteKit 2 | Full-stack (SSR + API), file-based routing, zero-config |
| **UI Reactivity** | Svelte 5 Runes | `$state()`, `$derived()`, `$effect()` — compiles to vanilla JS, no Virtual DOM |
| **Language** | TypeScript | Type safety on both client and server |
| **Styling** | CSS Custom Properties | Full runtime control, no build-time utility classes, theme-agnostic |
| **Fonts** | Inter + JetBrains Mono | Sans-serif default, monospace for VaroServer theme |
| **Backend** | SvelteKit API Routes | Node.js server routes for config I/O, health checks, script execution |
| **Config** | JSON files | Human-editable, no restart, version-controllable |
| **Deploy** | Docker + node-adapter | Multi-stage build, ~50MB image, resource-capped |

### Why Svelte 5?

- **~40% smaller bundles** — the framework is compiled away
- **No Virtual DOM** — surgical DOM updates through Runes signals
- **Ideal for low-power hardware** — tested on Intel N150 with 256MB container limit
- **Scoped styles** — each component's CSS is isolated at build time

---

## 📁 Project Structure

```
varodashboard/
│
├── config/                              ← EDIT THESE (your configuration)
│   ├── settings.json                    Theme, title, layout, search engines
│   ├── services.json                    Service tiles and groups
│   ├── bookmarks.json                   Bookmark links
│   └── scripts.json                     Executable scripts
│
├── src/
│   ├── app.html                         HTML shell (fonts, FOUC prevention)
│   ├── app.css                          🎨 DESIGN SYSTEM (80+ vars, 7 themes, animations)
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/Header.svelte     Top bar: logo, search, clock, theme switcher
│   │   │   ├── tiles/
│   │   │   │   ├── ServiceTile.svelte   Service card with status + glow + hover
│   │   │   │   ├── ScriptTile.svelte    Script launcher with parameter modal
│   │   │   │   └── BookmarkTile.svelte  Compact bookmark link
│   │   │   ├── widgets/
│   │   │   │   ├── SearchWidget.svelte  Multi-engine search (Ctrl+K, /, Tab)
│   │   │   │   └── ClockWidget.svelte   Live clock with date
│   │   │   ├── editor/
│   │   │   │   └── ThemeSwitcher.svelte Theme dropdown with swatches
│   │   │   └── ui/
│   │   │       ├── Modal.svelte         Reusable modal dialog
│   │   │       ├── Toast.svelte         Notification toasts
│   │   │       └── StatusDot.svelte     Animated status indicator
│   │   │
│   │   └── server/                      ⚙️ SERVER-ONLY CODE
│   │       ├── config.ts                JSON config reader/writer with defaults
│   │       ├── scripts.ts               Whitelist-based script execution engine
│   │       └── status.ts                HTTP health checker (HEAD requests)
│   │
│   └── routes/
│       ├── +layout.svelte               Root layout (theme + CSS var injection)
│       ├── +layout.server.ts            Server-side config loader
│       ├── +page.svelte                 🏠 Main dashboard page
│       └── api/
│           ├── config/+server.ts        GET/PUT — read/write config files
│           ├── status/+server.ts        POST — batch service status check
│           └── scripts/+server.ts       GET/POST — list/execute scripts
│
├── Dockerfile                           Multi-stage production build
├── docker-compose.yml                   Deploy with volumes + resource limits
└── package.json                         Dependencies & npm scripts
```

---

## ⚙️ Configuration

All config lives in `config/`. **Edit → Refresh → Done.** No restart needed.

### `settings.json` — Global Settings

```jsonc
{
  "title": "VaroDashboard",             // Header title
  "subtitle": "Your Command Center",     // Header subtitle
  "theme": "dark",                       // dark | light | midnight | cyberpunk | nord | emerald | varoserver
  "customTheme": {                       // Override ANY CSS variable at runtime
    "--color-primary": "#cba6f7",
    "--hue-primary": "271"
  },
  "layout": {
    "style": "grid",                     // Layout mode
    "columns": "auto",                   // Grid columns (auto = responsive)
    "showHeader": true,                  // Toggle header visibility
    "showSearch": true,                  // Toggle search bar
    "showClock": true,                   // Toggle clock widget
    "showGreeting": true,                // Toggle greeting message
    "groupsCollapsible": true            // Allow groups to collapse
  },
  "search": {
    "defaultEngine": "google",           // Default search provider
    "engines": {                         // Add/remove/rename engines freely
      "google": "https://www.google.com/search?q=",
      "duckduckgo": "https://duckduckgo.com/?q=",
      "youtube": "https://www.youtube.com/results?search_query=",
      "github": "https://github.com/search?q=",
      "reddit": "https://www.reddit.com/search/?q="
    }
  }
}
```

### `services.json` — Service Tiles

```jsonc
{
  "groups": [
    {
      "name": "Media",                   // Group header
      "icon": "play-circle",             // Group icon
      "collapsed": false,                // Start collapsed?
      "services": [
        {
          "name": "Jellyfin",            // Display name
          "url": "http://192.168.1.100:8096",
          "icon": "tv",                  // See icon list below
          "color": "#9b59b6",            // Tile accent color
          "description": "Media Server",
          "statusCheck": true,           // Enable HTTP health ping
          "openInNewTab": true
        }
      ]
    }
  ]
}
```

**Icons:** `tv` · `film` · `monitor` · `download` · `container` · `shield` · `activity` · `git-branch` · `lock` · `play-circle` · `server` · `wrench` · `refresh-cw` · `trash-2` · `gamepad-2`

### `scripts.json` — Script Execution

```jsonc
{
  "scripts": [
    {
      "id": "search-game",              // Unique identifier
      "name": "Search Game",
      "description": "Search for a game across multiple sources",
      "icon": "gamepad-2",
      "color": "#9b59b6",
      "command": "python3 scripts/search_game.py",   // Server-side only
      "parameters": [
        {
          "name": "game",                // Becomes --game "value"
          "label": "Game Name",
          "type": "text",
          "required": true,
          "placeholder": "Enter game name..."
        }
      ],
      "timeout": 30,                     // Max seconds
      "confirm": false                   // Require confirmation dialog?
    }
  ]
}
```

### `bookmarks.json` — Bookmark Links

```jsonc
{
  "groups": [
    {
      "name": "Social",
      "icon": "globe",
      "bookmarks": [
        { "name": "GitHub", "url": "https://github.com", "icon": "github" },
        { "name": "Reddit", "url": "https://reddit.com", "icon": "message-circle" }
      ]
    }
  ]
}
```

---

## 🎨 Theme System

The theming engine is the core differentiator. It uses **CSS Custom Properties** in 3 tiers, and themes can override **everything** — not just colors, but fonts, spacing, card styles, borders, and animations.

### The 7 Built-in Themes

| Theme | Base | Primary | Style |
|---|---|---|---|
| **Dark** | Deep blue `#0a0e1a` | Indigo `hsl(235,70%,65%)` | Glassmorphism, blur, gradients |
| **Light** | Off-white `#eef0f6` | Indigo | Frosted glass on light |
| **Midnight** | True dark `#0d1321` | Blue `hsl(220,75%)` | Ultra dark, subtle glows |
| **Cyberpunk** | Purple-black `#1a0a2e` | Hot pink + Cyan | Neon glows, high contrast |
| **Nord** | Arctic `#2e3440` | Muted blue | Calm, subdued, Nordic |
| **Emerald** | Dark green `#0d1f17` | Green `hsl(155,70%)` | Nature, teal accents |
| **VaroServer** | Catppuccin `#1e1e2e` | Mauve `#cba6f7` | **JetBrains Mono**, solid cards, compact, no glass |

### Token Architecture

```
Tier 1: Primitives          Tier 2: Semantic              Tier 3: Components
──────────────────          ────────────────              ──────────────────
--hue-primary: 235    →     --color-primary: ...    →     --tile-min-width: 280px
--sat-primary: 70%    →     --color-bg: ...         →     --header-height: 64px
--hue-accent: 270     →     --glass-bg: ...         →     --radius-md: 12px
                             --color-text: ...       →     --shadow-lg: ...
                             --color-success: ...    →     --transition-normal: 250ms
```

### What Can a Theme Change?

| Category | Variables | Example |
|---|---|---|
| **Backgrounds** | `--color-bg`, `--color-bg-pattern`, `--color-surface-*` | Solid vs gradient vs none |
| **Glass Effects** | `--glass-bg`, `--glass-blur`, `--glass-border`, `--glass-shadow` | Glassmorphism or solid cards |
| **Colors** | `--color-primary`, `--color-accent`, `--color-text-*` | Full palette control |
| **Status** | `--color-success`, `--color-error`, `--color-warning` | Custom indicator colors |
| **Spacing** | `--space-xs` through `--space-3xl` | Compact vs spacious layout |
| **Radius** | `--radius-xs` through `--radius-full` | Sharp vs rounded corners |
| **Shadows** | `--shadow-sm` through `--shadow-xl`, `--shadow-glow` | Flat vs elevated |
| **Typography** | `--font-xs` through `--font-4xl` | Size scale |
| **Transitions** | `--transition-fast`, `--transition-normal`, `--transition-slow` | Animation speed |
| **Layout** | `--header-height`, `--tile-min-width`, `--tile-gap` | Grid density |
| **Font Family** | Via structural CSS overrides | Any Google Font |
| **Card Style** | Via structural CSS overrides | Remove blur, change padding, borders |

### Example: VaroServer Theme (Deep Customization)

The VaroServer theme demonstrates the full extent of customization — it changes not just colors but the **entire visual language**:

```css
/* Variables: Catppuccin Mocha palette */
[data-theme="varoserver"] {
  --color-bg: #1e1e2e;
  --color-surface: #181825;
  --glass-bg: #181825;          /* Solid, not transparent */
  --glass-blur: 0px;            /* No blur */
  --color-primary: #cba6f7;     /* Mauve */
  --color-accent: #89b4fa;      /* Blue */
  --tile-min-width: 200px;      /* More compact grid */
  --font-base: 0.7rem;          /* Smaller text */
}

/* Structural: JetBrains Mono font for everything */
html[data-theme="varoserver"] * {
  font-family: 'JetBrains Mono', monospace !important;
}

/* Structural: Solid cards, no glass effect */
html[data-theme="varoserver"] .service-tile {
  background: #181825 !important;
  backdrop-filter: none !important;
  border: 1px solid #313244 !important;
}
```

### Creating Your Own Theme

**Method 1: Quick — CSS variable overrides in `settings.json`**
```json
{
  "customTheme": {
    "--hue-primary": "160",
    "--color-bg": "hsl(160, 25%, 5%)",
    "--color-primary": "#50fa7b"
  }
}
```

**Method 2: Full — New theme block in `src/app.css`**

1. Add a `[data-theme="my-theme"]` block with variable overrides
2. Optionally add `html[data-theme="my-theme"]` rules for structural changes (font, card style, etc.)
3. Register it in `ThemeSwitcher.svelte`:

```ts
const themes = [
  // ...existing themes...
  { id: 'my-theme', name: 'My Theme', color: '#hexcolor' }
];
```

---

## 🔒 Security

### Script Execution

- **Whitelist-only** — only scripts defined in `config/scripts.json` can run
- **Parameter sanitization** — shell metacharacters stripped: `` ; & | \ ` $ ( ) { } [ ] ! # ~ < > ``
- **Configurable timeout** — prevent runaway processes
- **Confirmation dialogs** — optional per-script
- **Command hidden** — the `command` field is never sent to the frontend

### API

- Config API accepts only known file names (`settings`, `services`, `bookmarks`, `scripts`)
- Status checks use `HEAD` requests with 5-second timeouts
- No authentication by default — designed for local/VPN access

---

## 📦 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/config?name=settings` | Read a config file |
| `PUT` | `/api/config?name=settings` | Write/update a config file |
| `POST` | `/api/status` | Batch health check for services |
| `GET` | `/api/scripts` | List scripts (commands excluded) |
| `POST` | `/api/scripts` | Execute a script with parameters |

<details>
<summary><strong>Example: Check service status</strong></summary>

```bash
curl -X POST http://localhost:3456/api/status \
  -H "Content-Type: application/json" \
  -d '{"services": [{"name": "Jellyfin", "url": "http://192.168.1.100:8096"}]}'
```

Response:
```json
{
  "results": [
    { "name": "Jellyfin", "online": true, "responseTime": 42 }
  ]
}
```
</details>

<details>
<summary><strong>Example: Execute a script</strong></summary>

```bash
curl -X POST http://localhost:3456/api/scripts \
  -H "Content-Type: application/json" \
  -d '{"id": "search-game", "params": {"game": "Elden Ring"}}'
```

Response:
```json
{
  "success": true,
  "output": "Found 3 results for 'Elden Ring'..."
}
```
</details>

---

## 🐳 Docker Deployment

```yaml
services:
  varodashboard:
    build: .
    container_name: varodashboard
    ports:
      - "3456:3000"
    volumes:
      - ./config:/app/config          # Your JSON configs
      - ./scripts:/app/scripts        # Your executable scripts
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
```

**Notes:**
- Config changes in `./config/` are picked up on browser refresh
- Scripts go in `./scripts/` and must be registered in `scripts.json`
- Uncomment `docker.sock` mount for future Docker status integration

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `/` or `Ctrl+K` | Focus search bar |
| `Tab` | Cycle search engine (in search) |
| `Escape` | Clear search / close modals |

---

## 🔧 Developer Guide

### Adding a New Component

```
1. Create   src/lib/components/tiles/MyTile.svelte
2. Import   in src/routes/+page.svelte
3. Use      CSS variables for all colors/spacing (theme-compatible)
```

### Adding a New API Endpoint

```
1. Create   src/routes/api/myendpoint/+server.ts
2. Export   GET, POST, PUT, or DELETE handler functions
3. Call     fetch('/api/myendpoint') from the frontend
```

### Adding a New Icon

In `ServiceTile.svelte`, add to the `iconMap`:

```ts
const iconMap: Record<string, string> = {
  'my-icon': 'M12 2L2 22h20L12 2z',   // SVG path data (24x24 viewBox)
};
```

### Adding a New Theme

1. Add CSS variable block in `src/app.css` under `[data-theme="my-theme"]`
2. For structural changes (font, card style), add `html[data-theme="my-theme"]` overrides
3. Register in `src/lib/components/editor/ThemeSwitcher.svelte`

### Modifying the Grid

Override these variables in your theme or `settings.json`:

```css
--tile-min-width: 280px;       /* Tile minimum width */
--tile-gap: 16px;              /* Gap between tiles */
--content-max-width: 1600px;   /* Dashboard max width */
```

---

## 📚 Full CSS Variable Reference

<details>
<summary><strong>Click to expand — all 80+ variables</strong></summary>

**Backgrounds & Surfaces**
```
--color-bg                    Page background
--color-bg-pattern            Background gradient overlay
--color-surface               Card background (can be semi-transparent)
--color-surface-solid         Card background (always opaque)
--color-surface-hover         Card hover state
--color-surface-active        Card active/pressed state
--color-surface-raised        Elevated surface
```

**Glass Effects**
```
--glass-bg                    Glassmorphism background
--glass-bg-hover              Glass hover state
--glass-border                Glass border
--glass-border-hover          Glass border on hover
--glass-blur                  Backdrop blur amount (0px = solid)
--glass-shadow                Glass box shadow
```

**Colors**
```
--color-primary               Primary accent color
--color-primary-hover         Primary hover state
--color-primary-glow          Primary glow (for shadows)
--color-primary-subtle        Primary at ~10% opacity
--color-accent                Secondary accent
--color-accent-glow           Accent glow
```

**Text**
```
--color-text                  Primary text
--color-text-secondary        Secondary text
--color-text-muted            Muted/hint text
--color-text-inverse          Text on primary backgrounds
```

**Status**
```
--color-success / --color-success-glow
--color-warning / --color-warning-glow
--color-error / --color-error-glow
--color-info
```

**Borders**
```
--color-border                Default border
--color-border-hover          Border on hover
--color-border-focus          Border on focus
```

**Spacing**
```
--space-xs (4px) → --space-sm (8px) → --space-md (16px)
→ --space-lg (24px) → --space-xl (32px) → --space-2xl (48px)
→ --space-3xl (64px)
```

**Radius**
```
--radius-xs (6px) → --radius-sm (8px) → --radius-md (12px)
→ --radius-lg (16px) → --radius-xl (20px) → --radius-2xl (24px)
→ --radius-full (9999px)
```

**Shadows**
```
--shadow-sm / --shadow-md / --shadow-lg / --shadow-xl
--shadow-glow                 Primary color glow
--shadow-glow-accent          Accent color glow
```

**Transitions**
```
--transition-fast (150ms)
--transition-normal (250ms)
--transition-slow (400ms)
--transition-spring (500ms, bouncy)
--transition-theme (600ms, for theme changes)
```

**Typography**
```
--font-xs (0.7rem) → --font-sm (0.8rem) → --font-base (0.9rem)
→ --font-md (1rem) → --font-lg (1.15rem) → --font-xl (1.35rem)
→ --font-2xl (1.6rem) → --font-3xl (2rem) → --font-4xl (2.5rem)
```

**Layout**
```
--header-height (64px)
--content-max-width (1600px)
--tile-min-width (280px)
--tile-gap (16px)
```

</details>

---

## 🗺️ Roadmap

- [ ] Drag-and-drop tile reordering
- [ ] Live theme editor with color pickers
- [ ] Docker container status integration (`docker.sock`)
- [ ] Weather widget
- [ ] System monitor widget (CPU, RAM, disk)
- [ ] WebSocket real-time updates
- [ ] Settings page with full UI editor
- [ ] Import/export themes

---

## 📜 License

[GPL-3.0](LICENSE)

---

<div align="center">

Made with ❤️ by [VaroTv7](https://github.com/VaroTv7)

**⚡ VaroDashboard** — *Your infrastructure, your design.*

</div>
