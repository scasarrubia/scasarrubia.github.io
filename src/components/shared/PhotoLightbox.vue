<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { ChevronLeft, ChevronRight, X } from '@lucide/vue';
import { sizedImage } from '../../utils/driveImage';

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  // Index of the open photo, or null when the viewer is closed.
  modelValue: {
    type: Number,
    default: null
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const closeButton = ref(null);
const isLoaded = ref(false);
let touchStartX = 0;
let previouslyFocused = null;

const isOpen = computed(() => props.modelValue !== null && props.images.length > 0);
const currentImage = computed(() => (isOpen.value ? sizedImage(props.images[props.modelValue], 1600) : ''));
const neighbours = computed(() => {
  if (!isOpen.value || props.images.length < 2) return [];
  const total = props.images.length;
  return [(props.modelValue + 1) % total, (props.modelValue - 1 + total) % total]
    .map((index) => sizedImage(props.images[index], 1600));
});

function close() {
  emit('update:modelValue', null);
}

function show(step) {
  const total = props.images.length;
  emit('update:modelValue', (props.modelValue + step + total) % total);
}

function handleKeydown(event) {
  if (event.key === 'Escape') close();
  if (event.key === 'ArrowRight') show(1);
  if (event.key === 'ArrowLeft') show(-1);
}

function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].clientX;
}

function handleTouchEnd(event) {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 50) show(distance < 0 ? 1 : -1);
}

watch(isOpen, async (open) => {
  if (open) {
    previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);
    await nextTick();
    closeButton.value?.focus();
  } else {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', handleKeydown);
    previouslyFocused?.focus?.();
  }
});

watch(currentImage, () => {
  isLoaded.value = false;
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="title ? `Fotos: ${title}` : 'Visor de fotos'"
        @click.self="close"
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd">
        <header class="lightbox__bar">
          <span class="lightbox__counter">{{ modelValue + 1 }} / {{ images.length }}</span>
          <p v-if="title" class="lightbox__title">{{ title }}</p>
          <button ref="closeButton" type="button" class="lightbox__close" aria-label="Cerrar visor" @click="close">
            <X aria-hidden="true" />
          </button>
        </header>

        <div class="lightbox__stage" @click.self="close">
          <span v-if="!isLoaded" class="lightbox__spinner" aria-hidden="true" />
          <img
            :key="currentImage"
            :src="currentImage"
            :alt="`${title || 'Foto'} - imagen ${modelValue + 1} de ${images.length}`"
            :class="{ 'is-loaded': isLoaded }"
            @load="isLoaded = true"
            @error="isLoaded = true">
        </div>

        <template v-if="images.length > 1">
          <button type="button" class="lightbox__arrow lightbox__arrow--previous" aria-label="Foto anterior" @click="show(-1)">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" class="lightbox__arrow lightbox__arrow--next" aria-label="Foto siguiente" @click="show(1)">
            <ChevronRight aria-hidden="true" />
          </button>
        </template>

        <!-- Preload the neighbouring photos so moving through the album feels instant. -->
        <div class="lightbox__preload" aria-hidden="true">
          <img v-for="src in neighbours" :key="src" :src="src" alt="">
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  background: rgba(4, 22, 18, .95);
  display: grid;
  font-family: 'Open Sans', Arial, sans-serif;
  grid-template-rows: auto minmax(0, 1fr);
  inset: 0;
  position: fixed;
  z-index: 2000;
}

.lightbox *,
.lightbox *::before,
.lightbox *::after {
  box-sizing: border-box;
}

.lightbox__bar {
  align-items: center;
  color: #fff;
  display: flex;
  gap: 1rem;
  padding: .85rem 1rem;
}

.lightbox__counter {
  background: rgba(255, 255, 255, .12);
  border-radius: 999px;
  font-size: .85rem;
  font-weight: 700;
  padding: .3rem .8rem;
  white-space: nowrap;
}

.lightbox__title {
  flex: 1;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lightbox__close {
  align-items: center;
  background: rgba(255, 255, 255, .12);
  border: 0;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 2.75rem;
  justify-content: center;
  margin-left: auto;
  transition: background .2s ease, color .2s ease;
  width: 2.75rem;
}

.lightbox__close:hover,
.lightbox__close:focus-visible {
  background: #e5b54b;
  color: #123c35;
}

.lightbox__close svg {
  height: 1.4rem;
  width: 1.4rem;
}

.lightbox__stage {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 0;
  padding: 0 4.5rem 1.5rem;
  position: relative;
}

.lightbox__stage img {
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .5);
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity .3s ease;
}

.lightbox__stage img.is-loaded {
  opacity: 1;
}

.lightbox__spinner {
  animation: lightbox-spin .8s linear infinite;
  border: 3px solid rgba(255, 255, 255, .2);
  border-radius: 50%;
  border-top-color: #e5b54b;
  height: 2.5rem;
  position: absolute;
  width: 2.5rem;
}

@keyframes lightbox-spin {
  to { transform: rotate(360deg); }
}

.lightbox__arrow {
  align-items: center;
  background: rgba(229, 181, 75, .95);
  border: 0;
  border-radius: 50%;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .35);
  color: #123c35;
  cursor: pointer;
  display: flex;
  height: 3rem;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background .2s ease, transform .2s ease;
  width: 3rem;
}

.lightbox__arrow:hover,
.lightbox__arrow:focus-visible {
  background: #fff;
  transform: translateY(-50%) scale(1.08);
}

.lightbox__arrow svg {
  height: 1.5rem;
  width: 1.5rem;
}

.lightbox__arrow--previous {
  left: 1rem;
}

.lightbox__arrow--next {
  right: 1rem;
}

.lightbox button:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.lightbox__preload {
  height: 1px;
  left: -9999px;
  overflow: hidden;
  position: absolute;
  width: 1px;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity .25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .lightbox__stage {
    padding: 0 .5rem 5rem;
  }

  .lightbox__arrow {
    bottom: 1rem;
    height: 2.75rem;
    top: auto;
    transform: none;
    width: 2.75rem;
  }

  .lightbox__arrow:hover,
  .lightbox__arrow:focus-visible {
    transform: none;
  }

  .lightbox__arrow--previous {
    left: calc(50% - 3.5rem);
  }

  .lightbox__arrow--next {
    right: calc(50% - 3.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-enter-active,
  .lightbox-leave-active,
  .lightbox__stage img {
    transition: none;
  }

  .lightbox__spinner {
    animation-duration: 2s;
  }
}
</style>
