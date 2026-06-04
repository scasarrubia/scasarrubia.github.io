// ── Accordion ──
  function toggleEra(card) {
    const wasOpen = card.classList.contains('open');
    document.querySelectorAll('.era-card.open').forEach(c => c.classList.remove('open'));
    if (!wasOpen) card.classList.add('open');
  }

  // ── Stars ──
  const answers = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
  let selectedGroup = '';
  let selectedExhibition = '';

  const googleForm = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSfJid_VqBqV234EhetAWzMVTlhmFnoTKY2t8IsK2Da3DUM5og/formResponse',
    fields: {
      group: 'entry.1986836914',
      exhibition: 'entry.615401089',
      q1: 'entry.434393695',
      q2: 'entry.511538629',
      q3: 'entry.1935518978',
      q4: 'entry.214162784',
      q5: 'entry.646837032',
      q6: 'entry.1118504871'
    }
  };

  function selectStar(qId, val) {
    answers[qId] = val;
    const row = document.getElementById(qId);
    row.querySelectorAll('.star-btn').forEach((btn, i) => {
      btn.classList.toggle('selected', i < val);
    });
  }

  function selectGroup(btn, name) {
    selectedGroup = name;
    document.querySelectorAll('#groupGrid .group-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }

  function selectExhibition(btn, name) {
    selectedExhibition = name;
    document.querySelectorAll('.exhibition-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }

  async function submitForm() {
    const allStars = Object.values(answers).every(v => v > 0);
    const textAnswer = document.getElementById('q6').value.trim();
    const submitBtn = document.getElementById('submitBtn');

    if (!selectedGroup) { alert('Por favor selecciona el grupo que visitaste.'); return; }
    if (!selectedExhibition) { alert('Por favor selecciona la exposición que vas a evaluar.'); return; }
    if (!allStars) { alert('Por favor responde todas las preguntas de calificación (1–5).'); return; }
    if (!textAnswer) { alert('Por favor escribe tu respuesta a la pregunta 6.'); return; }

    const formData = new FormData();
    formData.append(googleForm.fields.group, selectedGroup);
    formData.append(googleForm.fields.exhibition, selectedExhibition);
    formData.append(googleForm.fields.q1, String(answers.q1));
    formData.append(googleForm.fields.q2, String(answers.q2));
    formData.append(googleForm.fields.q3, String(answers.q3));
    formData.append(googleForm.fields.q4, String(answers.q4));
    formData.append(googleForm.fields.q5, String(answers.q5));
    formData.append(googleForm.fields.q6, textAnswer);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      await fetch(googleForm.action, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      document.getElementById('formWrap').style.display = 'none';
      document.getElementById('successMsg').classList.add('show');
      document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      alert('No se pudo enviar la evaluación. Revisa la conexión e inténtalo de nuevo.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Evaluación';
    }
  }

  function scrollGallery(direction, trackId = 'galleryTrack') {
    const track = document.getElementById(trackId);
    if (!track) return;
    const card = track.querySelector('.gallery-card');
    const gap = parseInt(getComputedStyle(track).gap, 10) || 16;
    const step = (card ? card.offsetWidth : 280) + gap;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  function autoplayGallery(track) {
    if (!track) return;
    const card = track.querySelector('.gallery-card');
    if (!card) return;
    const gap = parseInt(getComputedStyle(track).gap, 10) || 16;
    const step = card.offsetWidth + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (track.scrollLeft + step >= maxScroll - 2) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  function setupGalleryAutoplay(track) {
    if (!track) return;

    let intervalId = setInterval(() => autoplayGallery(track), 4500);

    const stopAutoplay = () => clearInterval(intervalId);
    const startAutoplay = () => {
      clearInterval(intervalId);
      intervalId = setInterval(() => autoplayGallery(track), 4500);
    };

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    track.addEventListener('touchend', startAutoplay);
  }

  document.querySelectorAll('.gallery-track').forEach(setupGalleryAutoplay);

  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
