<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const activeSymbol = ref(null);

function openSymbolModal(symbol) {
  activeSymbol.value = symbol;
}

function closeSymbolModal() {
  activeSymbol.value = null;
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeSymbolModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <main data-page="institution">
    <div data-container>
      <section data-page-intro>
        <p v-reveal="'down'" data-kicker>Nuestra institución</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Identidad, memoria y sentido educativo</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Conoce la historia, misión, visión, símbolos y principios que orientan la vida institucional de la
          Institución Educativa Padre Roberto Arroyave Vélez.
        </p>
      </section>

      <section data-layout="intro">
        <article v-reveal="'left'" data-card="content">
          <p data-kicker>Identidad institucional</p>
          <h2>Quiénes somos</h2>
          <p>
            La Institución Educativa Padre Roberto Arroyave Vélez nació en el año 2009 como respuesta al compromiso del
            municipio de San Pedro de los Milagros con una educación pública de calidad. Desde entonces ha consolidado
            un proyecto educativo centrado en la formación integral de niños, niñas y jóvenes, fortaleciendo procesos
            académicos, científicos, culturales y humanos que contribuyen al desarrollo del territorio.
          </p>
          <p>
            A lo largo de su trayectoria, la institución ha evolucionado de acuerdo con las necesidades de la comunidad
            educativa, promoviendo espacios de aprendizaje donde el conocimiento, la convivencia y la innovación se
            convierten en herramientas para construir proyectos de vida y aportar positivamente a la sociedad.
          </p>
        </article>

        <aside v-reveal="{ direction: 'right', delay: 120 }" data-panel="summary">
          <h3>Contenido de esta sección</h3>
          <ul>
            <li>Misión y visión</li>
            <li>Símbolos institucionales</li>
            <li>Historia</li>
            <li>Valores y filosofía</li>
            <li>Equipo directivo</li>
          </ul>
        </aside>
      </section>

      <section data-parallax-band="main" aria-label="Paisaje institucional"></section>

      <section data-layout="mission">
        <article v-reveal="'left'" data-card="content">
          <h3>Misión</h3>
          <p>
            Formar personas íntegras mediante una educación de calidad que fortalezca el desarrollo académico,
            científico, tecnológico, ético y humano, promoviendo el pensamiento crítico, la responsabilidad social, el
            respeto por la diversidad y la construcción permanente de proyectos de vida orientados al servicio de la
            comunidad.
          </p>
        </article>

        <article v-reveal="{ direction: 'right', delay: 120 }" data-card="content">
          <h3>Visión</h3>
          <p>
            Ser reconocida como una institución educativa líder en la formación integral de ciudadanos competentes,
            innovadores y comprometidos con el desarrollo sostenible de su entorno, consolidando una cultura académica
            fundamentada en la excelencia, la investigación, la convivencia y el uso responsable del conocimiento para
            transformar la realidad.
          </p>
        </article>
      </section>

      <section data-parallax-band="compact" aria-label="Entorno institucional"></section>

      <section data-section="symbols">
        <div v-reveal="'up'" data-section-header>
          <p data-kicker>Símbolos</p>
          <h2>Símbolos institucionales</h2>
        </div>

        <div data-layout="symbols">
          <article v-reveal="{ direction: 'left', delay: 80 }" data-card="symbol" data-interactive>
            <button type="button" data-symbol-button @click="openSymbolModal('crest')">
              <img
                data-symbol-crest
                src="/images/escudo.webp"
                alt="Escudo de la Institución Educativa Padre Roberto Arroyave Vélez" />
              <h3>Escudo</h3>
              <p>Representa el lema institucional: Dios, superación y ciencia.</p>
              <small>Ver en grande</small>
            </button>
          </article>

          <article v-reveal="{ direction: 'up', delay: 180 }" data-card="symbol" data-interactive>
            <button type="button" data-symbol-button @click="openSymbolModal('flag')">
              <img
                data-symbol-flag
                src="/images/bandera.webp"
                alt="Bandera de la Institución Educativa Padre Roberto Arroyave Vélez" />
              <h3>Bandera</h3>
              <p>Sus colores representan lealtad, luz, naturaleza y esperanza.</p>
              <small>Ver en grande</small>
            </button>
          </article>

          <article v-reveal="{ direction: 'right', delay: 280 }" data-card="symbol">
            <div data-symbol-mark>
              H
            </div>
            <h3>Himno</h3>
            <p>Escucha el himno institucional y consulta su letra.</p>
            <div data-anthem-player>
              <audio controls preload="metadata" src="/audio/himno.mp3">
                Tu navegador no permite reproducir audio desde esta página.
              </audio>
              <button type="button" data-anthem-lyrics-button @click="openSymbolModal('anthem')">
                Ver letra
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>

  <Teleport to="body">
    <div v-if="activeSymbol" data-modal @click.self="closeSymbolModal">
      <section
        data-modal-dialog
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${activeSymbol}-modal-title`">
        <button data-modal-close type="button" aria-label="Cerrar modal" @click="closeSymbolModal">
          ×
        </button>

        <p data-kicker>Símbolo institucional</p>
        <h2 :id="`${activeSymbol}-modal-title`">
          {{
            activeSymbol === 'crest'
              ? 'Escudo institucional'
              : activeSymbol === 'flag'
                ? 'Bandera institucional'
                : 'Himno institucional'
          }}
        </h2>

        <img
          v-if="activeSymbol === 'crest'"
          data-crest-preview
          src="/images/escudo.webp"
          alt="Escudo de la Institución Educativa Padre Roberto Arroyave Vélez" />

        <img
          v-else-if="activeSymbol === 'flag'"
          data-flag-preview
          src="/images/bandera.webp"
          alt="Bandera de la Institución Educativa Padre Roberto Arroyave Vélez" />

        <template v-if="activeSymbol === 'crest'">
          <p>
            Manos que expresan la superación. La llama representa a Dios y la iluminación de las jóvenes mentes por medio
            de la educación, figurada en el libro.
          </p>
          <p>
            Todos estos tres símbolos están enmarcados en unas montañas que representan el paisaje verde y hermoso que
            custodian al Municipio de San Pedro de los Milagros en Antioquia, bajo un cielo azul tranquilo y protector;
            enunciando el lema "DIOS, SUPERACIÓN Y CIENCIA."
          </p>
        </template>
        <template v-else-if="activeSymbol === 'flag'">
          <p>
            Azul rey: simboliza la lealtad, la confianza, la sabiduría, la inteligencia, la fe y la verdad.
          </p>
          <p>
            Blanco: representa la luz, la bondad, la pureza, la perfección y la paz.
          </p>
          <p>
            Verde: simboliza el color de la naturaleza por excelencia. Representa armonía, crecimiento y esperanza.
          </p>
        </template>
        <template v-else>
          <div data-anthem-modal-player>
            <audio controls preload="metadata" src="/audio/himno.mp3">
              Tu navegador no permite reproducir audio desde esta página.
            </audio>
          </div>
          <div data-anthem-lyrics>
            <section>
              <h3>Coro</h3>
              <p>
                Por los campos gloriosos caminos<br>
                Voy en busca de hallar la verdad<br>
                Con amor y constancia yo estudio<br>
                Es mi Dios quién vigila mi andar.
              </p>
            </section>

            <section>
              <h3>I</h3>
              <p>
                La mañana se viste de gloria,<br>
                Voy feliz a mi escuela a estudiar<br>
                Un maestro me da la sapienza y<br>
                Me enseña constante a triunfar.
              </p>
            </section>

            <section>
              <h3>Coro</h3>
              <p>
                Por los campos gloriosos caminos<br>
                Voy en busca de hallar la verdad<br>
                Con amor y constancia yo estudio<br>
                Es mi Dios quién vigila mi andar.
              </p>
            </section>

            <section>
              <h3>II</h3>
              <p>
                Somos todas las mismas familias<br>
                Anhelosas de siempre luchar<br>
                Con la estrella que alumbra mi alma,<br>
                El saber voy a poder lograr.
              </p>
            </section>

            <section>
              <h3>Coro</h3>
              <p>
                Por los campos gloriosos caminos<br>
                Voy en busca de hallar la verdad<br>
                Con amor y constancia yo estudio<br>
                Es mi Dios quién vigila mi andar.
              </p>
            </section>

            <section>
              <h3>III</h3>
              <p>
                Es la herencia del Padre Arroyave<br>
                Nuestra ruta de amor y de paz<br>
                El deporte y los buenos modales<br>
                No hace la persona ideal.
              </p>
            </section>

            <section>
              <h3>Coro</h3>
              <p>
                Por los campos gloriosos caminos<br>
                Voy en busca de hallar la verdad<br>
                Con amor y constancia yo estudio<br>
                Es mi Dios quién vigila mi andar.
              </p>
            </section>

            <p data-anthem-credit>
              Año: 1999<br>
              Música y arreglo: Francisco Sierra
            </p>
          </div>
        </template>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
[data-page="institution"] {
  background: #f7f8f4;
  color: #1f2f2b;
  padding: 3rem 0;
}

[data-container] {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

[data-breadcrumb] {
  color: #123c35;
  font-size: .875rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

[data-breadcrumb] a {
  color: #123c35;
  text-decoration: underline;
}

[data-breadcrumb] a:hover,
[data-breadcrumb] a:focus {
  color: #e5b54b;
}

[data-breadcrumb] span {
  color: rgba(31, 47, 43, .5);
  margin-left: .5rem;
}

[data-page-intro] {
  margin: 0 auto 2rem;
  max-width: 50rem;
  text-align: center;
}

[data-page-intro] h1 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  margin: 0;
}

[data-page-intro] p:last-child {
  line-height: 1.65;
  margin: .85rem 0 0;
}

[data-layout="intro"],
[data-layout="mission"],
[data-layout="symbols"] {
  display: grid;
  gap: 1.5rem;
}

[data-layout="mission"],
[data-section="symbols"] {
  margin-top: 2rem;
}

[data-parallax-band] {
  background:
    linear-gradient(rgba(18, 60, 53, .48), rgba(18, 60, 53, .48)),
    url("/images/parallax.webp") center / cover no-repeat;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  min-height: 16rem;
  margin-top: 2rem;
}

[data-parallax-band="compact"] {
  background-image:
    linear-gradient(rgba(18, 60, 53, .48), rgba(18, 60, 53, .48)),
    url("/images/parallax_1.webp");
  min-height: 11rem;
}

[data-card="content"],
[data-card="symbol"] {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  padding: 1.5rem;
}

[data-kicker] {
  color: #e5b54b;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

[data-card="content"] h2,
[data-section-header] h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

[data-card="content"] h3,
[data-panel="summary"] h3,
[data-card="symbol"] h3 {
  font-weight: 700;
  margin: 0 0 .75rem;
}

[data-card="content"] h3 {
  font-size: 1.5rem;
}

[data-card="content"] p,
[data-card="symbol"] p {
  color: rgba(31, 47, 43, .8);
  line-height: 1.65;
  margin: 0;
}

[data-card="content"] p + p {
  margin-top: 1rem;
}

[data-panel="summary"] {
  background: #123c35;
  border-radius: 6px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  color: #fff;
  padding: 1.5rem;
}

[data-panel="summary"] h3 {
  color: #e5b54b;
  font-size: 1.25rem;
}

[data-panel="summary"] ul {
  color: rgba(255, 255, 255, .86);
  display: grid;
  gap: .5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

[data-section-header] {
  margin-bottom: 1.5rem;
  text-align: center;
}

[data-section-header] h2 {
  margin-bottom: 0;
}

[data-card="symbol"] {
  text-align: center;
}

[data-card="symbol"][data-interactive] {
  padding: 0;
}

[data-symbol-button] {
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: block;
  height: 100%;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
}

[data-symbol-button]:focus {
  outline: 3px solid rgba(229, 181, 75, .45);
  outline-offset: -3px;
}

[data-symbol-button] small {
  color: #123c35;
  display: inline-block;
  font-weight: 700;
  margin-top: .75rem;
}

[data-symbol-mark],
[data-symbol-crest],
[data-symbol-flag] {
  align-items: center;
  background: #e7f0e8;
  border-radius: 999px;
  color: #123c35;
  display: flex;
  font-size: 1.875rem;
  font-weight: 700;
  height: 6rem;
  justify-content: center;
  margin: 0 auto 1rem;
  width: 6rem;
}

[data-symbol-flag] {
  background: #fff;
  border: 1px solid #dde6dc;
  display: block;
  object-fit: contain;
  padding: .35rem;
}

[data-symbol-crest] {
  background: #fff;
  border: 1px solid #dde6dc;
  display: block;
  object-fit: contain;
  padding: .35rem;
}

[data-card="symbol"] h3 {
  font-size: 1.25rem;
}

[data-anthem-player] {
  display: grid;
  gap: .85rem;
  margin-top: 1rem;
}

[data-anthem-player] audio,
[data-anthem-modal-player] audio {
  display: block;
  width: 100%;
}

[data-anthem-lyrics-button] {
  background: #e5b54b;
  border: 1px solid #e5b54b;
  border-radius: 6px;
  color: #123c35;
  cursor: pointer;
  font-weight: 800;
  min-height: 2.6rem;
  padding: 0 .9rem;
  transition: background .2s ease, border-color .2s ease, transform .2s ease;
}

[data-anthem-lyrics-button]:hover,
[data-anthem-lyrics-button]:focus {
  background: #f2c95d;
  border-color: #f2c95d;
  transform: translateY(-.08rem);
}

[data-anthem-modal-player] {
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  padding: 1rem;
}

[data-anthem-lyrics] {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

[data-anthem-lyrics] section {
  background: #f7f8f4;
  border-left: 4px solid #e5b54b;
  border-radius: 6px;
  padding: .9rem 1rem;
}

[data-anthem-lyrics] h3 {
  color: #123c35;
  font-size: .9rem;
  font-weight: 900;
  letter-spacing: 0;
  margin: 0 0 .45rem;
  text-transform: uppercase;
}

[data-modal] [data-anthem-lyrics] p {
  color: rgba(31, 47, 43, .86);
  line-height: 1.65;
  margin: 0;
}

[data-anthem-credit] {
  background: #123c35;
  border-radius: 6px;
  color: #fff;
  font-weight: 800;
  padding: .9rem 1rem;
  text-align: center;
}

[data-modal] {
  align-items: center;
  background: rgba(13, 47, 42, .78);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 100;
}

[data-modal-dialog] {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, .25);
  color: #1f2f2b;
  max-height: calc(100vh - 2rem);
  max-width: 44rem;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  scrollbar-color: #123c35 #e7f0e8;
  width: min(100%, 44rem);
}

[data-modal-close] {
  align-items: center;
  background: #123c35;
  border: 0;
  border-radius: 999px;
  color: #fff;
  display: flex;
  font-size: 1.5rem;
  height: 2.5rem;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 2.5rem;
}

[data-modal-close]:hover,
[data-modal-close]:focus {
  background: #e5b54b;
  color: #123c35;
}

[data-modal] h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 3rem 1.25rem 0;
}

[data-modal] p:not([data-kicker]) {
  color: rgba(31, 47, 43, .8);
  line-height: 1.65;
  margin: 1rem 0 0;
}

[data-flag-preview] {
  border: 1px solid #dde6dc;
  border-radius: 8px;
  display: block;
  max-height: 20rem;
  object-fit: contain;
  padding: 1rem;
  width: 100%;
}

[data-crest-preview] {
  border: 1px solid #dde6dc;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
  max-height: 20rem;
  max-width: min(100%, 22rem);
  object-fit: contain;
  padding: 1rem;
  width: 100%;
}

@media (min-width: 768px) {
  [data-parallax-band] {
    background-attachment: fixed;
    min-height: 20rem;
  }

  [data-parallax-band="compact"] {
    min-height: 13rem;
  }

  [data-layout="mission"] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  [data-layout="symbols"] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  [data-layout="intro"] {
    grid-template-columns: 1.2fr .8fr;
  }
}
</style>
