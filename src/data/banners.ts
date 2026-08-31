/* Banners del hero de El Guayasense.

   Están aquí, quemados, y no vienen de la API: son tres piezas que cambian
   cada varias semanas, y traerlas del backend costaba una petición en la
   primera pantalla, un estado de carga y un despliegue del backend cada vez
   que se cambia una imagen. Editar este archivo y desplegar la web es más
   corto y no puede fallar a medias.

   Las imágenes viven en `public/img/` de esta misma web, así que se referencian
   por ruta absoluta del sitio.

   El backend NO tiene banners: el modelo, el endpoint y `seed_banners` se
   borraron porque nadie los consumía. Si algún día hacen falta banners por
   campaña o con ventana de fechas, se vuelven a crear allí; hoy sobraban. */

export type Banner = {
  key: string;
  title: string;
  subtitle: string;
  alt: string;
  image_url: string;
  image_url_mobile: string;
  link_url: string;
  open_in_new_tab: boolean;
  order: number;
};

export const HERO_BANNERS: Banner[] = [
  {
    key: 'hero-principal',
    title: 'Guayaquil, al día',
    subtitle: 'Lo que publican los medios de la ciudad, reunido en un solo lugar.',
    alt: 'Vista panorámica de Guayaquil',
    image_url: '/img/banner-hero.jpg',
    image_url_mobile: '/img/banner-hero-mobile.jpg',
    link_url: '',
    open_in_new_tab: false,
    order: 10,
  },
  {
    key: 'fuentes',
    title: 'De dónde viene cada nota',
    subtitle: 'Publicamos titular y extracto. El artículo completo, en el medio que lo escribió.',
    alt: '',
    image_url: '/img/banner-fuentes.jpg',
    image_url_mobile: '',
    link_url: '/medios',
    open_in_new_tab: false,
    order: 20,
  },
  {
    key: 'destacado-seguridad',
    title: 'Seguridad',
    subtitle: 'Orden público, policía y justicia en la ciudad.',
    alt: '',
    image_url: '/img/banner-seccion.jpg',
    image_url_mobile: '',
    link_url: '/seccion/seguridad',
    open_in_new_tab: false,
    order: 30,
  },
];
