import { Link } from 'react-router-dom';
import { LegalPage } from './LegalPage';

const UPDATED = '29 de agosto de 2026';

export function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de privacidad"
      updated={UPDATED}
      path="/privacidad"
      seoTitle="Política de privacidad — El Guayasense"
      seoDescription="Qué datos recoge El Guayasense y cómo los trata, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador."
      intro="El Guayasense no pide registro ni recoge datos personales para funcionar. Esta página explica lo poco que sí se guarda y por qué."
      sections={[
        {
          title: '1. Quiénes somos',
          body: (
            <p className="m-0">
              El Guayasense es un agregador de noticias de la ciudad. Reunimos titulares
              y extractos publicados por medios de comunicación y enlazamos a sus artículos
              originales. No producimos contenido periodístico propio.
            </p>
          ),
        },
        {
          title: '2. Qué datos recogemos',
          body: (
            <>
              <p className="m-0">
                <strong className="text-foreground">Ninguno que te identifique.</strong> No hay
                cuentas, ni formularios de registro, ni newsletter. No pedimos tu nombre, tu
                correo ni tu teléfono para leer el sitio.
              </p>
              <p className="m-0">
                Lo único que se guarda vive en tu propio navegador y nunca sale de él: la
                preferencia de modo claro u oscuro y el estado del aviso de cookies.
              </p>
            </>
          ),
        },
        {
          title: '3. Cookies y almacenamiento local',
          body: (
            <>
              <p className="m-0">
                Usamos <code>localStorage</code>, no cookies de seguimiento. Se guardan dos
                valores: <code>elguayasense-theme</code> (claro u oscuro) y <code>cookie_consent</code>{' '}
                (si ya viste el aviso).
              </p>
              <p className="m-0">
                Puedes borrarlos en cualquier momento desde la configuración de tu navegador.
                El sitio seguirá funcionando igual.
              </p>
            </>
          ),
        },
        {
          title: '4. Registros del servidor',
          body: (
            <p className="m-0">
              Como cualquier sitio web, nuestro servidor registra las peticiones que recibe
              (dirección IP, fecha, página solicitada, navegador) por seguridad y para
              detectar fallos. Estos registros se conservan un tiempo limitado y no se cruzan
              con ninguna otra información ni se ceden a terceros.
            </p>
          ),
        },
        {
          title: '5. Contenido y enlaces de terceros',
          body: (
            <>
              <p className="m-0">
                Las imágenes de las notas se cargan desde los servidores de cada medio. Al
                mostrarse, tu navegador se comunica directamente con ellos, que pueden aplicar
                sus propias políticas.
              </p>
              <p className="m-0">
                Al seguir un enlace a un artículo original sales de este sitio y pasas a
                regirte por la política de privacidad de ese medio.
              </p>
            </>
          ),
        },
        {
          title: '6. Tus derechos',
          body: (
            <p className="m-0">
              La Ley Orgánica de Protección de Datos Personales del Ecuador te da derecho de
              acceso, rectificación, eliminación y oposición sobre tus datos personales. Como
              no tratamos datos que te identifiquen, en la práctica no hay nada que rectificar
              ni eliminar.
              {/* Sin canal de contacto público: no hay formulario ni correo de contacto.
              , aun así, si tienes una consulta escríbenos a{' '}
              <a href="mailto:hola@elguayasense.com" className="text-accent no-underline hover:underline">
                hola@elguayasense.com
              </a>
              .
              */}
            </p>
          ),
        },
        {
          title: '7. Cambios',
          body: (
            <p className="m-0">
              Si esta política cambia, actualizaremos la fecha del encabezado. Los cambios
              relevantes se anunciarán en la portada. Consulta también los{' '}
              <Link to="/terminos" className="text-accent no-underline hover:underline">
                términos y condiciones
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
