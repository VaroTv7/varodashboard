# 🚀 VaroDashboard: El Centro de Mando Definitivo para VaroServer

> **MANTRA Y FILOSOFÍA:** ULTRA PERSONALIZABLE, ULTRA OPTIMIZADO, EFICIENTE, RECARGADO, JUICY, RICE.
> "Si no brilla, si no se mueve y si no muestra datos... no es VaroDashboard."

VaroDashboard no es solo una interfaz de usuario; es una **suite de administración de alto rendimiento** diseñada para el Intel N150. Combina telemetría real de hardware de alta precisión con una estética agresiva, densa y orientada al "RICE" (Customización Visual Extrema).

### ⚡ Novedades Técnicas v7.4.7 (UI/UX Profesional y Estabilidad)
- **Corrección Definitiva del Ancho de Cuadrícula**: Se ha ampliado el espacio mínimo en todos los temas (`minmax(260px, 1fr)`) para garantizar que la información de Uptime y controles de Docker quepan a la perfección sin aplastar los nombres de los servicios.
- **Alineación Visual Premium**: El indicador de estado (punto rojo/verde) ahora está anclado a la parte superior izquierda, asegurando una estética profesional incluso cuando los nombres o descripciones saltan a múltiples líneas.
- **Controles de Docker Resilientes**: Los botones de inicio y parada ya no desaparecen si la API devuelve un estado `unknown` o de error; en su lugar, muestran un botón de arranque (▶) seguro por defecto.
- **Descripciones Siempre Visibles**: Eliminada la restricción de 2 líneas (`line-clamp`). Todas las descripciones se renderizan enteras para no perder información crítica.
- **Mapeo Directo de Puertos**: Actualizado el `docker-compose.yml` para exponer directamente el puerto SSR nativo (`3000:3000`), simplificando la configuración de Nginx Proxy Manager.

### ⚡ Novedades Técnicas v7.4.1
- **Seguridad de Grado Producción**: Las API keys de Radarr/Sonarr ya no viajan en la URL. Se ha implementado autenticación vía headers (`X-Api-Key`).
- **Git Hygiene**: Los archivos de configuración con secretos (`api_keys.json`, etc.) están ahora en el `.gitignore`. Se proporcionan archivos `.example.json`.
- **Refresco Manual**: Nuevo botón de refresco en el header para forzar la actualización de estados sin esperar al polling.
- **Svelte 5 Clean Architecture**: Eliminados los patrones problemáticos de `{@const}` fuera de bloques, moviendo toda la lógica derivada a runes `$derived` en el script tag.
- **Precisión Total**: Eliminadas las últimas trazas de datos aleatorios en el tema Cyberdeck. Ahora todas las métricas en todos los temas son 100% reales.

---

## 🛠️ Cómo Conectar TODO (Guía de Conectividad)

El dashboard está diseñado para ser el nodo central de tu servidor. Aquí tienes cómo conectarlo a tu infraestructura real:

### 1. Telemetría de Hardware (CPU, RAM, Disco)
El backend utiliza Node.js `os` y `fs` para leer directamente del sistema operativo.
- **Configuración Automática**: El dashboard detectará tu CPU, memoria y discos automáticamente.
- **Precisión de Red**: Lectura directa de `/proc/net/dev` (Linux) o interfaces de red para calcular MB/s reales en tiempo real.
- **Conteo de Procesos**: Reporta el número exacto de procesos activos en el sistema operativo.

### 2. Servicios y Aplicaciones (Docker/Web)
Edita el archivo `config/services.json` para añadir tus servicios (Jellyfin, Plex, *arr, etc.).
- **Detección de Estado**: El dashboard realiza un "ping" HTTP a cada servicio para mostrar si está online.
- **Iconos**: Usa emojis o iconos de Lucide. La propiedad `icon` en el JSON controla esto.

### 2b. Control de Contenedores Docker (Avanzado Pro)
VaroDashboard es ahora una suite completa de control de infraestructura con lógica inteligente:
- **Acceso Directo**: Requiere el socket de Docker (`/var/run/docker.sock`) con permisos `:rw`.
- **Botones Dinámicos**: Si configuras `containerName` en `services.json`, el tile mostrará controles ▶/⏹.
- **Arranque Secuencial Inteligente**: Usa `"dependsOn": ["dep1", "dep2"]`. El dashboard arrancará las dependencias primero, esperará **3 segundos** para su inicialización, y luego arrancará el contenedor principal.
- **Indicadores de Crash (Exit Codes)**: Si un contenedor se detiene con un error (`exitCode != 0`), aparecerá un indicador **🟡 parpadeante**. Útil para detectar fallos sin mirar logs.
- **Tiles sin URL**: Si pones `"url": null`, el tile se convierte en un panel de control puro (ideal para Minecraft o DBs).
- **Acciones de Grupo Globales**: Todos los temas incluyen botones maestros para "Iniciar Todo" o "Parar Todo" los servicios del grupo.

### 3. Scripts de Emergencia y Rutinas
En `config/scripts.json`, define comandos que quieres ejecutar desde la interfaz.
- **Seguridad**: Los comandos se ejecutan en el servidor. Asegúrate de configurar correctamente los permisos.

### 4. Marcadores (Bookmarks)
Gestiona tus enlaces rápidos en `config/bookmarks.json`.

---

## 🎨 Personalización Extrema (RICE)

### Vía Web (Sin Código)
1. Pulsa el botón **[ CAMBIAR TEMA / AJUSTES ]** o pulsa `F10`.
2. **Temas**: Cambia entre Atalaya, Glitch-Core, Quantum, Warcraft III, Cyberdeck, Bio-Hazard y Neon-Tokyo instantáneamente.
3. **Localización**: Todo está en **Español de España**.

---

## 🛰️ Los Temas y sus Datos Reales

- **👁️ Atalaya**: Radar lateral reacciona a la actividad de red real. Ticker con telemetría de precisión.
- **☢️ Glitch-Core**: Hashes reales de servicios y estados de carga. El glitch visual es proporcional a la carga de CPU.
- **⚛️ Quantum**: Astrolabio central pulsante con carga de CPU. Nodos orbitales reactivos.
- **🛡️ Warcraft III**: Vida (RAM libre) y Maná (CPU libre). Población (Servicios Online).
- **📟 Cyberdeck**: Consola de boot con telemetría real del sistema y estado de red.
- **⚠️ Bio-Hazard**: Alerta de RADIACIÓN (CPU) y celdas de contención con estados reales.
- **🌆 Neon-Tokyo**: Visualizador de señal en el footer mapeado al tráfico de red real.

---

## 📡 Integración con APIs (Radarr / Sonarr)

Monitoriza tus servicios de media directamente en el header:
1.  Crea `config/api_keys.json` basándote en `api_keys.example.json`.
2.  Añade tus URLs y Keys. La comunicación es segura vía headers HTTP.
3.  El Dashboard mostrará indicadores **NEÓN** (Verde/Rojo) sobre el estado de tus instancias.

## 📐 Motor de Escalado Global (Responsive 4K & Mobile)

VaroDashboard integra un **Motor de Escalado Dinámico** que garantiza una visualización profesional:
1.  **Tipografía Fluida**: `clamp()` para escalado automático entre móvil y 4K.
2.  **Unidades Relativas**: `rem`, `vh/vw` y `vmin` para proporciones perfectas.
3.  **Adaptación Inteligente**: Layouts optimizados para Smartphone, 1080p y TVs 4K.

---

## 🚀 Despliegue Rápido

```bash
# Instalación
npm install

# Configuración (IMPORTANTE)
cp config/api_keys.example.json config/api_keys.json
# Edita tus servicios, marcadores y scripts en la carpeta config/

# Modo Desarrollador
npm run dev

# Producción
npm run build
node build
```

---

**CRÉDITOS & MANTRA:** Desarrollado con pasión por el RICE y la eficiencia. **VaroServer: Siempre Vigilante.**
