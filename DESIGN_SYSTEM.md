# El Guayasense — Sistema de Diseño

Periódico impreso. Papel crema, tinta negra, rojo de titular, serif, reglas
horizontales y **cero esquinas redondeadas**.

Comparte con [`../web`](../web/DESIGN_SYSTEM.md) el stack, los nombres de los
tokens y el easing de marca. Las primitivas de entrada (`Reveal`, `Eyebrow`) NO
existen aquí: se borraron con `ScrollMotion`, porque una plana compuesta se lee
quieta. Todo lo demás es opuesto a propósito: son dos diarios distintos que
comparten redacción, no dos temas del mismo sitio.

---

## 1. Las dos decisiones que hacen el look

Si solo te llevas dos cosas de este documento:

1. **El titular va en serif.** Es lo que separa un diario de un blog.
2. **El radio es 0 en todo.** Una esquina redondeada aquí rompe la ilusión de
   papel más que ningún color. `--radius: 0px`, y no hay excepciones: ni los
   botones, ni las viñetas, ni el anillo de foco.

| Decisión | Valor | Por qué |
|---|---|---|
| Superficie | Papel crema `#FAF7F0` | Nunca blanco puro: el blanco es una pantalla, el crema es papel |
| Tinta | `#1A1A1A` | Negro de imprenta, no `#000` |
| Acento | Rojo `#C0392B` | Oscuro por necesidad: un rojo brillante sobre crema vibra y cansa a las dos líneas |
| Titular | Georgia y su cascada serif | Está en cualquier máquina; **no se carga ninguna serif por red** — un diario pinta el titular en el primer frame, no cuando llega una fuente de un CDN |
| Cuerpo | Atkinson Hyperlegible | Se mantiene de la web hermana: es una elección de accesibilidad |
| Estructura | Reglas y filetes | El borde rodea; la regla separa. Aquí manda la segunda |
| Movimiento | Solo el cintillo y el carrusel del faldón | Nada entra ni se transforma al hacer scroll: una plana compuesta se lee quieta |

---

## 2. Tokens

Dos variables de color que no existen en la web hermana:

- **`--rule`** — la raya horizontal que separa dos notas. Es más oscura que
  `--border` porque es la que estructura la página; `--border` solo enmarca
  cajas.
- **`--accent-deep`** — arranque de los degradados y de la trama de relleno.

### Edición diurna (por defecto)

```css
:root {
  --accent: 6 63% 46%;             /* #C0392B */
  --accent-bright: 6 70% 54%;
  --accent-deep: 6 60% 32%;

  --background: 40 43% 96%;        /* papel crema */
  --foreground: 0 0% 10%;          /* tinta */
  --surface: 41 36% 93%;           /* papel un tono más hondo */
  --muted: 40 26% 90%;
  --muted-foreground: 30 6% 38%;

  --border: 38 20% 82%;            /* marco de caja */
  --rule: 30 10% 24%;              /* raya de composición */

  --radius: 0px;
  color-scheme: light;
}
```

### Edición nocturna (`html.dark`)

El papel se vuelve tinta: **marrón muy oscuro, no negro puro**, para que siga
leyéndose como papel y no como una terminal. El rojo sube de luminosidad — el
`#C0392B` sobre negro se apaga y parece marrón.

```css
html.dark {
  --accent: 6 78% 62%;
  --background: 30 12% 8%;
  --foreground: 40 30% 92%;
  --surface: 30 10% 12%;
  --border: 30 8% 24%;
  --rule: 40 20% 78%;              /* la regla se invierte: ahora es clara */
  color-scheme: dark;
}
```

---

## 3. Textura de papel

Un grano finísimo sobre el fondo, en `body::before`. Es lo que evita que el
crema se lea como un color plano de CSS y lo empuja hacia papel. Va en un
pseudo-elemento para no ensuciar el DOM y con `z-index: -1` para quedar debajo
de todo.

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.5;
  background-image:
    radial-gradient(hsl(30 20% 45% / 0.06) 1px, transparent 1px),
    radial-gradient(hsl(30 20% 45% / 0.05) 1px, transparent 1px);
  background-size: 4px 4px, 7px 7px;
  background-position: 0 0, 2px 3px;
}
```

Dos tramas con tamaños primos entre sí (4 y 7) para que el patrón no se repita
de forma visible.

---

## 4. Reglas de composición

Cinco utilidades en `index.css`. Son el vocabulario estructural del sitio:

| Clase | Qué hace | Dónde |
|---|---|---|
| `.rule-double` | Raya gruesa arriba, fina abajo | Bajo la mancheta, entre bloques de la portada |
| `.rule-thin` | Separador de 1px | Entre notas de una misma columna |
| `.rule-kicker` | Filete rojo corto de 2.5rem | Bajo un titular, al estilo de un ladillo |
| `.col-rules` | Línea vertical entre columnas (solo ≥768px) | Rejillas de notas |
| `.dropcap` | Capitular serif roja en la primera letra | Sumario de la nota principal y de la página de nota |

La raya doble es la firma más vieja del periodismo impreso; úsala para separar
secciones mayores, no dentro de una.

---

## 5. Tipografía

```css
--font-display: Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif;
--font-body: "AtkinsonHyperlegible", ui-sans-serif, system-ui, sans-serif;
```

| Rol | Clases |
|---|---|
| Mancheta | `font-display font-bold text-[2.75rem] md:text-6xl lg:text-7xl leading-[0.85] tracking-tight` |
| Titular principal | `font-display font-bold text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.04]` |
| Titular de nota | `font-display font-bold text-3xl md:text-5xl lg:text-[3.2rem] leading-[1.06]` |
| Titular de sección | `font-display font-bold text-2xl md:text-3xl` |
| Tarjeta | `font-display font-bold text-lg md:text-xl leading-[1.2] line-clamp-3` |
| Breve | `font-display font-bold text-[15px] leading-[1.25] line-clamp-3` |
| Antetítulo (kicker) | `text-[11px] font-bold uppercase tracking-[0.18em] text-accent` |
| Firma / byline | `text-[11px] uppercase tracking-[0.1em] text-muted-foreground` |
| Nav de secciones | `text-[13px] uppercase tracking-[0.12em]` |
| Cuerpo | `font-body text-sm md:text-base leading-relaxed` |

### Reglas duras

- **El titular nunca lleva `tracking-tight`** salvo la mancheta. Una serif ya
  viene ajustada; apretarla más la ensucia. (Al revés que en la web hermana,
  donde `tracking-tight` es obligatorio en todo título.)
- **Las versalitas mandan en lo pequeño.** Kicker, firma y navegación van en
  mayúsculas con `tracking` abierto. Es lo que da el aire impreso.
- **Peso binario:** 400 y 700.
- Todo texto de terceros lleva `line-clamp`. Los titulares vienen de ocho
  medios distintos y no se pueden acortar a mano.

---

## 6. Fotografía

Las fotos van casi en escala de grises y recuperan color al pasar el puntero:

```jsx
className="[filter:grayscale(0.8)_contrast(1.06)] group-hover:[filter:none]
           transition-[filter] duration-500"
```

**No es decoración: es lo que unifica la página.** El material viene de ocho
medios con ocho tratamientos de color distintos; sin esto, la portada se ve como
un collage. En la página de una nota el filtro baja a `0.55`: ahí la foto ya es
protagonista.

> **Ojo con Tailwind v4.** `grayscale-[0.75]` define la variable
> `--tw-grayscale` pero **no llega a emitir la propiedad `filter`**, así que el
> efecto no se aplica y no hay error en ninguna parte. Por eso va como `filter`
> explícito entre corchetes.

### Cuando no hay foto

Trama de líneas diagonales sobre `bg-muted` — el gris de imprenta con el que un
diario rellena un hueco sin material:

```jsx
backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--rule) / 0.13) 0 1px, transparent 1px 7px)'
```

Toda `<img>` lleva `onError` y cae aquí: las fotos son de terceros y fallan por
motivos que este sitio no controla.

---

## 7. Rejillas

```jsx
/* Portada: principal a 2 columnas + columna de breves */
<div className="col-rules grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-0">
  <div className="lg:col-span-2 md:pr-8"> … </div>
  <aside className="md:pl-8"> … </aside>
</div>

/* Banda y listados: cuatro columnas con filete vertical */
<div className="col-rules grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
  {items.map(a => <div className="md:px-5 first:md:pl-0 last:md:pr-0"> … </div>)}
</div>
```

**Contenedor:** `max-w-[1200px]` — más ancho que los `max-w-6xl` de la web
hermana, porque una plana impresa aprovecha el papel.
**Horizontal:** `px-4 md:px-8 lg:px-12`.
**Vertical:** `py-4`/`py-8`. Mucho más apretado que allá: la densidad es parte
del carácter.

---

## 8. Botones

Rectángulos. Sin relleno salvo el primario.

```jsx
/* Primario */
"px-7 py-2.5 text-[13px] uppercase tracking-[0.16em] bg-accent text-white
 hover:opacity-90 transition-opacity border-0"

/* Secundario — se rellena de rojo al hover */
"border border-[hsl(var(--rule))] px-7 py-2.5 text-[13px] uppercase tracking-[0.16em]
 text-foreground hover:bg-accent hover:text-white hover:border-accent transition-colors"

/* Pestaña de sección activa / inactiva */
"px-4 py-1.5 text-[12px] uppercase tracking-[0.12em] border bg-accent text-white border-accent font-bold"
"px-4 py-1.5 text-[12px] uppercase tracking-[0.12em] border border-border text-muted-foreground hover:text-accent hover:border-accent"
```

---

## 9. Movimiento

`<MotionConfig reducedMotion="user">` sigue envolviendo la app, y el easing de
marca sigue siendo `[0.21, 0.65, 0.36, 1]`. Pero aquí **casi nada se mueve**:

- **La portada no usa `Reveal`.** Una plana tiene que estar compuesta y quieta
  desde el primer frame.
- **Los dos únicos movimientos continuos** son el cintillo (`.ticker-track`) —
  lista duplicada, la copia con `aria-hidden` y máscara de fundido en los
  bordes— y el **carrusel del faldón de portada**, que avanza solo cada 6 s.
  Los dos se detienen con `prefers-reduced-motion`; el carrusel además se para
  al pasar el ratón, al entrar con el teclado y con la pestaña oculta.
- En el carrusel el rótulo va **debajo** de la imagen, no encima: es un pie de
  foto impreso. Como los pies varían de largo y la pista los pone lado a lado,
  el bloque de texto lleva `min-h-[7rem]`; sin él, cambiar de banner movería la
  página entera.
- **El acordeón del FAQ** conserva la animación de altura.
- Los hover son cambios de color de 150 ms. Nada se transforma ni se levanta.

`prefers-reduced-motion` detiene el cintillo y el scroll suave.

---

## 10. Checklist

- [ ] Copiar `@theme` + `:root` + `html.dark` tal cual
- [ ] `--radius: 0px` y ni una clase `rounded-*`
- [ ] Titular en `font-display` (serif), **sin** `tracking-tight`
- [ ] Micro-etiquetas en mayúsculas con `tracking` abierto
- [ ] `body::before` con la trama de papel
- [ ] Separar con `.rule-*` y `.col-rules`, no con bordes de caja
- [ ] Fotos con `[filter:grayscale(...)]` explícito, nunca `grayscale-[...]`
- [ ] `onError` en toda imagen de terceros
- [ ] `line-clamp` en todo texto de terceros
- [ ] Los tres estados (esqueleto, vacío, error) en todo listado
- [ ] Foco visible cuadrado

### Errores comunes

| No | Sí |
|---|---|
| Blanco puro de fondo | Papel crema `#FAF7F0` |
| Una sola esquina redondeada | Radio 0 en todo |
| Titular en sans | Serif, siempre |
| `grayscale-[0.8]` de Tailwind | `[filter:grayscale(0.8)]` |
| Cajas con borde alrededor de cada nota | Reglas y filetes |
| Sombras para separar | Reglas para separar |
| `Reveal` en la portada | Portada quieta |
| Celeste, morado o verde | Solo tinta, papel y rojo |

---

## 11. Avisos

Un diario no vende «banners»: vende **módulos** de una plana y los mide en
columnas y centímetros. Ese es el vocabulario de `src/data/avisos.ts`, y no es
coquetería —es lo que hace que el hueco libre se lea como el recuadro de
«CONTRATE ESTE ESPACIO» de un impreso y no como un hueco de red publicitaria.
Lo pinta `Aviso` / `BandaAviso` / `Clasificados`
(`src/components/avisos/Aviso.tsx`).

`ESPACIOS` son los huecos —existen siempre, contratados o no, con la misma
medida— y `AVISOS` las piezas contratadas.

| Hueco | Módulo | Medida | Dónde |
|---|---|---|---|
| `portada-faldon` | Faldón | 8 col × 5 cm | Portada, bajo el cintillo |
| `portada-modulo` | Módulo | 2 col × 8 cm | Al pie de la columna de breves |
| `edicion-faldon` | Faldón | 8 col × 5 cm | `/noticias` y cada sección |
| `nota-columna` | Columna | 1 col × 20 cm | Columna lateral de la nota |
| `nota-faldon` | Faldón | 8 col × 5 cm | Cierre de la nota |
| `clasificados` | Clasificado | 2 col × 3 cm | Banda de tres, al final de portada |

**Forma del recuadro libre:** filete, rótulo en versalitas sobre línea, la
trama diagonal a 45° con la que se rellena un hueco sin material, titular en
serif, botón rectangular «Contrate este espacio» y, en pequeño, la medida de
imprenta más el archivo que hay que entregar. Sin sombra, sin radio, sin
entrada animada: aquí nada de eso existe.

La pieza contratada **no** lleva la grisalla de las fotos de las notas: eso es
tratamiento editorial y un aviso va como lo entregó quien lo paga.
