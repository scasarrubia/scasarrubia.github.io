<script setup>
import { BookOpenCheck, GraduationCap, HeartHandshake, School, UsersRound } from '@lucide/vue';

const schoolGroups = [
  {
    title: 'Preescolar',
    description: 'Niñas y niños que inician su trayectoria escolar mediante experiencias de juego, arte, literatura y exploración.',
    icon: School
  },
  {
    title: 'Básica primaria',
    description: 'Grupos acompañados en procesos de lectura, pensamiento lógico, convivencia y exploración del entorno.',
    icon: BookOpenCheck
  },
  {
    title: 'Básica secundaria',
    description: 'Estudiantes que fortalecen autonomía, pensamiento crítico, participación y proyectos escolares.',
    icon: UsersRound
  },
  {
    title: 'Media académica',
    description: 'Jóvenes que proyectan su futuro académico, ciudadano y comunitario desde sus intereses y talentos.',
    icon: GraduationCap
  }
];

const staffMembers = [
  {
    name: 'Equipo directivo',
    role: 'Rectoría y coordinación',
    description: 'Lidera los procesos institucionales, pedagógicos y administrativos para acompañar a toda la comunidad educativa.'
  },
  {
    name: 'Docentes de preescolar y primaria',
    role: 'Acompañamiento inicial y básico',
    description: 'Orientan experiencias de aprendizaje cercanas, afectivas y significativas en los primeros años escolares.'
  },
  {
    name: 'Docentes de secundaria y media',
    role: 'Áreas académicas y proyectos',
    description: 'Fortalecen competencias, proyectos de vida, investigación escolar y participación estudiantil.'
  },
  {
    name: 'Personal administrativo y de apoyo',
    role: 'Gestión y bienestar institucional',
    description: 'Acompaña la operación diaria, la atención a familias y el cuidado de los espacios escolares.'
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
        <div v-reveal="'left'" class="people-section__heading">
          <p class="section-kicker">Grupos</p>
          <h2 id="school-groups-title">Trayectoria escolar</h2>
        </div>

        <div class="groups-grid">
          <article
            v-for="(group, index) in schoolGroups"
            :key="group.title"
            v-reveal="{ direction: index % 2 === 0 ? 'left' : 'right', delay: 80 + index * 80 }"
            class="group-card">
            <span>
              <component :is="group.icon" class="icon-spin-hover" aria-hidden="true" />
            </span>
            <h3>{{ group.title }}</h3>
            <p>{{ group.description }}</p>
          </article>
        </div>
      </section>

      <section class="people-section people-section--staff" aria-labelledby="staff-title">
        <div v-reveal="'up'" class="people-section__heading">
          <p class="section-kicker">Equipo humano</p>
          <h2 id="staff-title">Docentes y servidores institucionales</h2>
        </div>

        <div class="staff-grid">
          <article
            v-for="(member, index) in staffMembers"
            :key="member.name"
            v-reveal="{ direction: index % 3 === 0 ? 'left' : index % 3 === 1 ? 'up' : 'right', delay: 90 + index * 70 }"
            class="staff-card">
            <div class="staff-card__photo">
              <HeartHandshake class="icon-spin-hover" aria-hidden="true" />
            </div>
            <div class="staff-card__content">
              <span>{{ member.role }}</span>
              <h3>{{ member.name }}</h3>
              <p>{{ member.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section v-reveal="'up'" class="people-note">
        <UsersRound aria-hidden="true" />
        <div>
          <p class="section-kicker">Próxima actualización</p>
          <h2>Galería institucional de docentes y grupos</h2>
          <p>
            Esta sección está preparada para incorporar fotografías, presentaciones de docentes, grados, sedes y grupos
            institucionales a medida que se consolide la información oficial.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.people-page {
  background: #f7f8f4;
  color: #1f2f2b;
  padding: 3rem 0;
}

.people-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.people-intro,
.people-section__heading {
  margin: 0 auto 2rem;
  max-width: 52rem;
  text-align: center;
}

.section-kicker {
  color: #e5b54b;
  font-size: .875rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.people-intro h1,
.people-section__heading h2 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.08;
  margin: 0;
}

.people-section__heading h2 {
  font-size: clamp(1.75rem, 4vw, 2.6rem);
}

.people-intro p:last-child,
.people-note p:not(.section-kicker) {
  color: #42554f;
  line-height: 1.65;
  margin: .85rem 0 0;
}

.people-section {
  margin-top: 2.5rem;
}

.groups-grid,
.staff-grid {
  display: grid;
  gap: 1rem;
}

.group-card,
.staff-card,
.people-note {
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
}

.group-card {
  padding: 1.25rem;
  transition: box-shadow .25s ease, transform .25s ease;
}

.group-card:hover,
.staff-card:hover {
  box-shadow: 0 1rem 2.2rem rgba(31, 47, 43, .14);
  transform: translateY(-.2rem);
}

.group-card:hover .icon-spin-hover,
.staff-card:hover .icon-spin-hover {
  transform: rotate(360deg) scale(1.08);
}

.group-card span {
  align-items: center;
  background: #e7f0e8;
  border-radius: 8px;
  color: #123c35;
  display: flex;
  height: 4rem;
  justify-content: center;
  margin-bottom: 1rem;
  width: 4rem;
}

.group-card svg,
.staff-card__photo svg {
  height: 2rem;
  width: 2rem;
}

.group-card h3,
.staff-card h3,
.people-note h2 {
  color: #123c35;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 .65rem;
}

.group-card p,
.staff-card p {
  color: #42554f;
  line-height: 1.6;
  margin: 0;
}

.staff-card {
  display: grid;
  overflow: hidden;
  transition: box-shadow .25s ease, transform .25s ease;
}

.staff-card__photo {
  align-items: center;
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .95), rgba(18, 60, 53, .84)),
    url("/images/img_hero_1.webp") center / cover no-repeat;
  color: #e5b54b;
  display: flex;
  min-height: 11rem;
  justify-content: center;
}

.staff-card__content {
  padding: 1.15rem;
}

.staff-card span {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 900;
  margin-bottom: .75rem;
  padding: .25rem .65rem;
  text-transform: uppercase;
}

.people-note {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1.5rem;
}

.people-note > svg {
  color: #e5b54b;
  flex: 0 0 auto;
  height: 2rem;
  margin-top: .25rem;
  width: 2rem;
}

@media (min-width: 768px) {
  .groups-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .staff-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
