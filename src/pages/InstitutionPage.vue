<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowRight, Eye, Flag, Music, ScrollText, Target, ZoomIn } from '@lucide/vue';

// Only sections that actually exist on this page.
const pageSections = [
  { id: 'mision', label: 'Misión y visión', icon: Target },
  { id: 'simbolos', label: 'Símbolos institucionales', icon: Flag },
  { id: 'himno', label: 'Himno institucional', icon: Music }
];

// The router uses hash history, so "#id" links would change the route; scroll manually instead.
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  const headerHeight = document.getElementById('encabezado')?.offsetHeight ?? 0;
  const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
  window.scrollTo({ top, behavior: 'smooth' });
}

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
        <article v-reveal="'left'" data-card="content" data-card-intro>
          <span data-founded-badge aria-hidden="true">
            <small>Desde</small>
            <strong>2009</strong>
          </span>
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
          <img data-summary-crest src="/images/escudo.webp" alt="" aria-hidden="true" />
          <h3>En esta página</h3>
          <nav aria-label="Secciones de la página">
            <ul>
              <li v-for="section in pageSections" :key="section.id">
                <button type="button" @click="scrollToSection(section.id)">
                  <component :is="section.icon" aria-hidden="true" />
                  <span>{{ section.label }}</span>
                  <ArrowRight data-summary-arrow aria-hidden="true" />
                </button>
              </li>
            </ul>
          </nav>
          <dl data-summary-facts>
            <div><dt>Fundación</dt><dd>2009</dd></div>
            <div><dt>Naturaleza</dt><dd>Oficial</dd></div>
            <div><dt>Carácter</dt><dd>Mixto</dd></div>
            <div><dt>Ubicación</dt><dd>San Pedro de los Milagros, Antioquia</dd></div>
          </dl>
        </aside>
      </section>

      <section data-parallax-band="main" aria-labelledby="commitment-band-title">
        <div v-reveal="'up'" data-band-content>
          <p data-band-kicker>Nuestro compromiso</p>
          <p id="commitment-band-title" data-band-title>
            Educación pública de calidad para San Pedro de los Milagros
          </p>
        </div>
      </section>

      <section id="mision" data-layout="mission">
        <article v-reveal="'left'" data-card="content" data-card-purpose="mission">
          <span data-purpose-icon><Target aria-hidden="true" /></span>
          <h3>Misión</h3>
          <p>
            Formar personas íntegras mediante una educación de calidad que fortalezca el desarrollo académico,
            científico, tecnológico, ético y humano, promoviendo el pensamiento crítico, la responsabilidad social, el
            respeto por la diversidad y la construcción permanente de proyectos de vida orientados al servicio de la
            comunidad.
          </p>
        </article>

        <article v-reveal="{ direction: 'right', delay: 120 }" data-card="content" data-card-purpose="vision">
          <span data-purpose-icon><Eye aria-hidden="true" /></span>
          <h3>Visión</h3>
          <p>
            Ser reconocida como una institución educativa líder en la formación integral de ciudadanos competentes,
            innovadores y comprometidos con el desarrollo sostenible de su entorno, consolidando una cultura académica
            fundamentada en la excelencia, la investigación, la convivencia y el uso responsable del conocimiento para
            transformar la realidad.
          </p>
        </article>
      </section>

      <section data-parallax-band="compact" aria-label="Lema institucional">
        <p v-reveal="'zoom'" data-band-motto>Dios <span aria-hidden="true">·</span> Superación <span aria-hidden="true">·</span> Ciencia</p>
      </section>

      <section id="simbolos" data-section="symbols">
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
              <small><ZoomIn aria-hidden="true" /> Ver en grande</small>
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
              <small><ZoomIn aria-hidden="true" /> Ver en grande</small>
            </button>
          </article>

          <article id="himno" v-reveal="{ direction: 'right', delay: 280 }" data-card="symbol">
            <div data-symbol-mark>
              <Music aria-hidden="true" />
            </div>
            <h3>Himno</h3>
            <p>Escucha el himno institucional y consulta su letra.</p>
            <div data-anthem-player>
              <audio controls preload="metadata" src="/audio/himno.mp3">
                Tu navegador no permite reproducir audio desde esta página.
              </audio>
              <button type="button" data-anthem-lyrics-button @click="openSymbolModal('anthem')">
                <ScrollText aria-hidden="true" /> Ver letra
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>

  <Teleport to="body">
    <Transition name="symbol-modal">
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
    </Transition>
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

/* ---- Visual refresh ---- */
[data-page="institution"] {
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3.5rem 0 4.5rem;
}

[data-page="institution"] h1,
[data-page="institution"] h2,
[data-page="institution"] h3 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
}

[data-kicker] {
  color: #8b6418;
  font-size: .78rem;
  letter-spacing: .08em;
}

[data-page-intro] h1 {
  padding-bottom: .8rem;
  position: relative;
}

[data-page-intro] h1::after,
[data-section-header] h2::after {
  background: #e5b54b;
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 4px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: 3.5rem;
}

[data-section-header] h2 {
  padding-bottom: .8rem;
  position: relative;
}

[data-card="content"],
[data-card="symbol"],
[data-panel="summary"] {
  border-radius: 16px;
  box-shadow: 0 14px 34px rgba(18, 60, 53, .09);
}

[data-card="content"],
[data-card="symbol"] {
  border: 1px solid #e3e9e1;
  transition: transform .3s ease, box-shadow .3s ease;
}

[data-card="content"]:hover,
[data-card="symbol"]:hover {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .15);
  transform: translateY(-4px);
}

[data-card="content"] {
  padding: 2rem;
}

/* Intro card with founding-year badge. */
[data-card-intro] {
  border-left: 5px solid #07513e;
  position: relative;
}

[data-founded-badge] {
  align-items: center;
  background: linear-gradient(145deg, #e5b54b, #c8932a);
  border-radius: 50%;
  box-shadow: 0 10px 24px rgba(183, 124, 23, .35);
  color: #123c35;
  display: flex;
  flex-direction: column;
  height: 5.5rem;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: 1.5rem;
  top: -1.5rem;
  transform: rotate(8deg);
  width: 5.5rem;
}

[data-founded-badge] small {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}

[data-founded-badge] strong {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.45rem;
}

/* Summary panel turned into a section index. */
[data-panel="summary"] {
  background: linear-gradient(160deg, #0b4a3d, #123c35 60%, #0d2f2a);
  overflow: hidden;
  padding: 2rem;
  position: relative;
}

[data-summary-crest] {
  height: auto;
  opacity: .09;
  pointer-events: none;
  position: absolute;
  right: -3rem;
  bottom: -3rem;
  width: 16rem;
}

[data-panel="summary"] h3 {
  color: #f3d87c;
  font-size: 1.35rem;
  margin-bottom: 1rem;
  position: relative;
}

[data-panel="summary"] ul {
  gap: .6rem;
  position: relative;
}

[data-panel="summary"] button {
  align-items: center;
  background: rgba(255, 255, 255, .07);
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font: inherit;
  font-weight: 600;
  gap: .75rem;
  padding: .85rem 1rem;
  text-align: left;
  transition: background .2s ease, border-color .2s ease, transform .2s ease;
  width: 100%;
}

[data-panel="summary"] button svg {
  color: #f3d87c;
  flex-shrink: 0;
  height: 1.2rem;
  width: 1.2rem;
}

[data-panel="summary"] button span {
  flex: 1;
}

[data-summary-arrow] {
  opacity: .5;
  transition: transform .2s ease, opacity .2s ease;
}

[data-panel="summary"] button:hover,
[data-panel="summary"] button:focus-visible {
  background: rgba(229, 181, 75, .16);
  border-color: rgba(229, 181, 75, .5);
  transform: translateX(4px);
}

[data-panel="summary"] button:hover [data-summary-arrow] {
  opacity: 1;
  transform: translateX(3px);
}

[data-panel="summary"] button:focus-visible {
  outline: 3px solid #f3d87c;
  outline-offset: 2px;
}

[data-summary-facts] {
  border-top: 1px solid rgba(255, 255, 255, .14);
  display: grid;
  gap: .9rem 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 1.5rem 0 0;
  padding-top: 1.5rem;
  position: relative;
}

[data-summary-facts] dt {
  color: rgba(255, 255, 255, .6);
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

[data-summary-facts] dd {
  color: #fff;
  font-weight: 600;
  margin: .15rem 0 0;
}

/* Photo bands now carry a message. */
[data-parallax-band] {
  align-items: center;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  overflow: hidden;
  padding: 2.5rem 1.5rem;
  position: relative;
  text-align: center;
}

[data-parallax-band="main"] {
  background-image:
    linear-gradient(120deg, rgba(6, 45, 38, .88), rgba(18, 60, 53, .55) 60%, rgba(120, 88, 20, .55)),
    url("/images/parallax.webp");
}

[data-parallax-band="compact"] {
  background-image:
    linear-gradient(120deg, rgba(120, 88, 20, .6), rgba(18, 60, 53, .8)),
    url("/images/parallax_1.webp");
}

[data-band-content] {
  max-width: 44rem;
}

[data-band-kicker] {
  color: #f3d87c;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .18em;
  margin: 0 0 .75rem;
  text-transform: uppercase;
}

[data-band-title],
[data-band-motto] {
  color: #fff;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  text-shadow: 0 4px 18px rgba(0, 0, 0, .35);
}

[data-band-title] {
  font-size: clamp(1.6rem, 3.6vw, 2.6rem);
}

[data-band-motto] {
  font-size: clamp(1.5rem, 4vw, 2.6rem);
  letter-spacing: .02em;
}

[data-band-motto] span {
  color: #e5b54b;
  margin: 0 .35em;
}

/* Mission and vision. */
[data-layout="mission"] {
  margin-top: 2.5rem;
}

[data-card-purpose] {
  border-top: 5px solid #07513e;
  overflow: hidden;
  position: relative;
}

[data-card-purpose="vision"] {
  border-top-color: #e5b54b;
}

[data-purpose-icon] {
  align-items: center;
  background: #e7f0e8;
  border-radius: 14px;
  color: #07513e;
  display: inline-flex;
  height: 3.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  transition: transform .3s ease;
  width: 3.5rem;
}

[data-card-purpose="vision"] [data-purpose-icon] {
  background: #fbf3dc;
  color: #9a6c12;
}

[data-purpose-icon] svg {
  height: 1.75rem;
  width: 1.75rem;
}

[data-card-purpose]:hover [data-purpose-icon] {
  transform: rotate(-8deg) scale(1.08);
}

/* Symbols. */
[data-section="symbols"] {
  margin-top: 3rem;
}

[data-symbol-button] {
  align-items: center;
  display: flex;
  flex-direction: column;
  font: inherit;
  justify-content: flex-start;
  padding: 2rem 1.5rem;
}

[data-symbol-mark],
[data-symbol-crest],
[data-symbol-flag] {
  box-shadow: 0 0 0 6px #fff, 0 0 0 8px #e5b54b, 0 12px 24px rgba(18, 60, 53, .15);
  height: 7.5rem;
  margin-bottom: 1.5rem;
  margin-top: .5rem;
  transition: transform .35s ease;
  width: 7.5rem;
}

[data-symbol-mark] {
  background: linear-gradient(145deg, #07513e, #1e6350);
  color: #f3d87c;
}

[data-symbol-mark] svg {
  height: 3rem;
  width: 3rem;
}

[data-card="symbol"]:hover :is([data-symbol-mark], [data-symbol-crest], [data-symbol-flag]) {
  transform: scale(1.06);
}

[data-symbol-button] small {
  align-items: center;
  background: #e7f0e8;
  border-radius: 999px;
  display: inline-flex;
  gap: .4rem;
  padding: .35rem .85rem;
  transition: background .2s ease, color .2s ease;
}

[data-symbol-button] small svg {
  height: 1rem;
  width: 1rem;
}

[data-symbol-button]:hover small {
  background: #07513e;
  color: #fff;
}

[data-symbol-button]:focus {
  outline: none;
}

[data-symbol-button]:focus-visible {
  border-radius: 16px;
  outline: 3px solid #b3821c;
  outline-offset: -3px;
}

[data-card="symbol"]:not([data-interactive]) {
  padding: 2rem 1.5rem;
}

[data-anthem-lyrics-button] {
  font-family: inherit;
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  gap: .45rem;
  justify-content: center;
}

[data-anthem-lyrics-button] svg {
  height: 1.1rem;
  width: 1.1rem;
}

/* Modal (teleported to body, so it needs its own fonts). */
[data-modal] {
  backdrop-filter: blur(4px);
  font-family: 'Open Sans', Arial, sans-serif;
}

[data-modal] h2,
[data-modal] h3 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
}

[data-modal] [data-kicker] {
  font-family: 'Open Sans', Arial, sans-serif;
}

[data-modal-dialog] {
  border-radius: 18px;
  padding: 2rem;
}

[data-modal-close] {
  cursor: pointer;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

[data-modal-close]:hover {
  transform: rotate(90deg);
}

.symbol-modal-enter-active,
.symbol-modal-leave-active {
  transition: opacity .25s ease;
}

.symbol-modal-enter-active [data-modal-dialog],
.symbol-modal-leave-active [data-modal-dialog] {
  transition: transform .3s cubic-bezier(.22, 1, .36, 1);
}

.symbol-modal-enter-from,
.symbol-modal-leave-to {
  opacity: 0;
}

.symbol-modal-enter-from [data-modal-dialog],
.symbol-modal-leave-to [data-modal-dialog] {
  transform: translateY(1.5rem) scale(.96);
}

@media (min-width: 768px) {
  [data-parallax-band="main"] {
    min-height: 20rem;
  }
}

/* Fixed backgrounds stutter on touch devices. */
@media (hover: none), (max-width: 800px) {
  [data-parallax-band] {
    background-attachment: scroll;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-card="content"],
  [data-card="symbol"],
  [data-purpose-icon],
  [data-symbol-mark],
  [data-symbol-crest],
  [data-symbol-flag],
  [data-panel="summary"] button,
  .symbol-modal-enter-active,
  .symbol-modal-leave-active,
  .symbol-modal-enter-active [data-modal-dialog],
  .symbol-modal-leave-active [data-modal-dialog] {
    transition: none;
  }

  [data-card="content"]:hover,
  [data-card="symbol"]:hover,
  [data-panel="summary"] button:hover {
    transform: none;
  }

  [data-parallax-band] {
    background-attachment: scroll;
  }
}

@media (max-width: 520px) {
  [data-card="content"],
  [data-panel="summary"] {
    padding: 1.5rem;
  }

  [data-founded-badge] {
    height: 4.5rem;
    right: 1rem;
    top: -1.25rem;
    width: 4.5rem;
  }

  [data-founded-badge] strong {
    font-size: 1.15rem;
  }

  [data-card-intro] [data-kicker] {
    padding-right: 4.5rem;
  }
}
</style>
