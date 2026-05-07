<div align="center">

# ⚡ VaroDashboard

**A modern, highly customizable self-hosted dashboard**

Built with SvelteKit 2 + Svelte 5 (Runes) • Glassmorphism UI • Script Execution • 6 Themes

</div>

---

## 🎯 What is this?

A personal dashboard/homepage to replace [gethomepage/homepage](https://github.com/gethomepage/homepage) with **full design control**. Everything is customizable — themes, layout, colors, services, scripts — without restarting the server.

### Why not use Homepage/Dashy/Homarr?

| Problem | VaroDashboard Solution |
|---|---|
| Homepage requires YAML editing + container restart | JSON config, changes apply instantly |
| Limited design customization | 80+ CSS variables, custom themes, full glassmorphism |
| No script execution | Execute scripts with parameters from the UI |
| Widget constraints, hard-coded limits | Extensible component system |
| Can't customize everything | Override ANY design token from config |

---

## ✨ Features

- 🎨 **6 Built-in Themes** — Dark, Light, Midnight, Cyberpunk, Nord, Emerald
- 🔧 **Fully Customizable** — Override any of the 80+ CSS variables from config
- 📦 **Service Tiles** — Organized groups with live status indicators (HTTP ping)
- ⚡ **Script Execution** — Launch scripts with parameters from the dashboard
- 🔍 **Multi-Engine Search** — Google, DuckDuckGo, YouTube, GitHub, Reddit (`Ctrl+K` or `/`)
- 🔖 **Bookmarks** — Organized bookmark groups
- 🕐 **Live Clock** — Time and date display
- 🎯 **Collapsible Groups** — Keep your dashboard organized
- 📱 **Responsive** — Desktop, tablet, and mobile
- 🐳 **Docker Ready** — Deploy in seconds
- 🚀 **Lightning Fast** — Svelte compiles to vanilla JS, no runtime overhead

---

## 🚀 Quick Start

### Docker (Recommended)

```bash
docker compose up -d
```

Open `http://localhost:3456`

### From Source (Development)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

### Production Build

```bash
npm run build
node build
```

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | SvelteKit 2 | Full-stack: SSR + API routes, file-based routing |
| **UI** | Svelte 5 (Runes) | Signal-based reactivity (`$state`, `$derived`, `$effect`), compiles to vanilla JS |
| **Language** | TypeScript 6 | Type safety everywhere |
| **Styling** | Vanilla CSS + Custom Properties | Full control, runtime theme switching, no TailwindCSS dependency |
| **Backend** | SvelteKit API Routes | No separate backend needed, Node.js access for scripts |
| **Config** | JSON files | Easy to edit, version-controllable |
| **Deployment** | Docker + Node adapter | Production-ready |

### Why Svelte 5 over React/Next.js?
- **~40% smaller bundles** — compiles away the framework
- **No Virtual DOM** — surgical DOM updates via signals
- **Runes** — explicit reactivity with `$state()`, `$derived()`, `$effect()`
- **Ideal for low-power hardware** (e.g., Intel N150)

---

## 📁 Project Structure

```
varodashboard/
├── config/                          # ← YOUR CONFIGURATION (edit these!)
│   ├── settings.json                #   Dashboard settings, theme, search engines
│   ├── services.json                #   Service tiles (groups + services)
│   ├── bookmarks.json               #   Bookmark links
│   └── scripts.json                 #   Executable scripts
│
├── src/
│   ├── app.html                     # HTML shell (Google Fonts, FOUC prevention)
│   ├── app.css                      # 🎨 DESIGN SYSTEM — All CSS variables & themes
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Header.svelte    # Top bar: logo, search, clock, theme switcher
│   │   │   ├── tiles/
│   │   │   │   ├── ServiceTile.svelte   # Service card with status + glow effects
│   │   │   │   ├── ScriptTile.svelte    # Script launcher with parameter modal
│   │   │   │   └── BookmarkTile.svelte  # Compact bookmark link
│   │   │   ├── widgets/
│   │   │   │   ├── SearchWidget.svelte  # Multi-engine search (Ctrl+K)
│   │   │   │   └── ClockWidget.svelte   # Live clock
│   │   │   ├── editor/
│   │   │   │   └── ThemeSwitcher.svelte # Theme dropdown selector
│   │   │   └── ui/
│   │   │       ├── Modal.svelte     # Reusable modal dialog
│   │   │       ├── Toast.svelte     # Notification toasts
│   │   │       └── StatusDot.svelte # Online/offline indicator
│   │   │
│   │   └── server/                  # ⚙️ SERVER-SIDE CODE
│   │       ├── config.ts            # JSON config reader/writer
│   │       ├── scripts.ts           # Script execution engine (whitelist)
│   │       └── status.ts            # Service HTTP health checker
│   │
│   └── routes/
│       ├── +layout.svelte           # Root layout (theme application)
│       ├── +layout.server.ts        # Loads all configs on server
│       ├── +page.svelte             # 🏠 MAIN DASHBOARD PAGE
│       └── api/
│           ├── config/+server.ts    # GET/PUT config API
│           ├── status/+server.ts    # POST service status checks
│           └── scripts/+server.ts   # GET list / POST execute scripts
│
├── static/
│   └── favicon.svg                  # SVG favicon
│
├── Dockerfile                       # Multi-stage production build
├── docker-compose.yml               # Docker deployment config
├── svelte.config.js                 # SvelteKit config (Node adapter)
├── vite.config.ts                   # Vite bundler config
├── package.json                     # Dependencies & scripts
└── tsconfig.json                    # TypeScript config
```

---

## ⚙️ Configuration Guide

All config lives in `config/`. Edit these files and refresh the browser — no restart needed.

### `config/settings.json` — Global Settings

```jsonc
{
  "title": "VaroDashboard",         // Dashboard title in header
  "subtitle": "Your Command Center", // Subtitle under title
  "theme": "dark",                   // Active theme: dark|light|midnight|cyberpunk|nord|emerald
  "customTheme": {                   // Override ANY CSS variable
    "--color-primary": "hsl(160, 80%, 50%)",
    "--hue-primary": "160"
  },
  "layout": {
    "style": "grid",                 // Layout mode
    "columns": "auto",               // Grid columns (auto = responsive)
    "tileSize": "normal",            // Tile size
    "showHeader": true,              // Show/hide header
    "showSearch": true,              // Show/hide search bar
    "showClock": true,               // Show/hide clock
    "showGreeting": true,            // Show/hide greeting message
    "groupsCollapsible": true        // Allow group collapse
  },
  "search": {
    "defaultEngine": "google",       // Default search engine
    "engines": {                     // Available engines (name → URL prefix)
      "google": "https://www.google.com/search?q=",
      "duckduckgo": "https://duckduckgo.com/?q=",
      "youtube": "https://www.youtube.com/results?search_query=",
      "github": "https://github.com/search?q=",
      "reddit": "https://www.reddit.com/search/?q="
    }
  }
}
```

### `config/services.json` — Service Tiles

```jsonc
{
  "groups": [
    {
      "name": "Media",              // Group name displayed in header
      "icon": "play-circle",        // Group icon (emoji or icon name)
      "collapsed": false,            // Start collapsed?
      "services": [
        {
          "name": "Jellyfin",        // Service display name
          "url": "http://192.168.1.100:8096",  // URL to open when clicked
          "icon": "tv",             // Icon name (see Available Icons below)
          "color": "#9b59b6",       // Accent color for this tile
          "description": "Media Server",  // Subtitle text
          "statusCheck": true,      // Enable HTTP ping status check
          "openInNewTab": true      // Open in new tab on click
        }
      ]
    }
  ]
}
```

**Available Icons:** `tv`, `film`, `monitor`, `download`, `container`, `shield`, `activity`, `git-branch`, `lock`, `play-circle`, `server`, `wrench`, `refresh-cw`, `trash-2`, `gamepad-2`

### `config/scripts.json` — Script Execution

```jsonc
{
  "scripts": [
    {
      "id": "search-game",           // Unique script ID
      "name": "Search Game",          // Display name
      "description": "Search for a game across multiple sources",
      "icon": "gamepad-2",            // Icon
      "color": "#9b59b6",             // Accent color
      "command": "python3 scripts/search_game.py",  // Command to execute
      "parameters": [                  // Parameters the user fills in
        {
          "name": "game",             // Parameter name (passed as --game "value")
          "label": "Game Name",       // Label shown in form
          "type": "text",             // Input type: text, number, etc.
          "required": true,           // Required field?
          "placeholder": "Enter game name..."
        }
      ],
      "timeout": 30,                   // Max execution time in seconds
      "confirm": false                 // Ask confirmation before running?
    }
  ]
}
```

### `config/bookmarks.json` — Bookmark Links

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

## 🎨 Theme System — How It Works

The theme engine uses **CSS Custom Properties** (CSS variables) organized in 3 tiers:

### Tier 1: Primitive Tokens (Hue/Saturation)
```css
--hue-primary: 235;     /* Primary color hue (0-360) */
--sat-primary: 70%;     /* Primary color saturation */
--hue-accent: 270;      /* Accent color hue */
--sat-accent: 80%;      /* Accent color saturation */
```

### Tier 2: Semantic Tokens (Colors, Surfaces, Glass)
```css
--color-bg: ...;              /* Page background */
--color-surface: ...;         /* Card/tile background */
--color-primary: ...;         /* Primary accent color */
--color-text: ...;            /* Main text color */
--color-text-secondary: ...;  /* Secondary text */
--glass-bg: ...;              /* Glassmorphism background */
--glass-blur: 24px;           /* Backdrop blur amount */
--glass-border: ...;          /* Glass border color */
```

### Tier 3: Component Tokens (Spacing, Radius, Shadows)
```css
--radius-md: 12px;            /* Border radius */
--shadow-lg: ...;             /* Box shadow */
--transition-normal: 250ms;   /* Animation duration */
--tile-min-width: 280px;      /* Min tile width in grid */
--header-height: 64px;        /* Header height */
```

### Creating a Custom Theme

**Method 1**: Override in `settings.json`
```json
{
  "customTheme": {
    "--hue-primary": "160",
    "--color-bg": "hsl(160, 25%, 5%)",
    "--color-surface": "hsla(160, 20%, 10%, 0.8)"
  }
}
```

**Method 2**: Add a new theme in `src/app.css`
```css
[data-theme="my-theme"] {
  --hue-primary: 45;
  --sat-primary: 90%;
  --color-bg: hsl(30, 20%, 5%);
  --color-surface: hsla(30, 15%, 10%, 0.8);
  /* ... override any variable ... */
}
```
Then add it to `ThemeSwitcher.svelte` in the `themes` array.

### Full List of CSS Variables

The complete list is in `src/app.css`. There are **80+ variables** you can override, organized by:
- Backgrounds & Surfaces (`--color-bg`, `--color-surface-*`)
- Glass effects (`--glass-*`)
- Colors (`--color-primary`, `--color-accent`, `--color-text-*`)
- Status colors (`--color-success`, `--color-error`, `--color-warning`)
- Spacing (`--space-xs` through `--space-3xl`)
- Border radius (`--radius-xs` through `--radius-full`)
- Shadows (`--shadow-sm` through `--shadow-xl`, `--shadow-glow`)
- Transitions (`--transition-fast`, `--transition-normal`, `--transition-slow`)
- Typography (`--font-xs` through `--font-4xl`)
- Layout (`--header-height`, `--content-max-width`, `--tile-min-width`)

---

## 🔧 How to Modify

### Add a New Component

1. Create `src/lib/components/tiles/MyTile.svelte`
2. Import it in `src/routes/+page.svelte`
3. Add it to the template

### Add a New API Endpoint

1. Create `src/routes/api/myendpoint/+server.ts`
2. Export `GET`, `POST`, `PUT`, or `DELETE` functions
3. Access from frontend with `fetch('/api/myendpoint')`

### Add a New Widget

1. Create `src/lib/components/widgets/MyWidget.svelte`
2. Add it to `Header.svelte` or `+page.svelte`

### Add a New Icon

Edit the `iconMap` in `ServiceTile.svelte` — add an SVG path:
```ts
const iconMap: Record<string, string> = {
  'my-icon': 'M12 2L2 22h20L12 2z',  // SVG path data
  // ...
};
```

### Modify the Grid Layout

In `src/app.css`, change:
```css
:root {
  --tile-min-width: 280px;   /* Make tiles wider/narrower */
  --tile-gap: 16px;          /* Space between tiles */
  --content-max-width: 1600px; /* Dashboard max width */
}
```

---

## 🔒 Script Security

Scripts use a **whitelist-only** approach:
- Only scripts defined in `config/scripts.json` can be executed
- Parameters are sanitized (shell characters stripped: `; & | \` $ ( ) { } [ ] ! # ~ < >`)
- Each script has a configurable timeout
- Scripts can require confirmation before execution
- The `command` field is never exposed to the frontend API

---

## 📦 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/config?name=settings` | Read a config file |
| `PUT` | `/api/config?name=settings` | Write a config file |
| `POST` | `/api/status` | Check service statuses (batch) |
| `GET` | `/api/scripts` | List available scripts (no commands) |
| `POST` | `/api/scripts` | Execute a script with params |

### Status Check Example
```bash
curl -X POST http://localhost:5173/api/status \
  -H "Content-Type: application/json" \
  -d '{"services": [{"name": "Jellyfin", "url": "http://192.168.1.100:8096"}]}'
```

### Script Execution Example
```bash
curl -X POST http://localhost:5173/api/scripts \
  -H "Content-Type: application/json" \
  -d '{"id": "search-game", "params": {"game": "Elden Ring"}}'
```

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
      - ./config:/app/config        # Your config files
      - ./scripts:/app/scripts      # Your scripts
      # - /var/run/docker.sock:/var/run/docker.sock:ro  # Docker status
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
```

---

## 🔍 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `/` or `Ctrl+K` | Focus search bar |
| `Tab` (in search) | Cycle search engines |
| `Escape` | Clear search / close modals |

---

## 📜 License

GPL-3.0

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/VaroTv7">VaroTv7</a>
</div>
