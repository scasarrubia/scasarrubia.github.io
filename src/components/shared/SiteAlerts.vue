<script setup>
import { computed, ref, watch } from 'vue';
import { Bell, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Megaphone, TriangleAlert, X } from '@lucide/vue';
import { useSiteAlerts } from '../../composables/useSiteAlerts';

const { alerts, hasActiveAlerts } = useSiteAlerts();
const isModalOpen = ref(false);
const activeAlertIndex = ref(0);

const activeAlert = computed(() => alerts.value[activeAlertIndex.value] || alerts.value[0]);

function getAlertIcon(type) {
  if (type === 'alerta') return TriangleAlert;
  if (type === 'evento') return CalendarDays;

  return Megaphone;
}

function openAlerts() {
  if (!hasActiveAlerts.value) return;

  isModalOpen.value = true;
}

function closeAlerts() {
  isModalOpen.value = false;
}

function showAlert(index) {
  activeAlertIndex.value = index;
  isModalOpen.value = true;
}

function showPreviousAlert() {
  if (!alerts.value.length) return;

  activeAlertIndex.value = activeAlertIndex.value === 0
    ? alerts.value.length - 1
    : activeAlertIndex.value - 1;
}

function showNextAlert() {
  if (!alerts.value.length) return;

  activeAlertIndex.value = (activeAlertIndex.value + 1) % alerts.value.length;
}

watch(
  alerts,
  (currentAlerts) => {
    activeAlertIndex.value = 0;
    isModalOpen.value = currentAlerts.length > 0;
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="isModalOpen && activeAlert" class="site-alerts" @click.self="closeAlerts">
      <section
        class="site-alerts__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-alert-title">
        <button class="site-alerts__close" type="button" aria-label="Cerrar novedad" @click="closeAlerts">
          <X aria-hidden="true" />
        </button>

        <div class="site-alerts__icon" :data-alert-type="activeAlert.type">
          <component :is="getAlertIcon(activeAlert.type)" aria-hidden="true" />
        </div>

        <p class="site-alerts__kicker">{{ activeAlert.type }}</p>
        <h2 id="site-alert-title">{{ activeAlert.title }}</h2>
        <p class="site-alerts__message">{{ activeAlert.message }}</p>

        <a
          v-if="activeAlert.link"
          class="site-alerts__link"
          :href="activeAlert.link"
          target="_blank"
          rel="noopener noreferrer">
          {{ activeAlert.linkLabel }}
          <ExternalLink aria-hidden="true" />
        </a>

        <div v-if="alerts.length > 1" class="site-alerts__navigation" aria-label="Navegar entre alertas">
          <button type="button" aria-label="Ver alerta anterior" @click="showPreviousAlert">
            <ChevronLeft aria-hidden="true" />
            Anterior
          </button>
          <span>{{ activeAlertIndex + 1 }} de {{ alerts.length }}</span>
          <button type="button" aria-label="Ver alerta siguiente" @click="showNextAlert">
            Siguiente
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>

    <div v-if="hasActiveAlerts && !isModalOpen" class="site-alerts-launcher">
      <button
        class="site-alerts-bell"
        type="button"
        aria-label="Ver novedades y alertas"
        @click="openAlerts">
        <Bell aria-hidden="true" />
        <strong>Alertas</strong>
        <span>{{ alerts.length }}</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.site-alerts {
  align-items: center;
  background: rgba(13, 47, 42, .78);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 200;
}

.site-alerts__dialog {
  background: #fff;
  border: 1px solid rgba(229, 181, 75, .35);
  border-radius: 8px;
  box-shadow: 0 1.25rem 3.5rem rgba(0, 0, 0, .3);
  color: #1f2f2b;
  max-height: calc(100vh - 2rem);
  max-width: 38rem;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  text-align: center;
  width: min(100%, 38rem);
}

.site-alerts__close {
  align-items: center;
  background: #123c35;
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  height: 2.4rem;
  justify-content: center;
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: background .2s ease, color .2s ease;
  width: 2.4rem;
}

.site-alerts__close:hover,
.site-alerts__close:focus {
  background: #e5b54b;
  color: #123c35;
}

.site-alerts__close svg {
  height: 1.2rem;
  width: 1.2rem;
}

.site-alerts__icon {
  align-items: center;
  background: #e7f0e8;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  height: 4.25rem;
  justify-content: center;
  margin-bottom: 1rem;
  width: 4.25rem;
}

.site-alerts__icon[data-alert-type="alerta"] {
  background: #fff0d9;
  color: #9a5b00;
}

.site-alerts__icon[data-alert-type="evento"] {
  background: #e6f0ff;
  color: #1f5c9f;
}

.site-alerts__icon svg {
  height: 2.1rem;
  width: 2.1rem;
}

.site-alerts__kicker {
  color: #e5b54b;
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.site-alerts h2 {
  color: #123c35;
  font-size: clamp(1.75rem, 5vw, 2.6rem);
  font-weight: 900;
  line-height: 1.08;
  margin: 0;
}

.site-alerts__message {
  color: #42554f;
  line-height: 1.7;
  margin: 1rem auto 0;
  max-width: 32rem;
  white-space: pre-line;
}

.site-alerts__link {
  align-items: center;
  background: #e5b54b;
  border-radius: 6px;
  color: #123c35;
  display: inline-flex;
  font-weight: 900;
  gap: .4rem;
  margin-top: 1.2rem;
  min-height: 2.75rem;
  padding: 0 1rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

.site-alerts__link:hover,
.site-alerts__link:focus {
  background: #123c35;
  color: #fff;
  transform: translateY(-.1rem);
}

.site-alerts__link svg {
  height: 1rem;
  width: 1rem;
}

.site-alerts__navigation {
  align-items: center;
  border-top: 1px solid #dde6dc;
  display: flex;
  flex-wrap: wrap;
  gap: .65rem;
  justify-content: center;
  margin-top: 1.25rem;
  padding-top: 1rem;
}

.site-alerts__navigation button {
  align-items: center;
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  color: #123c35;
  cursor: pointer;
  display: inline-flex;
  font-size: .82rem;
  font-weight: 900;
  gap: .3rem;
  min-height: 2.35rem;
  padding: 0 .75rem;
  transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
}

.site-alerts__navigation button:hover,
.site-alerts__navigation button:focus {
  background: #123c35;
  border-color: #123c35;
  color: #fff;
  transform: translateY(-.08rem);
}

.site-alerts__navigation svg {
  height: 1rem;
  width: 1rem;
}

.site-alerts__navigation span {
  color: #42554f;
  font-size: .82rem;
  font-weight: 900;
}

.site-alerts-launcher {
  bottom: 1.25rem;
  display: grid;
  gap: .65rem;
  justify-items: end;
  position: fixed;
  right: 1.25rem;
  z-index: 180;
}

.site-alerts-bell {
  align-items: center;
  background: #e5b54b;
  border: 0;
  border-radius: 999px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .28);
  color: #123c35;
  cursor: pointer;
  display: inline-flex;
  gap: .45rem;
  min-height: 3.2rem;
  justify-content: center;
  padding: 0 1rem 0 .9rem;
  position: relative;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

.site-alerts-bell:hover,
.site-alerts-bell:focus {
  background: #123c35;
  color: #fff;
  transform: translateY(-.12rem);
}

.site-alerts-bell svg {
  height: 1.45rem;
  width: 1.45rem;
}

.site-alerts-bell strong {
  font-size: .85rem;
  font-weight: 900;
}

.site-alerts-bell span {
  align-items: center;
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  color: #123c35;
  display: flex;
  font-size: .72rem;
  font-weight: 900;
  height: 1.35rem;
  justify-content: center;
  position: absolute;
  right: -.2rem;
  top: -.2rem;
  width: 1.35rem;
}
</style>
