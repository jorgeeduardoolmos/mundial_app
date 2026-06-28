# Handoff: Prode Dashboard (Inicio) — refresh con sistema de temas

## Overview

Rediseño del dashboard **Inicio** de **Prode**, app de pronósticos para el Mundial 2026. Es la pantalla de entrada post-login: muestra el próximo partido a predecir, la posición del usuario en su liga, los partidos del día, el ranking y el sistema de puntos.

Sistema visual: **"Floodlight"** — estética de gráfica de transmisión deportiva, tipografía display condensada, números protagonistas. **El default actual es el tema claro "Arena"** (beige papel + verde pasto).

> **Estado de esta entrega**: hay 5 temas intercambiables. Sin carrousel de resultados (se quitó por ruido visual).

## About the Design Files

Los archivos `.html` / `.jsx` de este bundle son **referencias de diseño construidas en HTML+React** — prototipos del look y comportamiento esperado, **NO código de producción para copiar literal**.

La tarea es **recrear el diseño en el codebase actual de Prode** usando sus patrones y librerías. El `DesignCanvas` que envuelve todo es **solo para presentar desktop+mobile lado a lado** — en producción no se usa.

## Fidelity

**Alta fidelidad (hifi).** Colores, tipografía, spacing, radios, motion e interacciones están definidos con valores finales.

---

## Sistema de TEMAS (lo central de este refresh)

Todo el color sale de un objeto de tokens `C` (definido en `ui.jsx`). El componente raíz (`app.jsx`) sobreescribe esos tokens en runtime según el tema elegido vía `applyTheme(key)`. **En producción esto debería ser CSS custom properties** (`--color-bg`, `--color-surface`, etc.) o el theming nativo del codebase, no mutación de un objeto JS.

5 temas (cada uno reescribe TODOS los tokens, no solo el acento):

| key          | Nombre      | Base                  | Acento       | Modo   |
|--------------|-------------|-----------------------|--------------|--------|
| `arena`      | Arena       | beige `#E9E0CD`       | verde `#4E8C28` | CLARO · **default** |
| `eclipse`    | Eclipse     | carbón `#0C0D10`      | lima `#C6F432`  | oscuro |
| `floodlight` | Floodlight  | midnight `#0A0B1E`    | lima `#D4FF3F`  | oscuro |
| `violeta`    | Violeta     | índigo `#100A22`      | coral `#FF7A4D` | oscuro |
| `marea`      | Marea       | teal `#06141A`        | cyan `#43E0D0`  | oscuro |

### Tokens por tema

Cada tema define: `bg, surface, surface2, surface3, border, borderStrong, text, textDim, textMute, lime (=accent primario), limeDeep, blue, coral, gold, green, onAccent`.

> **`onAccent` es clave para el tema claro**: es el color del texto que va ENCIMA del color de acento (badges "VOS", botón "Guardar", avatares). En temas oscuros es `#0A0B1E`; en Arena es crema `#F7F1E1`. Sin esto, el texto negro sobre verde quedaba ilegible.

#### Tema Arena (claro) — valores exactos
```
bg: #E9E0CD   surface: #F6F0E0   surface2: #EFE7D3   surface3: #E3D8BF
border: rgba(60,48,26,0.14)      borderStrong: rgba(60,48,26,0.26)
text: #2C2517   textDim: rgba(44,37,23,0.66)   textMute: rgba(44,37,23,0.46)
lime(accent): #4E8C28   limeDeep: #356A18   blue: #2E5BBE
coral: #D24B36   gold: #B9821A   green: #3E7D3A   onAccent: #F7F1E1
```

#### Tema Eclipse (oscuro, el otro recomendado)
```
bg: #0C0D10   surface: #16181C   surface2: #1E2126   surface3: #2A2E34
border: rgba(255,255,255,0.07)   borderStrong: rgba(255,255,255,0.15)
text: #F6F7F4   textDim: rgba(246,247,244,0.6)   textMute: rgba(246,247,244,0.36)
lime(accent): #C6F432   limeDeep: #8FB814   blue: #6B8CFF
coral: #FF6A4D   gold: #FFCB45   green: #36D17A   onAccent: #0A0B1E
```

(Los otros 3 temas están completos en `app.jsx` → objeto `THEMES`.)

> **Nota de naming**: el token de acento se llama `lime` por razones históricas (el diseño nació lima). En Arena `lime = #4E8C28` (verde). Al portar, renombralo a `accent` / `--color-accent` para que no confunda.

---

## Screens / Views

Dos viewports del mismo dashboard: **Desktop (1440 ancho)** y **Mobile (390)**. Comparten datos y primitivos, layouts distintos.

### Desktop · 1440 × 1180
Stack vertical, padding lateral `40px`:
1. **TopBar** (~78px) — logo + nav (Inicio·Ranking·Predecir·Partidos·Grupos) + pills de liga/usuario
2. **HeroBand** — grid `1fr / 480px`: saludo gigante + `PositionTile`
3. **MainGrid** — grid `1fr / 440px`, gap 28
   - Izquierda: `NextMatchCard` · `TodayCard` · `GroupTable`
   - Derecha: `RankingCard` · `PointsCard` · `SinPredecirCard`
4. **FooterStrip** — meta mono

### Mobile · 390 × 1400
Stack, padding lateral `20px`, bottom padding `88px` (nav fija):
TopBar · Hero · NextMatch · Today (4 cards) · MiniRanking (top3 + tu fila) · SinPredecir · PointsMini · **BottomNav fija** (5 íconos)

> El **carrousel/ticker de resultados fue removido** de ambos viewports. (Si lo querés de vuelta, el componente `Ticker` sigue en `ui.jsx`, solo no se monta.)

---

## Components (props y detalles)

Todos viven en `ui.jsx` salvo los específicos de layout (en `dashboard-*.jsx`).

### `PositionTile` / Hero
- Número de posición Big Shoulders 900 96px (desktop) / 68px (mobile), `/N` muted
- Stats: PUNTOS (accent), EXACTOS, A LÍDER
- H1 saludo: 132px desktop / 60px mobile, "Maca." con `linear-gradient(120deg, accent, gold)` clipeado
- Tile bg: `linear-gradient(160deg, accent@10%, blue@5%)`, strip superior 2px gradient accent

### `NextMatchCard`
- Glow shadow. Cabecera con pill "PRÓXIMO PARTIDO" + fecha + countdown
- Body `1fr auto 1fr`: dos `TeamPlate` (chip 88 + nombre 38px uppercase) + "VS" 48px
- Predictor: 2× `ScoreInput` + `ConsensusBar` + CTA "Guardar pronóstico"
- CTA: bg `accent`, color `onAccent`. Guardado: bg `accent@15%`, border+texto accent

### `ScoreInput`
- Botones `−`/`+` circulares (38/28px), número Big Shoulders 900 84px (big) / 52px
- Rango 0–9. Anima `prodeBump` (scale 1.15→1, 200ms) en cada cambio.
  **El keyframe es transform-only** — el color lo pone el inline style (`C.text`) para respetar el tema. No metas `color` en el keyframe.

### `RankRow`
- Posición zero-padded (Big Shoulders 800 22px; top3 oro/plata/bronce)
- Avatar círculo 32 con color del jugador, iniciales color `onAccent`
- Badge "VOS" (mono 9, bg accent, color `onAccent`)
- Delta ▲ verde / ▼ coral / —, puntos Big Shoulders 800 28px + "PTS"
- Current user: bg `accent@10%`, border `accent@35%`

### `GroupTable`
- Header columnas mono (PJ G E P ± PTS), top-2 con `border-left: 2px accent` y valores en accent
- Switcher de grupo A–F (botones 28×28)

### `MatchRow` / `MobileMatchRow`
- Estados: FT (score en accent), LIVE (live dot + minuto coral), NEXT (hora, "— · —")
- Right: pill `2–1` accent si hay pronóstico, sino "PREDECIR →"

### `SinPredecirCard`
- Número gigante coral 84px (con `CountUp`) + CTA outline coral

### `TeamChip` (banderas abstractas)
- **NO escudos reales.** Cuadrado bicolor diagonal (`clipPath: polygon(100% 0,100% 100%,0 100%)`) + código 3 letras Big Shoulders
- Texto: si color2 es claro → `#0A0B1E`, sino → `#F4F5FF` con sombra
- Sizes: 18/22/26/36/88
- **En producción**: reemplazar por banderas reales (los datos de las capturas ya las tenían).

### `CountUp`, `LiveDot`
- CountUp: 0→N, easing cubic-out, 900ms. LiveDot: `prodePulse` ring coral 1.4s ∞.

### Mobile `BottomNav`
- Fija, bg `rgba(10,11,30,0.92)` + blur. **Íconos son placeholders Unicode** (`⌂ ♛ ⊕ ▦ ◧`) → reemplazar por icon set real.
  Nota: ese bg oscuro está hardcodeado; en tema claro conviene derivarlo de `surface` con alpha.

---

## Interactions & Behavior

- **Predictor**: `+`/`−` (clamp 0–9) → `setPrediction`. Animación bump por cambio.
- **Guardar**: `savePrediction(match, pred)` → mueve a `savedPredictions`, decrementa `remaining`, incrementa `predicted`. Botón "✓ GUARDADO" 1.6s → "✓ ACTUALIZAR".
- **Click en MatchRow** (Hoy): abre predictor (en el proto guarda `1-0` demo; en prod abrir modal o expandir fila).
- **CountUps** en posición/puntos/exactos/sin-predecir.
- **Tweaks**: panel con selector de tema (5) + toggle glow ambiente. En prod, el selector de tema podría ser un setting real de usuario.

---

## State Management

```ts
type Pred = { hg: number; ag: number };
type State = {
  // user/liga
  name, initials, league: string;
  totalMatches, predicted, remaining, points, position,
  totalPlayers, pointsToNext, pointsToLeader, exact: number;
  // draft local (no guardado)
  predictions: Record<string, Pred>;       // key: `${homeCode}-${awayCode}`
  savedPredictions: Record<string, Pred>;  // sincronizado con backend
};
```
- `setPrediction(match, pred)` — draft, no persiste
- `savePrediction(match, pred)` — persiste (en prod: POST/PUT optimista)
- Ranking, fixture y standings deberían venir del backend.

---

## Design Tokens (estructura)

- **Color**: ver sección TEMAS. Todo deriva de los 16 tokens por tema. Portar a CSS vars / theme nativo.
- **Tipografía**:
  - `Big Shoulders Display` (700/800/900) — display, números, headers, scores
  - `Geist` (400/500/600/700) — UI, body, nombres
  - `JetBrains Mono` (500/600/700) — stats, eyebrows, labels, metadata
  - Google Fonts import en el `<head>` del HTML.
- **Radius**: 8 (chips) · 12 (botones) · 14 (cards mobile) · 18 (cards desktop) · 22 (hero tile) · 999 (pills)
- **Spacing**: padding card 22 · gap grid 28 · outer desktop 40 / mobile 20
- **Motion**: `prodePulse` (live, 1.4s∞) · `prodeBump` (score, 200ms, transform-only) · CountUp cubic-out 900ms
- **Glow**: card next-match `0 0 0 1px accent@10%, 0 20px 60px -20px accent@15%` · nav active underline `0 0 12px accent`

---

## Assets

**Sin imágenes externas.** Banderas = `TeamChip` (CSS). Íconos de nav = placeholders Unicode → **reemplazar**. Logo = gradient + "P" → reemplazar por logo real si existe. Fuentes vía Google Fonts.

---

## Files

- `Prode Dashboard.html` — entry (HTML + script tags + Google Fonts)
- `app.jsx` — root, estado, **objeto `THEMES` + `applyTheme()`**, panel de Tweaks, montaje del canvas (solo preview)
- `ui.jsx` — primitivos + tokens `C` + keyframes. **Empezar por acá.**
- `dashboard-desktop.jsx` — layout 1440
- `dashboard-mobile.jsx` — layout 390
- `data.jsx` — mock (48 equipos, 12 grupos, fixture, ranking, user, scoring)
- `design-canvas.jsx` / `tweaks-panel.jsx` — wrappers de preview, **ignorar en producción**

### Pasos sugeridos para Claude Code
1. Leer `ui.jsx` (tokens + primitivos) y el objeto `THEMES` de `app.jsx`.
2. Crear el sistema de color como **CSS custom properties** (un `:root` + un `[data-theme="..."]` por tema). Renombrar `lime`→`accent`. Incluir `onAccent`.
3. Portar primitivos (`TeamChip`, `ScoreInput`, `RankRow`, `Card`, etc.) a componentes del stack.
4. Armar desktop, luego mobile.
5. Cablear estado real (predictions, ranking, fixture) al backend.
6. Reemplazar placeholders: íconos de nav, banderas reales, logo.
7. **No** portar el `DesignCanvas`. El ticker está intencionalmente fuera.
8. Default de tema = `arena` (claro). Dejar los otros 4 como opción.
