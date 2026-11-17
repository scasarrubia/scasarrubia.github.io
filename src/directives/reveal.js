const directions = new Set(['left', 'right', 'up', 'down', 'zoom']);

const getOptions = (binding) => {
  if (typeof binding.value === 'string') {
    return { direction: binding.value };
  }

  return binding.value ?? {};
};

const normalizeOptions = (binding) => {
  const { delay = 0, direction = 'up', once = true } = getOptions(binding);
  const revealDirection = directions.has(direction) ? direction : 'up';

  return {
    delay,
    direction: revealDirection,
    once
  };
};

const cleanupReveal = (el) => {
  window.clearTimeout(el._revealTimer);
  el._revealObserver?.disconnect();

  if (el._revealClass) {
    el.classList.remove('reveal', el._revealClass, 'is-visible');
  }

  el.style.removeProperty('--reveal-delay');
  delete el._revealClass;
  delete el._revealObserver;
  delete el._revealOptionsKey;
  delete el._revealTimer;
};

const applyReveal = (el, binding) => {
  const { delay, direction, once } = normalizeOptions(binding);
  const revealClass = `reveal--${direction}`;
  const optionsKey = JSON.stringify({ delay, direction, once });

  el._revealClass = revealClass;
  el._revealOptionsKey = optionsKey;
  el.classList.add('reveal', revealClass);
  el.style.setProperty('--reveal-delay', `${delay}ms`);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        if (!once) {
          el.classList.remove('is-visible');
        }

        return;
      }

      el.classList.add('is-visible');
      window.clearTimeout(el._revealTimer);
      el._revealTimer = window.setTimeout(() => {
        el.classList.remove('reveal', revealClass, 'is-visible');
        el.style.removeProperty('--reveal-delay');
      }, delay + 860);

      if (once) {
        observer.disconnect();
      }
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.18
    }
  );

  el._revealObserver = observer;
  observer.observe(el);
};

export const revealDirective = {
  mounted(el, binding) {
    applyReveal(el, binding);
  },

  updated(el, binding) {
    const nextOptions = normalizeOptions(binding);
    const nextOptionsKey = JSON.stringify(nextOptions);

    if (nextOptionsKey === el._revealOptionsKey) {
      return;
    }

    cleanupReveal(el);
    applyReveal(el, binding);
  },

  unmounted(el) {
    cleanupReveal(el);
  }
};
