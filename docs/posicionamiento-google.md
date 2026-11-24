# Posicionamiento en Google

Nombre usado en el sitio: **Institución Educativa Padre Roberto Arroyave Vélez**, San Pedro de los Milagros, Antioquia, Colombia.

## Preparación incluida

La portada contiene título, descripción, URL canónica, metadatos para compartir y datos estructurados de tipo School. `public/robots.txt` permite el rastreo e indica el sitemap. `public/sitemap.xml` incluye únicamente la portada.

El enrutador usa fragmentos (`/#/noticias`). Google desaconseja este mecanismo para descubrir páginas independientes. No agregar esas rutas al sitemap ni cambiar solamente a `createWebHistory()`: primero hay que preparar páginas HTML por ruta que GitHub Pages pueda servir con respuesta 200 al abrirlas directamente. Una siguiente mejora es generar páginas estáticas para institución, contacto y noticias; cada una debe tener contenido, título y URL canónica propios. Las noticias provenientes de Sheets necesitarán regeneración para mantener actualizadas esas páginas estáticas.

## Registrar el sitio en Search Console

1. Publicar los cambios y comprobar que abran `https://ineprav.ddns.net/robots.txt` y `https://ineprav.ddns.net/sitemap.xml`.
2. Entrar en https://search.google.com/search-console/ con la cuenta que administrará el sitio.
3. Agregar una propiedad de **Prefijo de URL**: `https://ineprav.ddns.net/`, sin `#`.
4. Elegir verificación mediante archivo HTML. Descargar el archivo de Google y colocarlo, sin cambiar su nombre ni contenido, dentro de `public/`.
5. Hacer commit y push. Esperar el despliegue correcto, abrir la URL del archivo en el dominio y pulsar Verificar en Search Console.
6. Conservar el archivo de verificación en el proyecto después de verificar.
7. En Sitemaps enviar `sitemap.xml`.
8. En Inspección de URLs introducir `https://ineprav.ddns.net/`, probar la URL publicada y solicitar indexación si la herramienta lo permite.
9. Revisar posteriormente los informes de indexación y rendimiento para conocer consultas, impresiones y clics.

## Contenido y presencia institucional

- Usar el mismo nombre completo y municipio en la portada, contacto y perfiles institucionales.
- Mantener actualizados dirección, teléfono, correo y canales de atención. La página de contacto muestra canales directos (teléfono, correo, dirección con mapa y Facebook); no tiene formulario.
- Mantener noticias originales con títulos descriptivos, fecha y contexto de las actividades.
- Solicitar que los perfiles y directorios oficiales de la institución, la Alcaldía y entidades educativas enlacen al dominio correcto cuando corresponda.
- Si existe un perfil de la institución en Google Maps, comprobar que su web sea la correcta mediante una cuenta autorizada.
- Mantener activo el dominio de No-IP y HTTPS.

La indexación y la posición dependen de Google. Un sitemap y una solicitud de indexación ayudan al descubrimiento, pero no garantizan aparición ni primer lugar.

## Referencias

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://support.google.com/webmasters/answer/34592
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
