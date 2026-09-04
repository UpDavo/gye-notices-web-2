import { Link } from 'react-router-dom';
import { LegalPage } from './LegalPage';
import { environment } from '../environments/environment';

const UPDATED = '4 de septiembre de 2026';

/* El aviso de privacidad, compuesto como lo escribiría un diario y no como lo
   escribiría una aplicación: se trata al lector de usted, se empieza por la
   conclusión —aquí no se sabe quién es— y quién responde por la edición se
   deja para el final, que es donde va el colofón de un impreso.

   El orden y el tratamiento son deliberadamente distintos a los de la web
   hermana. Son dos diarios, no dos temas del mismo sitio, y dos diarios no
   publican el mismo aviso legal palabra por palabra. */

export function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Documentos de la casa"
      title="Aviso de privacidad"
      updated={UPDATED}
      path="/privacidad"
      seoTitle="Aviso de privacidad — El Guayasense"
      seoDescription="Qué datos guarda El Guayasense y cómo los trata, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador."
      intro="Este diario no pide registro, no abre cuentas y no recoge datos que permitan identificar a quien lo lee. Lo que sigue explica lo poco que sí queda guardado, dónde queda y por cuánto tiempo."
      sections={[
        {
          title: 'Lo corto: aquí no se sabe quién es usted',
          body: (
            <>
              <p className="m-0">
                <strong className="text-foreground">No se recoge ningún dato que le identifique.</strong>{' '}
                No hay cuentas, ni suscripción, ni formularios. Nunca se le pide su nombre, su
                correo ni su teléfono para leer la edición.
              </p>
              <p className="m-0">
                No hay perfiles de lectura, ni etiquetas de seguimiento, ni herramientas de
                publicidad conductual. Los espacios que se venden en estas planas se contratan
                por su posición —el faldón de portada, la columna de una nota—, no por lo que
                haya leído usted antes.
              </p>
            </>
          ),
        },
        {
          title: 'Lo que se guarda en su navegador',
          body: (
            <>
              <p className="m-0">
                Dos valores, y ninguno sale de su equipo:{' '}
                <code>elguayasense-theme</code>, que recuerda si prefiere la edición diurna o
                la nocturna, y <code>cookie_consent</code>, que recuerda que ya vio el aviso y
                evita repetírselo en cada visita.
              </p>
              <p className="m-0">
                Van en <code>localStorage</code>, no en cookies de seguimiento. Puede borrarlos
                cuando quiera desde la configuración de su navegador: la edición se sigue
                leyendo igual, solo que volverá a abrirse en diurna.
              </p>
            </>
          ),
        },
        {
          title: 'Lo que queda en el servidor',
          body: (
            <p className="m-0">
              Como en cualquier sitio, el servidor anota las peticiones que recibe —dirección
              IP, fecha, página pedida y navegador— por seguridad y para detectar averías. Esos
              registros se conservan un tiempo limitado, no se cruzan con ninguna otra
              información y no se ceden a terceros.
            </p>
          ),
        },
        {
          title: 'Las fotos y los enlaces son de cada medio',
          body: (
            <>
              <p className="m-0">
                Las fotografías de las notas se sirven desde los servidores del medio que las
                publicó. Al pintarse en la plana, su navegador habla directamente con ellos, y
                cada uno aplica sus propias reglas.
              </p>
              <p className="m-0">
                Y cuando usted sigue el enlace a la nota original sale de este diario: a partir
                de ahí manda la política del medio al que llegó, no esta.
              </p>
            </>
          ),
        },
        {
          title: 'Sus derechos, y por qué aquí casi no hacen falta',
          body: (
            <p className="m-0">
              La Ley Orgánica de Protección de Datos Personales del Ecuador le reconoce los
              derechos de acceso, rectificación, eliminación y oposición sobre sus datos
              personales. Como en esta edición no se tratan datos que le identifiquen, en la
              práctica no hay nada que rectificar ni que eliminar. Si aun así tiene una
              consulta, escriba a{' '}
              <a href={`mailto:${environment.contactEmail}`} className="text-accent no-underline hover:underline">
                {environment.contactEmail}
              </a>
              {' '}y se le contesta.
            </p>
          ),
        },
        {
          title: 'Quién responde por esta edición',
          body: (
            <p className="m-0">
              El Guayasense reúne titulares y entradillas publicados por los medios de
              Guayaquil, los acredita y devuelve al lector a la nota original. No produce
              material periodístico propio. La responsabilidad sobre cada texto es del medio
              que lo firma; la responsabilidad sobre esta plana y sobre este aviso es de quien
              edita el sitio.
            </p>
          ),
        },
        {
          title: 'Si este aviso cambia',
          body: (
            <p className="m-0">
              La fecha del encabezado dice cuándo se compuso esta versión. Si cambia algo de
              fondo, se anuncia en portada. Junto a este documento conviene leer las{' '}
              <Link to="/terminos" className="text-accent no-underline hover:underline">
                condiciones de uso
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
