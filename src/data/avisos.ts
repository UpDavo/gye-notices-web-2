/* Los avisos de El Guayasense.

   Un diario no vende «banners»: vende MÓDULOS de una plana, y los mide en
   columnas y centímetros. Ese es el vocabulario de este archivo, y no es
   coquetería: es lo que hace que el espacio libre se lea como el recuadro de
   «CONTRATE ESTE ESPACIO» de un impreso y no como un hueco de AdSense.

   Dos listas:

   - `ESPACIOS` son los HUECOS de la edición: dónde caen, qué módulo son y qué
     dicen mientras nadie los contrata. Existen siempre. Un hueco que solo
     aparece cuando ya está vendido no se le puede enseñar a un anunciante, y
     además, al reservar su medida desde el primer frame, la plana no se
     recompone cuando entra el aviso.
   - `AVISOS` son las piezas CONTRATADAS. Vender un hueco es añadir aquí su
     entrada; al terminar la campaña se borra y el hueco vuelve solo a su
     recuadro.

   Como `banners.ts`, esto vive quemado en el repo y no en la API: son pocas
   piezas y cambian por temporada. Cambiar un aviso es editar este archivo y
   desplegar. */

import { environment } from '../environments/environment';

export type Modulo = 'faldon' | 'robapaginas' | 'modulo' | 'columna' | 'clasificado';

export type Espacio =
  | 'portada-faldon'      // bajo el cintillo, a todo el ancho de la plana
  | 'portada-modulo'      // al pie de la columna de breves
  | 'edicion-faldon'      // en la plana de todas las notas y en las secciones
  | 'nota-columna'        // columna lateral de una nota
  | 'nota-faldon'         // al cierre de la nota
  | 'clasificados';       // la banda de tres, al final de la portada

export type MedidaModulo = {
  /* Como se nombra en la orden de publicidad. */
  nombre: string;
  /* Medida de imprenta: es lo que entiende el anunciante local. */
  medida: string;
  /* Y la medida real del archivo que hay que entregar. */
  archivo: string;
  /* Proporción del hueco. El aviso contratado la respeta siempre; el recuadro
     de espacio libre la usa como MÍNIMO y crece si su texto no cabe. Recortar
     el texto para conservar la medida exacta era el peor de los dos males: el
     hueco medía bien y no se leía. */
  proporcion: string;
  /* Altura mínima del recuadro libre. NO se usa la proporción: un
     `aspect-ratio` fija la altura y recorta el texto que no quepa, y un
     titular cortado es peor que un recuadro un poco más alto de la cuenta. */
  minimoLibre: string;
  /* Cómo se compone el recuadro libre. Un módulo ancho y bajo —el faldón, el
     clasificado— no admite cuatro líneas apiladas: ahí el texto va a la
     izquierda y el botón a la derecha. */
  disposicion: 'apilado' | 'fila';
  /* El clasificado es el módulo más pequeño de la edición: una línea y su
     medida, nada más. */
  compacto?: boolean;
};

export const MODULOS: Record<Modulo, MedidaModulo> = {
  faldon:      { nombre: 'Faldón',      medida: '8 col × 5 cm',  archivo: '1200 × 250 px', proporcion: 'aspect-[5/2] sm:aspect-[4/1] md:aspect-[1200/250]', minimoLibre: 'min-h-[8rem] md:min-h-[10rem]',  disposicion: 'fila' },
  robapaginas: { nombre: 'Robapáginas', medida: '3 col × 12 cm', archivo: '600 × 500 px',  proporcion: 'aspect-[3/2] md:aspect-[600/500]',                  minimoLibre: 'min-h-[16rem] md:min-h-[20rem]', disposicion: 'apilado' },
  modulo:      { nombre: 'Módulo',      medida: '2 col × 8 cm',  archivo: '400 × 330 px',  proporcion: 'aspect-[400/330]',                                  minimoLibre: 'min-h-[14rem]',                  disposicion: 'apilado' },
  columna:     { nombre: 'Columna',     medida: '1 col × 20 cm', archivo: '300 × 600 px',  proporcion: 'aspect-[3/2] md:aspect-[300/600]',                  minimoLibre: 'min-h-[16rem] md:min-h-[30rem]', disposicion: 'apilado' },
  clasificado: { nombre: 'Clasificado', medida: '2 col × 3 cm',  archivo: '400 × 120 px',  proporcion: 'aspect-[400/120]',                                  minimoLibre: 'min-h-[6.5rem]',                 disposicion: 'fila', compacto: true },
};

export type DefinicionEspacio = {
  modulo: Modulo;
  /* El rótulo del recuadro. Un aviso rotulado como nota engaña al lector y se
     lleva por delante la credibilidad de la plana entera. */
  rotulo: string;
  /* Lo que se compone en el hueco mientras está libre. */
  libre: { titular: string; texto: string };
};

export const ESPACIOS: Record<Espacio, DefinicionEspacio> = {
  'portada-faldon': {
    modulo: 'faldon',
    rotulo: 'Espacio publicitario',
    libre: {
      titular: 'Su aviso en primera plana',
      texto: 'El faldón de portada: lo ve todo el que abre la edición del día.',
    },
  },
  'portada-modulo': {
    modulo: 'modulo',
    rotulo: 'Aviso',
    libre: {
      titular: 'Su negocio, aquí',
      texto: 'Al pie de la columna de breves, donde el lector termina la plana.',
    },
  },
  'edicion-faldon': {
    modulo: 'faldon',
    rotulo: 'Espacio publicitario',
    libre: {
      titular: 'Contrate este espacio',
      texto: 'Faldón en la plana de toda la edición y en cada sección.',
    },
  },
  'nota-columna': {
    modulo: 'columna',
    rotulo: 'Aviso',
    libre: {
      titular: 'Su aviso aquí',
      texto: 'Una columna entera junto a la nota, mientras se lee.',
    },
  },
  'nota-faldon': {
    modulo: 'faldon',
    rotulo: 'Espacio publicitario',
    libre: {
      titular: 'Cierre de nota',
      texto: 'El faldón que queda al terminar de leer.',
    },
  },
  clasificados: {
    modulo: 'clasificado',
    rotulo: 'Clasificados',
    libre: {
      titular: 'Anúnciese en los clasificados',
      texto: 'El módulo más pequeño y el más barato de la edición.',
    },
  },
};

export type Aviso = {
  clave: string;
  espacio: Espacio;
  /* Quién contrata. Va en el pie del recuadro: «Publicidad — Nombre». */
  anunciante: string;
  alt: string;
  /* La pieza entregada. Si no carga, el hueco vuelve a su recuadro de espacio
     libre: un aviso a medias es peor que ninguno. */
  imagen: string;
  imagen_movil?: string;
  enlace: string;
  nueva_pestana: boolean;
  /* Vigencia, en ISO (`2026-09-01` o con hora). Opcional: deja programada una
     campaña y la apaga sola el día que vence, sin desplegar. */
  desde?: string;
  hasta?: string;
  orden: number;
};

/* Vacío a propósito: hoy no hay ninguna campaña contratada y todos los huecos
   muestran su recuadro. Para vender uno, añada aquí su entrada. */
export const AVISOS: Aviso[] = [];

export function correoContratacion(definicion: DefinicionEspacio, modulo: MedidaModulo): string {
  const asunto = `Contratacion de aviso — ${modulo.nombre} (${modulo.medida})`;
  const cuerpo = `Buenas: me interesa el espacio «${definicion.libre.titular}» — ${modulo.nombre}, ${modulo.medida} (${modulo.archivo}).`;
  return `mailto:${environment.contactEmail}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}

/* El aviso vigente de un hueco, o `null` si está libre.

   Se resuelve en cada render y no una vez al importar: una pestaña abierta
   toda la tarde no debe seguir mostrando una campaña que ya venció. */
export function avisoDe(espacio: Espacio, ahora: Date = new Date()): Aviso | null {
  const t = ahora.getTime();
  const vigentes = AVISOS.filter((a) => a.espacio === espacio)
    .filter((a) => !a.desde || Date.parse(a.desde) <= t)
    .filter((a) => !a.hasta || Date.parse(a.hasta) >= t)
    .sort((a, b) => a.orden - b.orden);
  return vigentes[0] ?? null;
}
