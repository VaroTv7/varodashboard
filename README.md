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
