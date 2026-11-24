<script setup>
import {
  ArrowRight,
  BookOpenCheck,
  Camera,
  Compass,
  GraduationCap,
  HeartHandshake,
  Microscope,
  School,
  Sprout,
  UsersRound
} from '@lucide/vue';

// Colors match the levels on the home page explorer.
const schoolGroups = [
  {
    title: 'Preescolar',
    grades: 'Transición',
    description: 'Niñas y niños que inician su trayectoria escolar mediante experiencias de juego, arte, literatura y exploración.',
    icon: School,
    accent: '#e5b54b',
    soft: '#fbf3dc'
  },
  {
    title: 'Básica primaria',
    grades: '1.° a 5.°',
    description: 'Grupos acompañados en procesos de lectura, pensamiento lógico, convivencia y exploración del entorno.',
    icon: BookOpenCheck,
    accent: '#3f9b6a',
    soft: '#e3f3e9'
  },
  {
    title: 'Básica secundaria',
    grades: '6.° a 9.°',
    description: 'Estudiantes que fortalecen autonomía, pensamiento crítico, participación y proyectos escolares.',
    icon: UsersRound,
    accent: '#2f7fa6',
    soft: '#e1eff6'
  },
  {
    title: 'Media académica',
    grades: '10.° y 11.°',
    description: 'Jóvenes que proyectan su futuro académico, ciudadano y comunitario desde sus intereses y talentos.',
    icon: GraduationCap,
    accent: '#8a5aa8',
    soft: '#f1e8f6'
  }
];

const staffMembers = [
  {
    name: 'Equipo directivo',
    role: 'Rectoría y coordinación',
    description: 'Lidera los procesos institucionales, pedagógicos y administrativos para acompañar a toda la comunidad educativa.',
    icon: Compass,
    image: '/images/img_hero.webp'
  },
  {
    name: 'Docentes de preescolar y primaria',
    role: 'Acompañamiento inicial y básico',
    description: 'Orientan experiencias de aprendizaje cercanas, afectivas y significativas en los primeros años escolares.',
    icon: Sprout,
    image: '/images/img_hero_1.webp'
  },
  {
    name: 'Docentes de secundaria y media',
    role: 'Áreas académicas y proyectos',
    description: 'Fortalecen competencias, proyectos de vida, investigación escolar y participación estudiantil.',
    icon: Microscope,
    image: '/images/parallax.webp'
  },
  {
    name: 'Personal administrativo y de apoyo',
    role: 'Gestión y bienestar institucional',
    description: 'Acompaña la operación diaria, la atención a familias y el cuidado de los espacios escolares.',
    icon: HeartHandshake,
    image: '/images/img_hero_2.webp'
  }
];
</script>

<template>
  <main class="people-page">
    <div class="people-container">
      <section class="people-intro">
        <p v-reveal="'down'" class="section-kicker">Nuestra gente</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Rostros, grupos y comunidad educativa</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Un espacio para reconocer a estudiantes, docentes, directivos y personal de apoyo que hacen posible la vida
          institucional cada día.
        </p>
      </section>

      <section class="people-section" aria-labelledby="school-groups-title">
        <div v-reveal="'up'" class="people-section__heading">
          <p class="section-kicker">Grupos</p>
          <h2 id="school-groups-title">Trayectoria escolar</h2>
          <p>Un recorrido que acompaña a nuestros estudiantes desde sus primeros pasos hasta su graduación.</p>
        </div>

        <ol class="journey">
          <li
            v-for="(group, index) in schoolGroups"
            :key="group.title"
            v-reveal="{ direction: 'up', delay: 80 + index * 120 }"
            class="journey__step"
            :style="{ '--accent': group.accent, '--soft': group.soft }">
            <span class="journey__node" aria-hidden="true">
              <component :is="group.icon" />
            </span>
            <article class="journey__card">
              <span class="journey__grades">{{ group.grades }}</span>
              <h3>{{ group.title }}</h3>
              <p>{{ group.description }}</p>
            </article>
          </li>
        </ol>
      </section>
    </div>

    <section class="people-staff" aria-labelledby="staff-title">
      <div class="people-container">
        <div v-reveal="'up'" class="people-section__heading">
          <p class="section-kicker">Equipo humano</p>
          <h2 id="staff-title">Docentes y servidores institucionales</h2>
          <p>Personas comprometidas con la formación, el cuidado y el bienestar de cada estudiante.</p>
        </div>

        <div class="staff-grid">
          <article
            v-for="(member, index) in staffMembers"
            :key="member.name"
            v-reveal="{ direction: index % 2 === 0 ? 'left' : 'right', delay: 90 + index * 80 }"
            class="staff-card">
            <div class="staff-card__photo" :style="{ backgroundImage: `url(${member.image})` }">
              <span class="staff-card__icon">
                <component :is="member.icon" aria-hidden="true" />
              </span>
            </div>
            <div class="staff-card__content">
              <span class="staff-card__role">{{ member.role }}</span>
              <h3>{{ member.name }}</h3>
              <p>{{ member.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="people-container">
      <section v-reveal="'up'" class="people-note">
        <img class="people-note__crest" src="/images/escudo.webp" alt="" aria-hidden="true" />
        <span class="people-note__icon"><Camera aria-hidden="true" /></span>
        <div class="people-note__body">
          <p class="section-kicker">Próxima actualización</p>
          <h2>Galería institucional de docentes y grupos</h2>
          <p>
            Esta sección está preparada para incorporar fotografías, presentaciones de docentes, grados, sedes y grupos
            institucionales a medida que se consolide la información oficial.
          </p>
        </div>
        <RouterLink to="/noticias" class="people-note__link">
          Ver noticias y galerías <ArrowRight aria-hidden="true" />
        </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
.people-page {
  background: #f7f8f4;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3.5rem 0 4.5rem;
}

.people-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.people-intro,
.people-section__heading {
  margin: 0 auto 2.5rem;
  max-width: 52rem;
  text-align: center;
}

.section-kicker {
  color: #8b6418;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .08em;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.people-intro h1,
.people-section__heading h2,
.people-note h2,
.journey__card h3,
.staff-card h3 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
}

.people-intro h1,
.people-section__heading h2 {
  line-height: 1.12;
  margin: 0;
  padding-bottom: .8rem;
  position: relative;
}

.people-intro h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.people-section__heading h2 {
  font-size: clamp(1.75rem, 4vw, 2.4rem);
}

.people-intro h1::after,
.people-section__heading h2::after {
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

.people-intro > p:last-child,
.people-section__heading > p:last-child {
  color: #42554f;
  line-height: 1.65;
  margin: 1rem 0 0;
}

.people-section {
  margin-top: 1rem;
}

/* ---- Journey timeline ---- */
.journey {
  display: grid;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.journey__step {
  position: relative;
}

.journey__node {
  align-items: center;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 6px #f7f8f4, 0 0 0 8px var(--accent), 0 10px 22px rgba(18, 60, 53, .18);
  color: #fff;
  display: flex;
  height: 4rem;
  justify-content: center;
  position: relative;
  transition: transform .3s ease;
  width: 4rem;
  z-index: 1;
}

.journey__node svg {
  height: 1.8rem;
  width: 1.8rem;
}

.journey__step:first-child .journey__node {
  color: #123c35;
}

.journey__card {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 16px;
  border-top: 4px solid var(--accent);
  box-shadow: 0 14px 34px rgba(18, 60, 53, .08);
  padding: 1.4rem;
  transition: transform .3s ease, box-shadow .3s ease;
}

.journey__step:hover .journey__card {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .15);
  transform: translateY(-4px);
}

.journey__step:hover .journey__node {
  transform: scale(1.08) rotate(-6deg);
}

.journey__grades {
  background: var(--soft);
  border-radius: 999px;
  color: #123c35;
  display: inline-block;
  font-size: .75rem;
  font-weight: 700;
  margin-bottom: .6rem;
  padding: .2rem .7rem;
}

.journey__card h3 {
  font-size: 1.25rem;
  line-height: 1.25;
  margin: 0 0 .5rem;
}

.journey__card p {
  color: #42554f;
  font-size: .95rem;
  line-height: 1.6;
  margin: 0;
}

/* Mobile: vertical line on the left. */
@media (max-width: 899px) {
  /* Each segment runs from this node's center to the next one (gap 1.25rem + half node 2rem). */
  .journey__step:not(:last-child)::before {
    background: var(--accent);
    bottom: -3.25rem;
    content: "";
    left: 1.9rem;
    position: absolute;
    top: 2rem;
    width: 4px;
  }

  .journey__step {
    align-items: flex-start;
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 4rem minmax(0, 1fr);
  }
}

/* Desktop: horizontal line connecting the nodes. */
@media (min-width: 900px) {
  .journey {
    gap: 1.25rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .journey::before {
    background: linear-gradient(90deg, #e5b54b, #3f9b6a, #2f7fa6, #8a5aa8);
    border-radius: 2px;
    content: "";
    height: 4px;
    left: 12.5%;
    position: absolute;
    right: 12.5%;
    top: 1.9rem;
  }

  .journey__node {
    margin: 0 auto 1.75rem;
  }

  .journey__card {
    height: calc(100% - 5.75rem);
    text-align: center;
  }
}

/* ---- Staff ---- */
.people-staff {
  background: #fff;
  margin-top: 4rem;
  padding: 4rem 0;
}

.staff-grid {
  display: grid;
  gap: 1.25rem;
}

.staff-card {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(18, 60, 53, .08);
  display: grid;
  overflow: hidden;
  transition: transform .3s ease, box-shadow .3s ease;
}

.staff-card:hover {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .16);
  transform: translateY(-4px);
}

.staff-card__photo {
  align-items: flex-end;
  background-position: center;
  background-size: cover;
  display: flex;
  min-height: 10rem;
  padding: 1rem;
  position: relative;
}

.staff-card__photo::before {
  background: linear-gradient(160deg, rgba(6, 45, 38, .35), rgba(6, 45, 38, .85));
  content: "";
  inset: 0;
  position: absolute;
  transition: opacity .3s ease;
}

.staff-card:hover .staff-card__photo::before {
  opacity: .8;
}

.staff-card__icon {
  align-items: center;
  background: #e5b54b;
  border-radius: 14px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, .25);
  color: #123c35;
  display: flex;
  height: 3.25rem;
  justify-content: center;
  position: relative;
  transition: transform .3s ease;
  width: 3.25rem;
}

.staff-card:hover .staff-card__icon {
  transform: rotate(-8deg) scale(1.08);
}

.staff-card__icon svg {
  height: 1.6rem;
  width: 1.6rem;
}

.staff-card__content {
  padding: 1.4rem 1.5rem 1.6rem;
}

.staff-card__role {
  color: #8b6418;
  display: block;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .06em;
  margin-bottom: .4rem;
  text-transform: uppercase;
}

.staff-card h3 {
  font-size: 1.3rem;
  line-height: 1.25;
  margin: 0 0 .6rem;
}

.staff-card p {
  color: #42554f;
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 768px) {
  .staff-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .staff-card {
    grid-template-columns: 11rem minmax(0, 1fr);
  }
}

/* ---- Gallery note ---- */
.people-note {
  align-items: center;
  background: linear-gradient(135deg, #0b4a3d, #123c35 55%, #0d2f2a);
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(18, 60, 53, .2);
  color: #fff;
  display: grid;
  gap: 1.25rem;
  margin-top: 4rem;
  overflow: hidden;
  padding: 2rem;
  position: relative;
}

.people-note__crest {
  bottom: -4rem;
  height: auto;
  opacity: .08;
  pointer-events: none;
  position: absolute;
  right: -3rem;
  width: 18rem;
}

.people-note__icon {
  align-items: center;
  background: rgba(229, 181, 75, .18);
  border: 1px solid rgba(229, 181, 75, .45);
  border-radius: 16px;
  color: #f3d87c;
  display: flex;
  height: 4rem;
  justify-content: center;
  position: relative;
  width: 4rem;
}

.people-note__icon svg {
  height: 2rem;
  width: 2rem;
}

.people-note__body {
  position: relative;
}

.people-note .section-kicker {
  color: #f3d87c;
}

.people-note h2 {
  color: #fff;
  font-size: clamp(1.4rem, 3vw, 1.85rem);
  line-height: 1.2;
  margin: 0 0 .6rem;
}

.people-note p:not(.section-kicker) {
  color: rgba(255, 255, 255, .82);
  line-height: 1.65;
  margin: 0;
}

.people-note__link {
  align-items: center;
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-weight: 700;
  gap: .5rem;
  justify-self: start;
  padding: .8rem 1.4rem;
  position: relative;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
  white-space: nowrap;
}

.people-note__link svg {
  height: 1.1rem;
  transition: transform .2s ease;
  width: 1.1rem;
}

.people-note__link:hover,
.people-note__link:focus-visible {
  background: #f3d06f;
  transform: translateY(-2px);
}

.people-note__link:hover svg {
  transform: translateX(.2rem);
}

.people-note__link:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

@media (min-width: 900px) {
  .people-note {
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .journey__card,
  .journey__node,
  .staff-card,
  .staff-card__icon,
  .people-note__link {
    transition: none;
  }

  .journey__step:hover .journey__card,
  .journey__step:hover .journey__node,
  .staff-card:hover,
  .staff-card:hover .staff-card__icon {
    transform: none;
  }
}

@media (max-width: 520px) {
  .people-note {
    padding: 1.5rem;
  }

  .people-note__link {
    justify-content: center;
    white-space: normal;
    width: 100%;
  }
}
</style>
