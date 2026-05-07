# 🛰️ varoserver — Brand System SSOT
**Versión:** v1.0  
**Fecha:** 2026-04-21  
**Directorio:** `/home/varo/varoserver/brand/`  
**Referencia visual:** `varoserver-branding.html` (exploración completa), `varoserver-homepage.html` (homepage mock)

---

## 0. 🧠 Contexto para agentes IA

> Si eres una IA implementando este branding (Claude Code, Diane, etc.), lee este documento completo antes de tocar ningún archivo. Es la Fuente de Verdad del sistema visual de varoserver.

**Reglas obligatorias:**
- La paleta es **Catppuccin Mocha** — no inventes colores nuevos, usa los tokens de `varoserver-tokens.css`
- La fuente es **JetBrains Mono** en todos los contextos — sin excepciones
- El logo es la **constelación V** (`varoserver-logo.svg`) — no uses texto plano como logo
- **Diane** usa siempre `--vs-accent` (#89b4fa, blue) como color propio, nunca mauve
- Importa `varoserver-tokens.css` como primera hoja de estilos en cualquier app nueva

---

## 1. Identidad Visual

### 1.1 Nombre y versión
| Campo | Valor |
|---|---|
| Nombre | varoserver |
| Capitalización | **siempre minúscula** en logotipo y UI (`varoserver`, no `VaroServer`) |
| Tagline | `home infrastructure` |
| Versión sistema | v1.0 (basado en Catppuccin Mocha) |

### 1.2 Logo — V Constellation

**Archivo:** `brand/varoserver-logo.svg`

El logo es una constelación de nodos que forman una **V**. No es tipografía, es geometría pura.

**Anatomía:**
- **Nodo ápex izquierdo** `(6,8)` — mauve `#cba6f7` — r=3.5
- **Nodo ápex derecho** `(50,8)` — green `#a6e3a1` — r=3.5
- **Nodo vértice** `(28,48)` — blue `#89b4fa` — r=4 (el más grande)
- **Nodos medios** `(17,26)` y `(39,26)` — mauve 75% opacidad — r=2.5
- **Nodos satélite** `(11,17)`, `(23,37)`, `(33,37)`, `(45,17)` — 45% opacidad — r=1.5
- **Líneas de conexión** — strokeWidth=1, opacity=0.55

**Viewbox:** `-8 0 72 64` (ancho efectivo: 64px lógicos, alto: 64px)

**Variantes de color del logo:**
| Variante | Uso | Colores |
|---|---|---|
| `default` | apps sobre fondo oscuro | mauve + blue + green (estándar) |
| `mono-mauve` | icono monocromático | todo #cba6f7 |
| `mono-blue` | Diane sub-brand | todo #89b4fa |
| `inverse` | sobre fondos claros | #7287fd + #1e66f5 + #40a02b (Catppuccin Latte) |

**Tamaños mínimos:**
- Favicon: 16×16px (usar variante `mono-mauve` simplificada — solo 5 nodos primarios)
- Sidebar compact: 20×20px
- Sidebar normal: 28×28px
- Header/topbar: 32–40px
- Hero/splash: 72–120px

**Clear space:** mínimo ½ de la altura del símbolo en todos los lados.

**NO hacer:**
- No cambiar los colores de los nodos sin motivo
- No rotar el logo
- No añadir sombra drop-shadow al logo completo (solo al elemento individual con filter si es necesario)
- No usar el logo sobre fondos claros sin adaptar a variante inverse

---

## 2. Colores

**Base:** Catppuccin Mocha — paleta dark, warm-toned.

```css
/* Importar en cualquier app: */
@import url('/brand/varoserver-tokens.css');
```

### 2.1 Fondos (de más oscuro a más claro)
| Token CSS | Hex | Uso |
|---|---|---|
| `--vs-crust` | `#11111b` | Topbars, barras de estado, fondos más profundos |
| `--vs-mantle` | `#181825` | Sidebars, cards secundarias, paneles |
| `--vs-bg` | `#1e1e2e` | **Fondo principal de todas las apps** |
| `--vs-surface0` | `#313244` | Cards, bordes, dividers |
| `--vs-surface1` | `#45475a` | Hover sobre surface0 |

### 2.2 Texto
| Token CSS | Hex | Uso |
|---|---|---|
| `--vs-text` | `#cdd6f4` | Texto principal |
| `--vs-subtext` | `#a6adc8` | Texto secundario |
| `--vs-overlay` | `#6c7086` | Labels, hints, metadata, placeholders |

### 2.3 Accent colors (uno por categoría de servicio)
| Token CSS | Hex | Nombre | Categoría |
|---|---|---|---|
| `--vs-primary` | `#cba6f7` | Mauve | Identidad principal, Infraestructura |
| `--vs-accent` | `#89b4fa` | Blue | **Diane**, links, focus states |
| `--vs-sapphire` | `#74c7ec` | Sapphire | Productividad |
| `--vs-ok` | `#a6e3a1` | Green | Estado OK, Smart Home, uptime |
| `--vs-warn` | `#fab387` | Peach | Alertas, Media |
| `--vs-error` | `#f38ba8` | Red | Crítico, down |
| `--vs-yellow` | `#f9e2af` | Yellow | Gaming |
| `--vs-pink` | `#f5c2e7` | Pink | Varo Apps |

### 2.4 Colores por categoría de servicio
```css
--vs-cat-infra:     #cba6f7;  /* mauve */
--vs-cat-ai:        #89b4fa;  /* blue */
--vs-cat-smarthome: #a6e3a1;  /* green */
--vs-cat-prod:      #74c7ec;  /* sapphire */
--vs-cat-media:     #fab387;  /* peach */
--vs-cat-gaming:    #f9e2af;  /* yellow */
--vs-cat-apps:      #f5c2e7;  /* pink */
```

---

## 3. Tipografía

**Fuente única:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
```

O en CSS:
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

### Escala tipográfica
| Rol | Tamaño | Peso | Letter-spacing | Color por defecto |
|---|---|---|---|---|
| H1 / Título hero | 28px | 600 | 0.05em | `--vs-text` |
| H2 / Sección | 16–20px | 600 | 0.04em | `--vs-text` |
| Label / Badge | 8–9px | 500 | 0.2em | `--vs-overlay` (MAYÚSCULAS) |
| Body | 11px | 400 | 0.02em | `--vs-subtext` |
| Code / Terminal | 10–11px | 400 | 0.02em | `--vs-ok` o `--vs-text` |
| Metadata | 8px | 400 | 0.05em | `--vs-overlay` |

**Regla:** los labels en mayúsculas llevan `letter-spacing: 0.2em`. El texto en minúscula usa `letter-spacing: 0.02–0.05em`.

---

## 4. Componentes

### 4.1 Service Card
```html
<div class="vs-card" style="border-color: rgba(203,166,247,0.2);">
  <div style="display:flex; align-items:center; gap:10px;">
    <!-- Icon badge -->
    <div class="vs-icon-badge">
      <!-- SVG icon aquí -->
    </div>
    <div>
      <div style="color:var(--vs-text); font-size:11px; font-weight:600;">Jellyfin</div>
      <div style="color:var(--vs-overlay); font-size:9px;">media server · host mode</div>
    </div>
    <div class="vs-dot vs-dot--ok" style="margin-left:auto;"></div>
  </div>
  <div style="display:flex; justify-content:space-between; margin-top:10px;">
    <span class="vs-badge vs-badge--primary">:8096</span>
    <span style="color:var(--vs-surface1); font-size:8px;">~220MB</span>
  </div>
</div>
```

### 4.2 Status Badge
```html
<!-- nominal -->
<span class="vs-badge vs-badge--ok">● NOMINAL</span>
<!-- running -->
<span class="vs-badge vs-badge--accent">↑ RUNNING</span>
<!-- warning -->
<span class="vs-badge vs-badge--warn">⚡ WARN</span>
<!-- down -->
<span class="vs-badge vs-badge--error">✕ DOWN</span>
<!-- paused -->
<span class="vs-badge vs-badge--muted">◌ PAUSED</span>
```

### 4.3 Resource Bar
```html
<div style="display:flex; align-items:center; gap:8px;">
  <span class="vs-label" style="width:28px;">CPU</span>
  <div class="vs-bar" style="flex:1;">
    <div class="vs-bar__fill vs-bar__fill--primary" style="width:62%;"></div>
  </div>
  <span style="color:var(--vs-primary); font-size:8px;">62%</span>
</div>
```

### 4.4 Sidebar Nav Item
```css
.vs-nav-item {
  padding: 7px 10px;
  border-radius: var(--vs-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--vs-font-mono);
  font-size: 10px;
  transition: var(--vs-transition-fast);
  color: var(--vs-overlay);
  background: transparent;
  border: 1px solid transparent;
}
.vs-nav-item:hover {
  background: rgba(49,50,68,0.5);
  color: var(--vs-subtext);
}
.vs-nav-item.active {
  background: rgba(203,166,247,0.1);
  border-color: rgba(203,166,247,0.25);
  color: var(--vs-primary);
  font-weight: 600;
}
```

### 4.5 Diane Card
```html
<div style="background: rgba(137,180,250,0.05); border-radius: var(--vs-radius-lg); padding: 12px; border: 1px solid rgba(137,180,250,0.2);">
  <div style="display:flex; align-items:center; gap:8px;">
    <!-- Logo V en variante mono-blue (todo #89b4fa) -->
    <svg width="24" height="24" viewBox="-8 0 72 64" fill="none">
      <!-- ver brand/varoserver-logo.svg pero con fill="#89b4fa" en todos los elementos -->
    </svg>
    <div>
      <div style="color:#89b4fa; font-size:12px; font-weight:600; letter-spacing:0.05em;">diane</div>
      <div style="color:var(--vs-overlay); font-size:9px;">engineering partner · openclaw</div>
    </div>
    <div class="vs-dot vs-dot--ok" style="margin-left:auto;"></div>
  </div>
</div>
```

---

## 5. Estructura de Archivos del Brand

```
/home/varo/varoserver/brand/
├── varoserver-tokens.css    ← CSS custom properties (importar en todas las apps)
├── varoserver-logo.svg      ← Logo V constellation (fuente de verdad del SVG)
└── VAROSERVER_BRAND.md      ← Este documento
```

**Referencia de diseño visual** (en el proyecto de diseño):
- `varoserver-branding.html` — canvas con 4 direcciones + logo explorations + brand system guide
- `varoserver-homepage.html` — homepage interactiva de referencia (React + Catppuccin)

---

## 6. Topbar / Header — Estructura estándar

Todas las apps del homelab deben tener un topbar consistente con esta estructura:

```
[Logo V 28px] [varoserver] | [stats CPU/RAM opcionales] | [spacer] | [nombre app] | [hora/IP opcionales]
```

- Fondo: `--vs-crust`
- Altura: 48–52px
- Border-bottom: `1px solid var(--vs-surface0)`
- Separadores: `1px solid var(--vs-surface0)`, height 20px

---

## 7. Homepage (`varoserver-homepage.html`)

La homepage implementa el dashboard principal del homelab. Referencia para apps que quieran integrarse:

### Estructura de datos de un servicio:
```js
{
  name: 'Jellyfin',        // nombre display
  port: 8096,              // puerto (null si no aplica)
  desc: 'Media server',    // descripción corta
  mem: '~220MB',           // consumo de RAM
  status: 'up',            // 'up' | 'paused' | 'down'
  ico: 'jellyfin',         // key del objeto ICONS
}
```

### Categorías de servicios:
`infra` | `ai` | `smarthome` | `prod` | `media` | `gaming` | `apps`

### Cómo añadir un nuevo servicio a la homepage:
1. Abrir `varoserver-homepage.html`
2. Localizar el objeto `SERVICES` en el script
3. Añadir el item en la categoría correcta siguiendo la estructura anterior
4. Añadir el SVG icon en el objeto `ICONS` con la misma key (ver sección de iconos)
5. El icono debe ser SVG con viewBox="0 0 24 24", stroke-based, sin relleno sólido

---

## 8. Iconos de Servicios

Los iconos son SVG `24×24` con `viewBox="0 0 24 24"`, estilo línea (stroke), sin fills sólidos.
El color se pasa como parámetro `c` (en React) o se puede hardcodear al color de la categoría.

**Estilo de trazo:**
- `strokeWidth`: 1.3–1.5
- `strokeLinecap`: `round`
- `strokeLinejoin`: `round`
- Ningún fill sólido excepto `fill={color+'20'}` para áreas cerradas (10-20% opacidad)

**Iconos implementados:**
`adguard`, `npm`, `portainer`, `uptime`, `beszel`, `wireguard`, `diane`, `ollama`, `n8n`, `telegram`, `ha`, `matter`, `nextcloud`, `paperless`, `affine`, `outline`, `siftly`, `jellyfin`, `immich`, `komga`, `romm`, `minecraft`, `foundry`, `gamevault`, `promptvault`, `varologs`, `varodesign`, `cosas`

---

## 9. Diane — Sub-brand

Diane es la IA Engineering Partner del sistema. Tiene su propia identidad dentro de la marca varoserver.

| Elemento | Valor |
|---|---|
| Nombre display | `diane` (minúscula siempre) |
| Color | `--vs-accent` — #89b4fa (blue) |
| Logo | V constellation en variante `mono-blue` |
| Tagline | `engineering partner · openclaw` |
| Info técnica | Gemma 4 26B · 192.168.1.136:11434 |
| Badge | `<span class="vs-badge vs-badge--accent">elite</span>` |

La identidad de Diane es **siempre blue (#89b4fa)**, nunca mauve ni otros colores. Cuando aparezca en una app, su card sigue la estructura del componente `4.5` de este documento.

---

## 10. Implementación rápida — Checklist para una app nueva

```markdown
- [ ] Importar Google Fonts: JetBrains Mono 400/500/600/700
- [ ] Importar /brand/varoserver-tokens.css como primera hoja de estilos
- [ ] Fondo body: background: var(--vs-bg)
- [ ] Font-family base: var(--vs-font-mono)
- [ ] Color texto: color: var(--vs-text)
- [ ] Topbar con logo V (brand/varoserver-logo.svg) + "varoserver" en --vs-text
- [ ] Scrollbars finos (ya incluidos en tokens.css)
- [ ] Usar tokens --vs-* para TODOS los colores, nunca hardcodear hex nuevos
- [ ] Status dots con clase .vs-dot y variante correcta
- [ ] Cards con clase .vs-card
- [ ] Labels en MAYÚSCULA con letter-spacing: 0.2em y color --vs-overlay
```

---

**SSOT Brand System varoserver v1.0** 🛰️  
*Identidad visual: Catppuccin Mocha · JetBrains Mono · V Constellation*
