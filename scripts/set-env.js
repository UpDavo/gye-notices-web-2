// scripts/set-env.js
// Lee .env y genera src/environments/environment.ts
//
// Mismo patrón que el resto de frontends de la casa: las variables se
// resuelven en tiempo de build, no con `import.meta.env`, para que el mismo
// comando funcione en local (leyendo .env) y en la nube (leyendo process.env,
// que es como Cloudflare Pages las inyecta).

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Si existe .env (entorno local), lo carga; si no (Cloudflare/cloud), usa process.env directamente.
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('📄  Variables cargadas desde .env');
} else {
  console.log('ℹ️   Archivo .env no encontrado — usando variables de process.env (modo cloud)');
}

const env = process.env;

// API_URL vacío = mismo origen. En desarrollo lo cubre el proxy de Vite.
const apiUrl = (env.API_URL ?? '').replace(/\/$/, '');
const siteUrl = (env.SITE_URL ?? 'https://guayaco.ec').replace(/\/$/, '');

// Qué web es esta. El backend alimenta varias y reparte las notas entre ellas,
// así que sin este slug la API devolvería también las de la otra.
const siteSlug = env.SITE_SLUG ?? 'guayaco';

const content = `// Generado automáticamente por scripts/set-env.js — NO editar manualmente.
export const environment = {
  production: ${env.NODE_ENV === 'production'},
  apiUrl: '${apiUrl}',
  siteUrl: '${siteUrl}',
  siteSlug: '${siteSlug}',
};
`;

const outputPath = resolve(__dirname, '../src/environments/environment.ts');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, content);

console.log(
  `✅  environment.ts generado (site: '${siteSlug}', apiUrl: '${apiUrl || '(mismo origen)'}', siteUrl: '${siteUrl}')`,
);
