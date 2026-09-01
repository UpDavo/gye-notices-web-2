/* Banners del hero de El Guayasense.

   Están aquí, quemados, y no vienen de la API: son piezas que cambian cada
   varias semanas, y traerlas del backend costaba una petición en la primera
   pantalla, un estado de carga y un despliegue del backend cada vez que se
   cambia una imagen. Editar este archivo y desplegar la web es más corto y no
   puede fallar a medias.

   Hoy hay una sola, y es una foto de la ciudad. Las tres siluetas vectoriales
   que ocupaban el hueco eran relleno de maqueta: con una imagen real detrás,
   rotar hacia un placeholder cada seis segundos abarataba la portada en vez de
   llenarla. Cuando haya más piezas propias se añaden a esta lista y el
   carrusel vuelve a girar solo —las flechas y los puntos aparecen a partir del
   segundo banner.

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
    key: 'skyline-atardecer',
    title: 'Guayaquil al atardecer',
    subtitle: 'La ciudad, contada cada día.',
    alt: 'Vista aérea de Guayaquil al atardecer, con el cerro Santa Ana y las torres de Puerto Santa Ana',
    image_url: '/img/banner-skyline.jpg',
    image_url_mobile: '/img/banner-skyline-mobile.jpg',
    link_url: '',
    open_in_new_tab: false,
    order: 10,
  },
];
