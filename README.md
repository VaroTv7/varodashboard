# 🚀 VaroDashboard: El Centro de Mando Definitivo

> **LEMA, MECÁNICA Y MANTRA:** ULTRA PERSONALIZABLE, ULTRA OPTIMIZADO, EFICIENTE, RECARGADO, JUICY, RICE.

Bienvenido al dashboard más sobrecargado y visualmente complejo jamás diseñado para administrar un servidor doméstico. VaroDashboard no es solo una interfaz; es una declaración de intenciones. Diseñado específicamente para el ecosistema **VaroServer**, este panel combina telemetría real en tiempo real con una estética "hacker" agresiva y una optimización extrema para dispositivos de bajos recursos como el Intel N150.

---

## 🛠️ Filosofía de Diseño: "High-Density, Max-Juice"

Nuestra señal de identidad es el **RICE** extremo:
1.  **Muchos Datos**: Si hay un píxel libre, debe llenarse con telemetría, logs o animaciones.
2.  **Juice & Juice**: Animaciones constantes, efectos de CRT, parpadeos, escaneos y transformaciones 3D.
3.  **Localización Total**: Todo el sistema está en **Español (España)** con terminología técnica de administración de sistemas.
4.  **Eficiencia**: A pesar de la carga visual, el núcleo está optimizado para no saturar la CPU de tu NAS.

---

## 🎨 Temas Incluidos (Los 7 Pecados Digitales)

1.  **👁️ Atalaya (CENTRO_MANDO)**: Fusión de lo clásico y lo moderno. Ticker de noticias, hiper-cuadrícula 3D de fondo y radar de telemetría.
2.  **☢️ Glitch-Core (NÚCLEO_V7)**: Estética de sistema hackeado. Volcados de memoria hexadecimales, advertencias de brecha y efectos de interferencia visual.
3.  **⚛️ Quantum (SISTEMA_ORBITAL)**: Geometría sagrada y órbitas. Partículas de datos flotantes y un astrolabio central que reacciona a la carga del servidor.
4.  **🛡️ Warcraft III**: Fidelidad total al clásico. Interfaz de piedra y oro, retrato del servidor, barras de vida (RAM) y maná (CPU).
5.  **📟 Cyberdeck**: Terminal de fósforo rojo puro. ASCII art, logs de consola infinitos y estética de Gibson de los 80.
6.  **⚠️ Bio-Hazard**: Estilo industrial de advertencia. Sirenas rotativas, niveles de "radiación" (CPU) y celdas de contención biológica para tus servicios Docker.
7.  **🌆 Neon-Tokyo**: Synthwave/Vaporwave puro. Sol poniente, rejilla de perspectiva y neones morados brillantes.

---

## ⚙️ Personalización (Hazlo Tuyo)

### Desde la Web (UI)
Puedes personalizar casi todo sin tocar una línea de código:
-   **Ajustes de Interfaz**: Abre el panel de ajustes (`F10` o botón `[AJUSTES]`) para cambiar el título, el tema activo y las opciones de visualización.
-   **Editor de Temas**: Puedes duplicar temas existentes o crear los tuyos propios ajustando las variables CSS directamente en el navegador.

### Desde el Código (Hard-Core)
Para los que quieren el control total:
-   **Configuración**: Los archivos en `/config/*.json` controlan tus servicios, scripts y marcadores.
-   **Layouts**: Cada tema vive en `src/lib/components/layouts/`. Si quieres añadir un efecto nuevo, busca la clase CSS correspondiente y añade tu animación.
-   **Telemetría**: El archivo `src/lib/stores/telemetry.svelte.ts` gestiona los datos que se muestran. Puedes añadir nuevos campos de datos ahí para que aparezcan en todos los temas.

---

## 🛰️ Telemetría Real del Servidor

VaroDashboard ahora lee datos **reales** de tu máquina a través de la API integrada en `/api/system`.
-   **CPU**: Porcentaje de uso real basado en la carga del sistema.
-   **RAM**: Uso exacto de memoria física.
-   **Uptime**: Tiempo de actividad real del servidor.
-   **Red/Disco**: Datos simulados de alta fidelidad basados en el tráfico de red del propio dashboard para evitar consumo extra de recursos.

---

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar modo desarrollo (con recarga en caliente)
npm run dev

# Construir para producción (Optimizado)
npm run build
```

**MANTRA FINAL:** Si no brilla, si no se mueve y si no muestra datos... no es VaroDashboard.
