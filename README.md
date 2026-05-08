# 🚀 VaroDashboard: El Centro de Mando Definitivo para VaroServer

> **MANTRA Y FILOSOFÍA:** ULTRA PERSONALIZABLE, ULTRA OPTIMIZADO, EFICIENTE, RECARGADO, JUICY, RICE.
> "Si no brilla, si no se mueve y si no muestra datos... no es VaroDashboard."

VaroDashboard no es solo una interfaz de usuario; es una **suite de administración de alto rendimiento** diseñada para el Intel N150. Combina telemetría real de hardware con una estética agresiva, densa y orientada al "RICE" (Customización Visual Extrema).

---

## 🛠️ Cómo Conectar TODO (Guía de Conectividad)

El dashboard está diseñado para ser el nodo central de tu servidor. Aquí tienes cómo conectarlo a tu infraestructura real:

### 1. Telemetría de Hardware (CPU, RAM, Disco)
El backend utiliza Node.js `os` y `fs` para leer directamente del sistema operativo.
- **Configuración Automática**: Al iniciar con `npm run dev` o en Docker, el dashboard detectará tu CPU y memoria automáticamente.
- **Personalización**: Puedes extender la API en `src/routes/api/system/+server.ts` si necesitas leer sensores de temperatura específicos o GPUs.

### 2. Servicios y Aplicaciones (Docker/Web)
Edita el archivo `config/services.json` para añadir tus servicios (Jellyfin, Plex, *arr, etc.).
- **Detección de Estado**: El dashboard realiza un "ping" HTTP a cada servicio para mostrar si está online.
- **Iconos**: Usa emojis o iconos de Lucide. La propiedad `icon` en el JSON controla esto.


### 2b. Control de Contenedores Docker (Avanzado)
VaroDashboard es ahora una suite completa de control de contenedores.
- **Acceso Directo**: Requiere el socket de Docker (`/var/run/docker.sock`) con permisos `:rw`.
- **Botones Dinámicos**: Si configuras `containerName` en `services.json`, el tile mostrará controles ▶/⏹.
- **Arranque en Cascada**: Usa `"dependsOn": ["dep1", "dep2"]` para que al iniciar un servicio, arranquen automáticamente sus dependencias (ej: Bases de Datos).
- **Tiles sin URL**: Si pones `"url": null`, el tile se convierte en un panel de control puro (ideal para Minecraft o DBs que no tienen web UI).
- **Estado en Tiempo Real**: El dashboard sincroniza el estado cada 30 segundos automáticamente.
- **Telemetría de Uptime**: Al pasar el ratón por el botón de parada, verás cuánto tiempo lleva el contenedor encendido (ej: `2h 15m`).
- **Sistema de Toasts**: Confirmaciones visuales instantáneas al arrancar o detener servicios.
- **Acciones de Grupo**: En el tema **Atalaya**, cada sección tiene botones maestros para "Iniciar Todo" o "Parar Todo" el grupo.

### 3. Scripts de Emergencia y Rutinas
En `config/scripts.json`, define comandos que quieres ejecutar desde la interfaz.
- **Seguridad**: Los comandos se ejecutan en el servidor. Asegúrate de configurar correctamente los permisos del usuario que corre el proceso Node.

### 4. Marcadores (Bookmarks)
Gestiona tus enlaces rápidos en `config/bookmarks.json`. Se organizan por categorías y aparecen en todos los layouts.

---

## 🎨 Personalización Extrema (RICE)

### Vía Web (Sin Código)
1. Pulsa el botón **[ CAMBIAR TEMA / AJUSTES ]** o pulsa `F10`.
2. **Título**: Cambia el nombre de tu servidor en tiempo real.
3. **Temas**: Cambia entre Atalaya, Glitch-Core, Quantum, Warcraft III, Cyberdeck, Bio-Hazard y Neon-Tokyo instantáneamente sin perder datos.
4. **Localización**: Todo está en **Español de España**, desde los logs de consola hasta las advertencias de brecha.

### Vía Código (Hardcore)
- **CSS Avanzado**: Cada layout tiene su propio bloque `<style>` en `src/lib/components/layouts/`. Usamos CSS puro para máximo rendimiento.
- **Svelte 5 Stores**: Los datos fluyen a través de `telemetry.svelte.ts`. Si añades una variable ahí, estará disponible para todos los temas reactivamente.
- **Lógica de Layouts**: Si quieres crear un tema nuevo, simplemente duplica uno existente en la carpeta de layouts y regístralo en `src/lib/components/editor/ThemeManager.svelte`.

---

## 🛰️ Los Temas y sus Datos Reales

- **👁️ Atalaya**: El ticker inferior muestra Uptime real, temperatura estimada y procesos. El radar lateral reacciona a la actividad de red.
- **☢️ Glitch-Core**: Los logs "hexadecimales" son en realidad hashes de tus servicios activos y estados de CPU. Si el servidor sufre carga, el "glitch" visual aumenta.
- **⚛️ Quantum**: El astrolabio central pulsa al ritmo de la carga de CPU. Los "nodos orbitales" son tus servicios reales.
- **🛡️ Warcraft III**: Tu servidor es un héroe. La Vida es la RAM libre, el Maná es el CPU disponible. La "población" es el conteo de servicios online.
- **📟 Cyberdeck**: La consola de boot muestra el proceso real de inicialización del dashboard y telemetría SSH.
- **⚠️ Bio-Hazard**: Las "celdas de contención" son tus servicios. Si uno cae, la celda entra en estado de BRECHA con sirenas y alertas rojas.
- **🌆 Neon-Tokyo**: El visualizador de señal del footer reacciona a los paquetes de red reales recibidos por el servidor.

### 5. Datos Personalizados y Easter Eggs
Edita el archivo `config/custom_metrics.json` para añadir tus propios datos a la API.
- **Mensajes**: El array `mensajes` aparecerá automáticamente en los tickers de texto de los temas (como en Atalaya).
- **Easter Eggs**: Puedes meter datos que aparecerán en paneles ocultos o áreas de "volcado de memoria" (Glitch-Core, Cyberdeck).
- **Extensibilidad**: Cualquier campo que añadas a este JSON estará disponible en el frontend a través de `telemetry.customData`.

---

## 🛠️ Desarrollo de Temas (Rice Avanzado)

Si quieres que tus datos personalizados salgan en un sitio específico:
1. Añade el dato a `config/custom_metrics.json`.
2. En el archivo del tema (ej: `AtalayaLayout.svelte`), usa `{telemetry.customData.tu_campo}`.
3. El dashboard se actualizará cada 2 segundos con tus nuevos datos.

---

## 🛠️ Sistema de Rutinas (Scripts)

VaroDashboard permite ejecutar comandos directamente desde la interfaz:
*   **Gestión Centralizada**: Configura tus scripts en `config/scripts.json`.
*   **Ejecución en Tiempo Real**: Ejecuta limpiezas de Docker, actualizaciones de sistema o búsquedas personalizadas con un solo clic.
*   **Feedback Visual**: Notificaciones dinámicas sobre el estado de la ejecución.

## 📡 Integración con APIs (Radarr / Sonarr)

Monitoriza tus servicios de media directamente en el header:
1.  Crea/Edita `config/api_keys.json`.
2.  Activa los servicios (`enabled: true`) y añade tu URL/Key.
3.  El Dashboard mostrará indicadores **NEÓN** (Verde/Rojo) sobre el estado de tus instancias.

## 📐 Motor de Escalado Global (Responsive 4K & Mobile)

VaroDashboard integra un **Motor de Escalado Dinámico** en `src/app.css` que garantiza que la interfaz se vea profesional en cualquier pantalla:

1.  **Tipografía Fluida**: Usamos `clamp()` para que el tamaño base de la fuente escale automáticamente entre **14px (móvil)** y **24px (4K)**.
2.  **Unidades Relativas**: Los layouts están construidos con `rem`, `vh/vw` y `vmin`, lo que permite que todos los paneles, márgenes y botones se ajusten proporcionalmente al tamaño de la pantalla.
3.  **Adaptación Automática**:
    *   **4K TV**: La interfaz aprovecha el espacio extra aumentando el espaciado y la densidad de datos sin perder legibilidad.
    *   **1080p Monitor**: La experiencia estándar, equilibrada y nítida.
    *   **Smartphone (Vertical)**: Los layouts detectan el ancho de pantalla y apilan las columnas de forma inteligente, ocultando elementos secundarios para priorizar el control de servicios.

---

## 🚀 Despliegue Rápido

```bash
# Instalación
npm install

# Modo Desarrollador (Rice & Juice)
npm run dev

# Producción
npm run build
node build
```

---

**CRÉDITOS & MANTRA:** Desarrollado con pasión por el RICE y la eficiencia. **VaroServer: Siempre Vigilante.**
