# Handoff: Prode Dashboard (Inicio)

## Overview

Rediseño del dashboard **Inicio** de **Prode**, una app de pronósticos para el Mundial 2026. El dashboard es el punto de entrada después del login: muestra el próximo partido por predecir, el estado del usuario en su liga, los partidos del día, el ranking y el sistema de puntos.

Sistema visual: **"Floodlight"** — estética de gráfica de transmisión deportiva nocturna. Alta energía, tipografía display condensada, números como protagonistas, paleta midnight + lime neón.

## About the Design Files

Los archivos `.html` / `.jsx` incluidos en este bundle son **referencias de diseño construidas en HTML+React** — prototipos que muestran el look y comportamiento esperado, **NO son código de producción para copiar tal cual**.

La tarea es **recrear estos diseños en el entorno del codebase actual de Prode** (React/Next/Vue/lo que sea), usando los patrones y librerías ya establecidas en el proyecto. Si todavía no hay un stack definido, elegir el framework apropiado e implementar ahí.

El `app.jsx` que aparece acá usa el `DesignCanvas` solo para presentar las dos resoluciones lado a lado — en producción **NO** se usa; cada vista se renderiza directamente.

## Fidelity

**Alta fidelidad (hifi).** Colores, tipografía, spacing, radios y motion están definidos con valores finales. El developer debe reproducir el resultado pixel-perfect usando los componentes existentes del codebase. Las interacciones (predictor de marcador, save, ranking) están especificadas más abajo.

---

## Screens / Views

Dos viewports del mismo dashboard: **Desktop (1440)** y **Mobile (390)**. Comparten datos y componentes lógicos, layouts distintos.

### Desktop · 1440 × 1180

Layout vertical:

1. **Top Bar** (altura ≈ 78px)
2. **Hero Band** — saludo grande + tarjeta de posición (asimétrico 1fr / 480px)
3. **Ticker** — resultados scrolleando horizontalmente (altura ≈ 38px)
4. **Main Grid** — 1fr / 440px, gap 28px
   - Columna izquierda: Next Match · Today · Group Table
   - Columna derecha: Ranking · Points · Sin Predecir
5. **Footer Strip** — meta info, monospace

Padding lateral global: `40px`.

### Mobile · 390 × 1400

Stack vertical:

1. **Top Bar** (logo + bell + avatar)
2. **Hero** (saludo + tarjeta de posición compacta)
3. **Ticker**
4. **Next Match Card** (hero)
5. **Today** (4 partidos en cards)
6. **Mini Ranking** (top 3 + tu fila separadas por línea punteada)
7. **Sin Predecir banner**
8. **Points System mini**
9. **Bottom Nav** fija (5 ítems, altura ≈ 76px)

Padding lateral global: `20px`. Bottom padding: `88px` (espacio para nav fija).

---

## Components

### `TopBar` (desktop)
- Layout: flex space-between, padding `20px 40px`, border-bottom `1px solid rgba(255,255,255,0.08)`
- Izquierda: logo (38×38 con gradient lime→blue) + texto "PRODE" / "MUNDIAL · 2026"
- Centro: 5 nav items (`Inicio`, `Ranking`, `Predecir`, `Partidos`, `Grupos`). Active: lime underline 28×3px con glow `box-shadow: 0 0 12px #D4FF3F`
- Derecha: pill de liga + pill de usuario (con avatar 30×30 lime + nombre + @handle)
- Fonts: nav items `Geist 600 13px`

### `HeroBand` (desktop)
- Grid: `1fr 480px`, gap 40, align-items end, padding `44px 40px 32px`
- Eyebrow: mono 11px lime con letterSpacing `0.16em`, prefijado por una línea horizontal 28×1px lime
- H1: `Big Shoulders Display 900 132px / 0.86`, uppercase, `letter-spacing -0.005em`. "Maca." renderizado con `linear-gradient(120deg, #D4FF3F, #FFD23F)` clipeado al texto
- Subhead: `Geist 400 19px` color `rgba(244,245,255,0.62)`, max-width 620px

### `PositionTile`
- Background: `linear-gradient(160deg, rgba(212,255,63,0.10), rgba(59,91,255,0.05))`
- Border: `1px solid rgba(255,255,255,0.16)`, radius 22, padding `26px 30px`
- Strip superior: barra horizontal de 2px con gradient lime central
- Layout interno: número grande `06` (Big Shoulders 900 96px, color text) `/9` (Big Shoulders 700 32px, muted) | borderLeft + stats: PUNTOS, EXACTOS, A LÍDER
- Stat layout: label mono 10px + valor display/mono right-aligned, `justify-content: space-between`

### `Ticker`
- Border-top + border-bottom 1px en `rgba(255,255,255,0.08)`
- Background tint: `rgba(212,255,63,0.03)`
- Mask: `linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent)`
- Items duplicados 3× con `animation: ticker linear infinite` (velocidad 50px/s aprox)
- Cada item: live dot (si aplica) · minuto/FT · chip · código · score · código · chip — separados por `1px solid border`, padding-right 28
- En FT el score es lime (#D4FF3F); en LIVE es coral (#FF5C4D)

### `NextMatchCard` (desktop hero)
- Card con `glow: true` → `box-shadow: 0 0 0 1px rgba(212,255,63,0.1), 0 20px 60px -20px rgba(212,255,63,0.15)`
- Cabecera: pill "PRÓXIMO PARTIDO" (mono 10px lime, bg `rgba(212,255,63,0.10)`, border lime alpha 0.25, padding `5px 9px`) · fecha/sede mono 11 · "EMPIEZA EN 02D · 14H · 22M" mono 11 con números bold
- Body central: grid `1fr auto 1fr`, padding `44px 36px 36px`. Cada lado: `TeamPlate` (chip 88×88 + nombre Big Shoulders 800 38px uppercase + subtítulo "FIFA · grupo C" mono 11)
- Detrás: pitch graphic (radial + lineas verticales 80px sutiles, opacity 0.5)
- Bloque "VS": Big Shoulders 900 48px, color textMute
- Predictor: grid 1fr/1fr, gap 28
  - Izquierda: label mono "TU PRONÓSTICO" + dos `ScoreInput` separados por dash 56px
  - Derecha: barra de consenso (3 segmentos con %) + CTA `Guardar pronóstico →` (bg lime, color #0A0B1E, Big Shoulders 800 18px uppercase, radius 12, padding `16px 24px`). Estado saved/saved-anim: bg `rgba(212,255,63,0.15)`, border lime, color lime, texto "✓ ACTUALIZAR PRONÓSTICO" / "✓ GUARDADO"

### `ScoreInput`
- Container: bg `rgba(255,255,255,0.04)`, radius 18 (big) / 12 (small), padding `10px 14px`, border 1px
- Botones `−` / `+`: circulares 38px (big) / 28px (small), bg `rgba(255,255,255,0.06)`, border 1px, color lime, Big Shoulders 800
- Número: Big Shoulders 900 84px (big) / 52px (small), `font-variant-numeric: tabular-nums`, min-width 60/36, centered. **Anima `prodeBump` (scale 1.15→1, color lime→text, 200ms ease-out) en cada cambio.** Rango 0–9.

### `ConsensusBar`
- Tres segmentos horizontales separados por gap 2px, altura 10px, radius 5
- Colores: home → blue (`#3B5BFF`), empate → textMute, away → coral (`#FF5C4D`)
- Debajo: labels con porcentaje. Layout flex space-between

### `MatchRow` (today, desktop)
- Grid: `60px 1fr auto 1fr 88px`, gap 14, padding `12px 16px`, border-top `1px` (sin border-top en el primero)
- Hover: bg `rgba(255,255,255,0.025)`, transición 150ms
- Tiempo: mono 10px (LIVE: live dot + minuto + coral; FT: "FINAL"; otherwise hora)
- Equipos: nombres Big Shoulders 700 18px uppercase + chip 26
- Score box central: padding `4px 12px`, bg adaptativo (live coral alpha / FT lime alpha / otherwise white alpha), border, score Big Shoulders 900 22px
- Right: pill `2–1` lime si hay prediction, sino "PREDECIR →" mono 10px muted

### `RankRow`
- Grid horizontal: posición 28px · avatar 32 · nombre + sub stats · delta arrow 28 · puntos
- Si `isCurrent`: bg `rgba(212,255,63,0.10)`, border `1px solid rgba(212,255,63,0.35)`, radius 12
- Posición: Big Shoulders 800 22px. Top 3: dorado/plata/bronce (`#FFD23F`/`#D7DDE6`/`#C7935C`). Resto: textDim (o lime si current). Zero-padded ("01", "02"...)
- Avatar: círculo 32, bg con color asignado al jugador, iniciales Big Shoulders 800 13 color #0A0B1E
- Badge "VOS" (cuando isYou): mono 9 bold #0A0B1E sobre bg lime, padding `2px 6px`, radius 4
- Sub-stats: "N exactos" + 🔥 con streak (gold). Mono 10
- Delta arrow: ▲ verde (subió) / ▼ coral (bajó) / — muted. Number debajo
- Puntos: Big Shoulders 800 28px + sufijo "PTS" 11px muted

### `GroupTable`
- Header de columnas: `30px 1fr repeat(5, 36px) 50px` con labels mono 10 (PJ, G, E, P, ±, PTS)
- Filas mismo grid. Top 2 con `border-left: 2px solid lime` (los que clasifican)
- Posición y PTS de los top-2 en color lime
- Switcher de grupo: 6 botones 28×28 (A-F) — el activo con bg `rgba(212,255,63,0.15)` y borde lime alpha

### `SinPredecirCard`
- Estilo "alerta": bg `linear-gradient(135deg, rgba(255,92,77,0.12), rgba(255,92,77,0.04))`, border coral alpha 0.30
- Layout: número gigante Big Shoulders 900 84px coral con `<CountUp>` + texto "Sin predecir" + descripción
- CTA: outline coral "Predecir en lote →" Big Shoulders 800 14 uppercase

### `PointsCard`
- Lista de 4 reglas. Cada fila: bg `rgba(255,255,255,0.025)`, border, radius 10, padding `10px 14px`, label izquierda + valor Big Shoulders 800 18 lime derecha
- Última regla (`accent: true`): bg `rgba(255,210,63,0.08)`, border gold alpha, valor en gold (`#FFD23F`)
- Footer: tip "Máx 6 PTS por partido · Empate exacto 8 PTS" mono 11

### `TeamChip` (flag-ish abstract block)
- **NO usar flags reales/escudos**. Bloque cuadrado dividido diagonal con dos colores asignados arbitrariamente al equipo, con el código de 3 letras superpuesto en Big Shoulders 900
- Size por defecto 36, radius 8. Variantes: 18 (small), 22 (mini), 26 (medium), 88 (hero)
- `clipPath` para la diagonal: `polygon(100% 0, 100% 100%, 0 100%)`
- Color del texto: si el color2 es claro (`#F4F5FF` o `#FFD23F`) → texto `#0A0B1E`; sino → `#F4F5FF` con sombra

### Mobile-specific

- **MobileTopBar**: padding `16px 20px`, logo 32×32, avatar 36×36, botón bell (36×36 con borde sutil)
- **MobileHero**: H1 Big Shoulders 60px (vs 132 en desktop). PositionTile en grid `auto 1fr`, número 68px
- **MobileNextMatch**: misma estructura pero `TeamPlate size="sm"` (chip 56, nombre 24px), VS 28px, scoreInput `big={false}`
- **MobileMatchRow**: card individual (no row borderless). Padding 12/14, radius 12, grid `1fr auto`. Pill de predicción derecha (56px min-width)
- **MobileBottomNav**: position absolute bottom, bg `rgba(10,11,30,0.92)` con `backdrop-filter: blur(20px)`, border-top, padding `10px 8px 18px`, grid `repeat(5, 1fr)`. Item activo: color lime + drop-shadow en el icono + barra superior 28×2 con glow
- **MobileMiniRanking**: top 3 + separador punteado horizontal + tu fila resaltada

---

## Interactions & Behavior

### Predictor de marcador
- Click en `+` o `−` modifica el valor (clamp 0–9). Trigger `setPrediction(match, { hg, ag })`
- Cada cambio anima el número (`prodeBump`): scale 1.15→1 + color flash lime→text en 200ms
- Mientras no se guarda, el valor vive en `state.predictions[key]`
- El botón "Guardar pronóstico" hace `savePrediction(match, pred)`:
  - Mueve la predicción a `state.savedPredictions[key]`
  - Decrementa `state.remaining` (Sin predecir) si era nueva
  - Incrementa `state.predicted`
  - El botón cambia a "✓ GUARDADO" durante 1.6s, después "✓ ACTUALIZAR PRONÓSTICO"

### Click en MatchRow
- Cualquier partido de "Hoy" abre el predictor inline (en este prototipo simplifica a guardar `1-0` por demo). En producción, abrir modal o expandir fila con su propio ScoreInput.

### Ticker
- Loop infinito horizontal vía CSS keyframe `prodeTicker` (translateX 0 → -33.333%)
- Velocidad: `totalWidth / speed` segundos donde speed ≈ 50px/s (desktop) y 40 (mobile)
- Items duplicados 3 veces para loop sin saltos

### Count-ups
- Cualquier número con `<CountUp to={n} dur={900} />` anima desde 0 a `n` con easing cubic-out
- Usado en: PositionTile (posición, puntos, exactos), SinPredecir (count), MobileHero

### Live dot
- `<LiveDot>` aplica `animation: prodePulse 1.4s infinite` — box-shadow pulsante coral. Tamaño default 8

### Hover
- MatchRow: bg `rgba(255,255,255,0.025)`
- Botones de nav y user pill: no hover state explícito (mantener cursor pointer)

### Estados del partido
- `FT` (final): score en lime
- `LIVE`: live dot + minuto coral, score en coral con border coral alpha
- `NEXT`: solo hora, score "— · —"

---

## State Management

Estado raíz vive en el componente App (en producción, mover a un store/context). Shape:

```ts
type State = {
  // user info
  name: string;
  initials: string;
  league: string;
  totalMatches: number;
  predicted: number;
  remaining: number;       // # de partidos sin pronosticar
  points: number;
  position: number;        // posición actual en liga
  totalPlayers: number;
  pointsToNext: number;
  pointsToLeader: number;
  exact: number;

  // local prediction draft (no guardado todavía)
  predictions: Record<string, { hg: number; ag: number }>;
  // pronósticos guardados (sincronizados con backend)
  savedPredictions: Record<string, { hg: number; ag: number }>;
};
```

Key del prediction: `${homeCode}-${awayCode}`.

Acciones:
- `setPrediction(match, pred)` — actualiza draft, no persiste
- `savePrediction(match, pred)` — persiste, decrementa `remaining`

En producción:
- `savePrediction` debería hacer PUT/POST al backend y actualizar el estado optimísticamente
- `predictions` puede no ser necesario; algunos diseños solo persisten al guardar explícitamente
- El ranking, fixture y standings de grupos deberían venir del backend

---

## Design Tokens

### Colors

| Token            | Hex                          | Uso                                                 |
|------------------|------------------------------|-----------------------------------------------------|
| `bg`             | `#0A0B1E`                    | Background global (midnight)                        |
| `surface`        | `#14172E`                    | Cards                                               |
| `surface2`       | `#1C2042`                    | Card alt / inputs hover                             |
| `surface3`       | `#252A52`                    | Hover                                               |
| `border`         | `rgba(255,255,255,0.08)`     | Borders sutiles                                     |
| `borderStrong`   | `rgba(255,255,255,0.16)`     | Borders en hero/tiles                               |
| `text`           | `#F4F5FF`                    | Texto principal                                     |
| `textDim`        | `rgba(244,245,255,0.62)`     | Texto secundario                                    |
| `textMute`       | `rgba(244,245,255,0.38)`     | Labels/mono                                         |
| `lime` (primary) | `#D4FF3F`                    | Accent primario, CTAs, scores FT, current user      |
| `limeDeep`       | `#9BC10F`                    | Hover/pressed lime                                  |
| `blue`           | `#3B5BFF`                    | Acento secundario (logo, consensus home)            |
| `coral`          | `#FF5C4D`                    | Live, alertas, sin-predecir                         |
| `gold`           | `#FFD23F`                    | 1º puesto, exactos, streak, accent en saludo        |
| `green`          | `#00C46B`                    | Delta arrow ▲                                       |

### Typography

| Familia                  | Pesos       | Uso                                          |
|--------------------------|-------------|----------------------------------------------|
| `Big Shoulders Display`  | 700/800/900 | Display, números, headers, scores            |
| `Geist`                  | 400/500/600/700 | UI, body, names                          |
| `JetBrains Mono`         | 500/600/700 | Stats, eyebrows, labels, ticker, metadata    |

Scale clave (desktop):
- Hero H1: 132px / line-height 0.86 / letter-spacing -0.005em uppercase
- Card title: 26px / 0.95 / 0.01em uppercase
- Score (next match): número 84px
- Score (match row): 22px
- Body: 19px / 1.5
- Eyebrow mono: 10-11px, letter-spacing 0.12–0.16em uppercase

Mobile reduce H1 a 60px y cards titles a 24px.

### Spacing

Padding interno de cards: 22px (con `padded=true`).
Gap entre cards (main grid): 28px.
Padding outer desktop: 40px. Mobile: 20px.

### Radius

| Token | Valor | Uso |
|-------|-------|-----|
| Sm    | 8     | Chips de equipo (default) |
| Md    | 12    | Buttons, score input small |
| Lg    | 14    | Cards mobile, avatars |
| Xl    | 18    | Cards desktop, score input big |
| Xxl   | 22    | Hero position tile |
| Full  | 999   | Pills |

### Shadows / Glow

- Card glow (next match): `0 0 0 1px rgba(212,255,63,0.1), 0 20px 60px -20px rgba(212,255,63,0.15)`
- Nav active underline glow: `0 0 12px #D4FF3F`
- Live dot pulse: keyframe `prodePulse` (rgba(255,92,77,*) ring)
- Bottom nav active icon: `drop-shadow(0 0 8px #D4FF3F)`

### Motion

| Keyframe       | Duración | Uso                              |
|----------------|----------|----------------------------------|
| `prodePulse`   | 1.4s ∞   | Live dot                         |
| `prodeBump`    | 200ms    | Score change                     |
| `prodeTicker`  | ~10–15s ∞ | Resultados scrolling            |
| `prodeFadeUp`  | 300ms    | Entrada de elementos (opcional)  |
| `prodeSlideIn` | 300ms    | Modales / nuevos items           |

CountUp easing: cubic-out (`1 - (1-p)³`), 900ms default.

---

## Assets

**No hay imágenes ni íconos externos.** Todo el diseño se renderiza con HTML + CSS:
- "Banderas" de equipos son `TeamChip` (cuadrado bicolor con diagonal + código de 3 letras)
- Íconos de bottom nav son **placeholders Unicode** (`⌂ ♛ ⊕ ▦ ◧`). **En producción reemplazar por íconos reales** del icon set del codebase (Lucide, Phosphor, Heroicons, etc.)
- Logo "Prode": gradient lime→blue con letra "P" centrada (mantener o reemplazar por logo real)
- Bell icon en mobile top bar es emoji 🔔 — **reemplazar por ícono del sistema**

Fuentes vía Google Fonts:
```
https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap
```

---

## Files

Los archivos siguientes representan el diseño completo:

- `Prode Dashboard.html` — entry point (HTML + scripts)
- `app.jsx` — root component, manejo de estado, montaje del canvas (sólo para preview de las dos resoluciones)
- `ui.jsx` — primitivos UI compartidos: `TeamChip`, `TeamPlate`, `ScoreInput`, `Ticker`, `RankRow`, `MatchRow`, `Card`, `CardHeader`, `CountUp`, `LiveDot`, tokens (`C`, `DISPLAY`, `UI`, `MONO`), keyframes
- `dashboard-desktop.jsx` — layout desktop 1440 con todos los componentes (`TopBar`, `HeroBand`, `PositionTile`, `NextMatchCard`, `TodayCard`, `GroupTable`, `RankingCard`, `PointsCard`, `SinPredecirCard`, `FooterStrip`)
- `dashboard-mobile.jsx` — layout mobile 390 (`MobileTopBar`, `MobileHero`, `MobileNextMatch`, `MobileToday`, `MobileMiniRanking`, `MobileSinPredecir`, `MobilePointsMini`, `MobileBottomNav`)
- `data.jsx` — mock data (48 equipos, 12 grupos, fixture, ranking, user state, scoring)
- `design-canvas.jsx` / `tweaks-panel.jsx` — solo wrappers de preview, ignorar en producción

### Recomendación para Claude Code

1. Empezar por leer `ui.jsx` para entender los primitivos y los tokens del sistema "Floodlight".
2. Crear el equivalente en el codebase (componentes React/Vue/etc + estilos en el sistema usado: CSS-in-JS, Tailwind, CSS Modules, lo que sea).
3. Implementar el layout desktop primero (`dashboard-desktop.jsx`) siguiendo el orden de secciones del README.
4. Implementar mobile (`dashboard-mobile.jsx`) — mismos primitivos, distinto layout.
5. Cablear estado real al backend (los `state.predictions`, ranking, fixture, etc).
6. Reemplazar placeholders: íconos del bottom nav, logo si existe versión oficial, eventualmente fotos de jugadores en los avatares.
7. **No copiar el `DesignCanvas`** — esa parte solo existe para presentar ambas resoluciones lado a lado.
