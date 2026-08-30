import { Link } from 'react-router-dom';
import { LegalPage } from './LegalPage';

const UPDATED = '29 de agosto de 2026';

export function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos y condiciones"
      updated={UPDATED}
      path="/terminos"
      seoTitle="Términos y condiciones — Guayaco"
      seoDescription="Condiciones de uso de Guayaco, agregador de noticias de la ciudad, y cómo se trata el contenido de los medios."
      intro="Al usar Guayaco aceptas estas condiciones. La más importante cabe en una línea: el contenido no es nuestro, y por eso siempre te llevamos a quien lo escribió."
      sections={[
        {
          title: '1. Qué es este sitio',
          body: (
            <p className="m-0">
              Guayaco es un agregador. Reunimos titulares y extractos breves
              publicados por medios de comunicación, indicamos siempre el medio de origen y
              enlazamos a su artículo completo. No somos un medio de comunicación ni
              elaboramos contenido periodístico.
            </p>
          ),
        },
        {
          title: '2. Contenido de terceros y derechos de autor',
          body: (
            <>
              <p className="m-0">
                Los titulares, extractos e imágenes que aparecen aquí pertenecen a los medios
                que los publicaron. Se muestran con fines informativos y de referencia, en
                extensión limitada y con atribución visible, para que el lector decida si
                quiere leer el artículo completo en la fuente.
              </p>
              <p className="m-0">
                No reproducimos el cuerpo de los artículos, no eliminamos las firmas de autor
                y no presentamos contenido ajeno como propio.
              </p>
            </>
          ),
        },
        {
          title: '3. Cómo obtenemos el contenido',
          body: (
            <p className="m-0">
              Leemos principalmente los feeds RSS que cada medio publica para ser sindicado.
              Respetamos el <code>robots.txt</code> de cada sitio, espaciamos las peticiones,
              acatamos el <code>Crawl-delay</code> que declaren y nos identificamos con un
              User-Agent propio. Las reglas completas están en{' '}
              <Link to="/medios" className="text-accent no-underline hover:underline">
                Medios
              </Link>
              .
            </p>
          ),
        },
        {
          title: '4. Retiro de contenido',
          body: (
            <p className="m-0">
              Cualquier medio puede pedir que dejemos de mostrar su contenido y lo retiramos
              el mismo día, sin condiciones ni contrapartidas. Basta con escribir a{' '}
              <a href="mailto:hola@guayaco.ec" className="text-accent no-underline hover:underline">
                hola@guayaco.ec
              </a>{' '}
              desde un correo del medio.
            </p>
          ),
        },
        {
          title: '5. Exactitud de la información',
          body: (
            <p className="m-0">
              No verificamos ni editamos las notas que agregamos: la responsabilidad
              editorial es de cada medio. Un titular puede cambiar o corregirse en la fuente
              después de que lo tomamos. Ante cualquier duda, la versión válida es la del
              artículo original.
            </p>
          ),
        },
        {
          title: '6. Uso del sitio',
          body: (
            <p className="m-0">
              El acceso es libre y gratuito. No está permitido usar medios automatizados para
              extraer masivamente el contenido de este sitio ni replicarlo en otro servicio;
              precisamente porque el contenido no es nuestro, no podemos autorizar su
              redistribución.
            </p>
          ),
        },
        {
          title: '7. Disponibilidad y cambios',
          body: (
            <p className="m-0">
              El sitio se ofrece tal cual, sin garantía de disponibilidad continua. Podemos
              modificar estos términos; los cambios se reflejarán en la fecha del encabezado.
              Consulta también la{' '}
              <Link to="/privacidad" className="text-accent no-underline hover:underline">
                política de privacidad
              </Link>
              .
            </p>
          ),
        },
        {
          title: '8. Ley aplicable',
          body: (
            <p className="m-0">
              Estos términos se rigen por la legislación de la República del Ecuador. Cualquier
              controversia se someterá a los jueces competentes de la ciudad de Guayaquil.
            </p>
          ),
        },
      ]}
    />
  );
}
