# Guía de funcionamiento y actualización del sitio

Portal de la Institución Educativa Padre Roberto Arroyave Vélez.

- Sitio público: https://ineprav.ddns.net/
- Repositorio: https://github.com/scasarrubia/scasarrubia.github.io
- Rama de trabajo y publicación: `main`.

## 1. Cómo funciona

El sitio está construido con Vue 3 y Vite. GitHub almacena el código y GitHub Actions lo compila y publica en GitHub Pages. No-IP proporciona el dominio que usan los visitantes.

Las noticias, alertas, proyectos, documentos y agendas se consultan desde el navegador a través de aplicaciones web de Google Apps Script conectadas a Sheets. Los documentos y algunas imágenes se alojan en Drive. El calendario también admite Google Calendar.

Flujo de publicación del código:

```text
Editar en VS Code → probar → commit → push a main
→ GitHub Actions compila → GitHub Pages publica → sitio actualizado
```

Las direcciones como `/#/noticias` son normales: Vue Router usa `createWebHashHistory()` para que las páginas internas funcionen al recargar en GitHub Pages.

## 2. Qué hay que actualizar según el cambio

| Cambio | Dónde se hace | ¿Requiere publicar con GitHub? |
| --- | --- | --- |
| Textos fijos, diseño, menú o comportamiento | Código en VS Code | Sí: commit y push |
| Imágenes incluidas en el proyecto | `public/images/` y sus referencias | Sí |
| Noticias, alertas, agenda y datos de proyectos o documentos | Hoja de Sheets o formulario que la alimenta | No; recargar el sitio para consultar los datos |
| Acceso a un documento de Drive | Permisos del archivo en Drive | No |
| Código de una API de Apps Script | Proyecto correspondiente en Google Apps Script | Actualizar su implementación; GitHub solo si cambia la URL o el sitio |
| URL de una API | `.env.local` y variable correspondiente en GitHub | Sí: volver a ejecutar la publicación |
| Dominio | GitHub Pages y DNS en No-IP | Solo cuando cambie el dominio o su configuración |

Las noticias se ordenan por la fecha que devuelve la API, de más reciente a más antigua. Si coinciden las fechas, se usa `order` descendente; normalmente corresponde a las últimas filas de Sheets. Las noticias sin fecha válida quedan después de las que sí la tienen.

## 3. Probar desde VS Code

Abre la carpeta `WebPrav` y luego **Terminal → Nueva terminal**. Si trabajas con otros equipos o personas, sincroniza con `git pull --ff-only origin main` antes de editar, con tus cambios anteriores guardados en commits.

La primera vez, o cuando cambien las dependencias:

```bash
npm ci
```

Para trabajar y ver los cambios:

```bash
npm run dev
```

Abre la dirección que muestra la terminal, normalmente `http://localhost:5173`. Si el puerto está ocupado, Vite puede indicar otro. Guarda los archivos para ver los cambios. Detén el servidor con `Ctrl+C`.

Si cambias `.env.local`, reinicia el servidor de desarrollo.

Antes de publicar:

```bash
npm run build
npm run preview
```

Abre la dirección indicada, normalmente `http://localhost:4173`. Revisa las secciones afectadas, el menú, el diseño móvil y, si corresponde, lectura y descarga de documentos. Para comprobar permisos públicos de Drive, prueba también en incógnito.

## 4. Publicar cambios desde VS Code

Después de probar:

```bash
git status --short
git diff
git add .
git commit -m "Descripción concreta del cambio"
git push origin main
```

Antes de `git add .`, revisa que los archivos modificados sean los que quieres publicar. Puedes seleccionar archivos concretos con `git add ruta/del/archivo`.

Para las actualizaciones normales no debes repetir `git init`, agregar nuevamente el remoto, borrar ramas ni usar `git push --force`.

GitHub Actions inicia automáticamente el proceso **Publicar sitio** al recibir cambios en `main`. Instala dependencias, ejecuta `npm run build` y publica el contenido de `dist`.

No subas manualmente `dist` ni `node_modules`: GitHub los genera cuando corresponde. `.gitignore` también excluye los archivos `.env` reales.

## 5. Qué hacer en GitHub después de subir cambios

Abre las ejecuciones:

https://github.com/scasarrubia/scasarrubia.github.io/actions/workflows/deploy.yml

Comprueba que la ejecución del último commit termine con un **✓ verde**. Mientras esté en curso, el sitio puede seguir mostrando la versión anterior.

Cuando termine, abre el sitio y recarga con `Ctrl+Shift+R` si todavía ves contenido anterior.

En una actualización normal no necesitas modificar Settings, Pages, el dominio ni No-IP.

Para publicar manualmente, por ejemplo después de cambiar una variable sin modificar código:

1. Abre el enlace de ejecuciones anterior, fuera de Settings.
2. Selecciona **Run workflow**.
3. Selecciona la rama `main`.
4. Pulsa el botón **Run workflow** y espera el resultado.

## 6. Configurar las conexiones con Apps Script

### En tu computadora

Los valores reales están en `.env.local`, en la raíz del proyecto. `.env.example` sirve de referencia y no se carga como configuración real.

```dotenv
VITE_SCHOOL_CALENDAR_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
VITE_WEEKLY_AGENDA_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
VITE_PROJECTS_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
VITE_NEWS_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
VITE_INSTITUTIONAL_DOCUMENTS_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
VITE_ALERTS_URL=https://script.google.com/macros/s/IDENTIFICADOR/exec
```

Cada servicio tiene su propia URL. No copies literalmente `IDENTIFICADOR`: usa la URL de su implementación. Las direcciones de producción terminan en `/exec`, no en `/dev`.

### En GitHub

En el repositorio entra en **Settings → Secrets and variables → Actions → Variables → New repository variable**.

Crea cada variable con dos campos separados:

- **Name:** por ejemplo, `VITE_PROJECTS_URL`.
- **Value:** únicamente la URL correspondiente, sin comillas ni `NOMBRE=`.

Los valores deben coincidir con `.env.local`. No crees un Environment con el nombre de cada variable.

El archivo `.github/workflows/deploy.yml` ya pasa estas variables al paso de compilación. Si agregas una nueva variable utilizada por el sitio, también debes incorporarla a ese archivo.

Para usar Google Calendar directamente existen las variables opcionales `VITE_GOOGLE_CALENDAR_ID` y `VITE_GOOGLE_CALENDAR_API_KEY`. Cuando ambas tienen valor, el código da prioridad a Google Calendar sobre `VITE_SCHOOL_CALENDAR_URL`. Usa una clave restringida para el servicio y los dominios autorizados.

Los valores `VITE_*` se incorporan al JavaScript público. No deben contener contraseñas, tokens privados ni credenciales de cuentas de servicio. Guardarlos como secretos de GitHub no evita que se vean si el sitio los incluye en el navegador.

Cambiar una variable en GitHub requiere una nueva publicación; no modifica los archivos del sitio ya compilado.

## 7. Actualizar Apps Script y archivos de Drive

Los archivos `docs/apps-script-*.js` son copias del código de referencia. Modificarlos y subirlos a GitHub **no actualiza automáticamente** los proyectos de Google Apps Script.

Para cambiar una API:

1. Abre el proyecto correspondiente en Google Apps Script.
2. Modifica y guarda su código.
3. En **Implementar → Gestionar implementaciones**, edita la aplicación web y selecciona una nueva versión.
4. Para las consultas públicas del portal, comprueba que se ejecute como el propietario y permita acceso a cualquier persona, según las opciones y políticas de la cuenta.
5. Prueba su URL `/exec` en incógnito: debe devolver los datos esperados, sin pedir iniciar sesión.
6. Si la URL cambia, actualiza `.env.local` y la variable de GitHub, y vuelve a publicar el sitio.

No necesitas hacer pública la hoja de Sheets si Apps Script se ejecuta con una cuenta que puede leerla. Revisa que la respuesta de la API contenga solo la información destinada al portal.

### Fotos de noticias y Galería

La Galería (`/galeria`) no tiene una fuente propia: cada noticia con fotos se convierte en un álbum. Las fotos se suben en el formulario de noticias.

- El script de noticias junta las imágenes de **todas** las columnas cuyo título contenga "evidencia", "foto" o "imagen". Google Forms admite máximo 10 archivos por pregunta de carga; para más fotos, agrega otra pregunta de carga (por ejemplo, "Más fotos (opcional)").
- El script comparte cada foto como "Cualquier persona con el enlace" y lo recuerda en caché 6 horas. La respuesta completa se guarda en caché 5 minutos: una noticia nueva puede tardar hasta 5 minutos en aparecer. Para verla de inmediato, ejecuta la función `limpiarCache` desde el editor o abre la URL `/exec?nocache=1`.
- El detalle de noticia muestra hasta 4 fotos y enlaza al álbum completo. Las miniaturas se piden a Drive en tamaño reducido y la foto grande solo se descarga al ampliarla.
- `index.html` incluye `<meta name="referrer" content="no-referrer">`: sin ella, Google rechaza las fotos de Drive cuando se muestran en otro sitio.

Los archivos de Drive enlazados desde el portal tienen permisos independientes. Para un documento destinado al público, configura **Compartir → Acceso general → Cualquier persona con el enlace → Lector**. Comprueba también que la descarga esté permitida si se ofrece ese botón. Las políticas de una cuenta institucional pueden limitar estas opciones.

## 8. Configuración de publicación y dominio

La configuración esperada en GitHub es:

- Rama predeterminada: `main`.
- **Settings → Pages → Source:** `GitHub Actions`.
- Environment de despliegue: `github-pages`, con reglas que permitan publicar desde `main`.
- **Settings → Pages → Custom domain:** `ineprav.ddns.net`.
- HTTPS activado cuando GitHub haya validado el dominio y emitido el certificado.

Si el hostname de No-IP está configurado como CNAME, su destino debe ser `scasarrubia.github.io`, sin `https://` ni rutas. Esta guía no verifica ni modifica el DNS de la cuenta. Conserva vigente el hostname y atiende los avisos de renovación o confirmación que correspondan a tu plan.

## 9. Solución de problemas frecuentes

| Problema | Qué revisar |
| --- | --- |
| Funciona localmente, pero faltan noticias, proyectos o documentos en internet | Variables de GitHub, sus valores y que la última versión de `deploy.yml` esté subida; después volver a publicar |
| Los botones de proyectos están desactivados | Los proyectos locales de respaldo tienen enlaces vacíos; revisar el aviso de error y `VITE_PROJECTS_URL` |
| Drive pide acceso | Abrir el enlace original en incógnito y revisar los permisos de ese archivo |
| La API pide iniciar sesión | Acceso de la implementación de Apps Script y uso de `/exec` |
| Error `main is not allowed to deploy` | **Settings → Environments → github-pages → Deployment branches and tags**: permitir `main` |
| GitHub Actions aparece en rojo | Abrir la ejecución y el paso fallido; corregir su mensaje antes de volver a publicar |
| El sitio sigue mostrando la versión anterior | Esperar el ✓ verde del último commit y recargar con `Ctrl+Shift+R` |
| Cambié Sheets, pero sigo viendo los datos anteriores | Recargar el sitio; noticias y alertas se mantienen en memoria durante la sesión abierta |
| Aparece `/#` en la dirección | Es el funcionamiento previsto del enrutador; no es un error |

## 10. Ubicación del código principal

| Carpeta o archivo | Contenido |
| --- | --- |
| `src/pages/` | Páginas del sitio |
| `src/components/layout/` | Encabezado, presentación y pie de página |
| `src/components/shared/SiteAlerts.vue` | Ventana de alertas |
| `src/composables/` | Consultas y normalización de datos de las APIs |
| `src/constants/` | Datos locales de respaldo |
| `src/utils/newsOrder.js` | Orden de las noticias |
| `src/router/index.js` | Rutas y títulos del encabezado de cada sección |
| `src/styles/tailwind.css` y `public/css/institucional.css` | Estilos generales |
| `public/` | Imágenes, audio y documentos estáticos |
| `docs/` | Código de referencia de Apps Script |
| `.env.local` | Configuración local; no se sube a GitHub |
| `.github/workflows/deploy.yml` | Compilación y publicación automática |
