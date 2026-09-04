import { Link } from 'react-router-dom';
import { LegalPage } from './LegalPage';
import { environment } from '../environments/environment';

const UPDATED = '4 de septiembre de 2026';

/* Las condiciones de uso, en el registro del diario: usted, «edición»,
   «material», «componer». Empiezan por lo que de verdad importa —el material
   no es de esta casa— y no por la definición del servicio, que es como lo
   ordenaría un contrato y no un periódico.

   Deliberadamente distintas, en orden y en redacción, a las de la web
   hermana. */

export function TermsPage() {
  return (
    <LegalPage
      eyebrow="Documentos de la casa"
      title="Condiciones de uso"
      updated={UPDATED}
      path="/terminos"
      seoTitle="Condiciones de uso — El Guayasense"
      seoDescription="Condiciones de uso de El Guayasense y cómo se trata en esta edición el material de los medios de la ciudad."
      intro="Quien abre esta edición acepta lo que sigue. Todo cabe en una línea: el material no es de esta casa, y por eso cada nota lleva el nombre de quien la escribió y la salida a su página."
      sections={[
        {
          title: 'El material no es de este diario',
          body: (
            <>
              <p className="m-0">
                Los titulares, las entradillas y las fotografías que se componen en estas
                planas pertenecen a los medios que los publicaron. Aparecen aquí con fines
                informativos y de referencia, en extensión corta y con el crédito siempre a la
                vista, para que usted decida si quiere leer la nota completa en su fuente.
              </p>
              <p className="m-0">
                Nunca se reproduce el cuerpo de un artículo, nunca se borra la firma de su
                autor y nunca se presenta material ajeno como propio. El Guayasense reúne y
                acredita; no redacta.
              </p>
            </>
          ),
        },
        {
          title: 'Cómo se compone la edición',
          body: (
            <p className="m-0">
              Se leen, sobre todo, los feeds que cada medio publica precisamente para ser
              sindicado. Se respeta el <code>robots.txt</code> de cada sitio, se espacian las
              peticiones, se acata el <code>Crawl-delay</code> que declaren y el robot se
              identifica con nombre y correo de contacto, nunca disfrazado de navegador. Las
              reglas completas están en{' '}
              <Link to="/medios" className="text-accent no-underline hover:underline">
                la redacción de esta edición
              </Link>
              .
            </p>
          ),
        },
        {
          title: 'Retirada del material, el mismo día',
          body: (
            <p className="m-0">
              Cualquier medio puede pedir que su material deje de aparecer, y se retira el
              mismo día, sin condiciones y sin pedir nada a cambio. Basta con escribir a{' '}
              <a href={`mailto:${environment.contactEmail}`} className="text-accent no-underline hover:underline">
                {environment.contactEmail}
              </a>{' '}
              desde una dirección del propio medio. No hace falta invocar ninguna ley ni
              justificar el motivo.
            </p>
          ),
        },
        {
          title: 'La responsabilidad editorial es de cada medio',
          body: (
            <p className="m-0">
              Aquí no se verifica ni se corrige lo que publican los medios: la responsabilidad
              sobre cada nota es de quien la firma. Un titular puede corregirse en la fuente
              después de que esta edición lo recogió. Ante cualquier duda, la versión válida es
              la del artículo original, no la de esta plana.
            </p>
          ),
        },
        {
          title: 'Qué puede hacer usted con esta edición',
          body: (
            <p className="m-0">
              Leerla y compartirla: el acceso es libre y gratuito, y cada nota se puede enlazar
              sin pedir permiso. Lo que no se puede es extraer el contenido de forma masiva con
              medios automatizados ni replicarlo en otro servicio. La razón es la de siempre:
              como el material no es de esta casa, esta casa no puede autorizar que se
              redistribuya.
            </p>
          ),
        },
        {
          title: 'Los espacios publicitarios',
          body: (
            <p className="m-0">
              Los avisos que aparecen en estas planas van siempre rotulados como tales y nunca
              se componen con la tipografía ni el formato de una nota. Contratar un espacio no
              da derecho a decidir qué se publica ni en qué orden: la edición se compone antes
              de que entre el aviso.
            </p>
          ),
        },
        {
          title: 'Disponibilidad, cambios y ley aplicable',
          body: (
            <>
              <p className="m-0">
                La edición se ofrece tal cual, sin garantía de estar disponible sin
                interrupción. Estas condiciones pueden cambiar; la fecha del encabezado dice
                cuándo se compuso la versión que está leyendo. Léalas junto al{' '}
                <Link to="/privacidad" className="text-accent no-underline hover:underline">
                  aviso de privacidad
                </Link>
                .
              </p>
              <p className="m-0">
                Todo lo anterior se rige por la legislación de la República del Ecuador, y
                cualquier controversia se someterá a los jueces competentes de la ciudad de
                Guayaquil.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
