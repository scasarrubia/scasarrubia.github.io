<template>
  <section class="page-breadcrumb-band">
    <div class="page-container page-breadcrumb">
      <RouterLink to="/">Inicio</RouterLink> » Contacto
    </div>
  </section>

  <main class="contact-page">
    <div class="page-container contact-page__layout">
      <section>
        <h2>Escríbenos</h2>

        <form class="contact-form" action="#">
          <div class="contact-form__field">
            <label for="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su nombre" />
          </div>

          <div class="contact-form__field">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingrese su email" />
          </div>

          <div class="contact-form__field contact-form__field--textarea">
            <label for="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              placeholder="Ingrese su mensaje"></textarea>
          </div>

          <div class="contact-form__actions">
            <button class="button button--primary" type="submit">
              Enviar
            </button>
            <button class="button button--secondary" type="reset">
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <aside class="contact-card">
        <h3>Atención institucional</h3>
        <p>
          Este espacio está pensado para orientar a familias, estudiantes, egresados y comunidad interesada en los
          procesos de la Institución Educativa Padre Roberto Arroyave Vélez.
        </p>
        <p>
          Próximamente podremos agregar teléfono, correo institucional, dirección, horarios de atención y mapa de
          ubicación.
        </p>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.page-breadcrumb-band {
  background: #123c35;
  color: #fff;
  padding: 1rem 0;
}

.page-breadcrumb {
  font-size: .875rem;
  text-align: right;
}

.page-breadcrumb a {
  color: #fff;
  text-decoration: underline;
}

.page-breadcrumb a:hover,
.page-breadcrumb a:focus {
  color: #e5b54b;
}

.contact-page {
  background: #f7f8f4;
  padding: 3rem 0;
}

.contact-page__layout {
  display: grid;
  gap: 2rem;
}

.contact-page h2 {
  color: #1f2f2b;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
}

.contact-form {
  display: grid;
  gap: 1.25rem;
}

.contact-form__field {
  display: grid;
  gap: .5rem;
}

.contact-form label {
  color: #1f2f2b;
  font-weight: 700;
}

.contact-form input,
.contact-form textarea {
  background: #fff;
  border: 1px solid #cfdad1;
  border-radius: 6px;
  color: #1f2f2b;
  outline: none;
  padding: .75rem 1rem;
  transition: border .2s ease, box-shadow .2s ease;
  width: 100%;
}

.contact-form textarea {
  min-height: 9rem;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #123c35;
  box-shadow: 0 0 0 3px rgba(18, 60, 53, .16);
}

.contact-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

.button {
  border: 0;
  border-radius: 6px;
  font-weight: 700;
  padding: .75rem 1.25rem;
  transition: background .2s ease, color .2s ease;
}

.button--primary {
  background: #e5b54b;
  color: #123c35;
}

.button--primary:hover,
.button--primary:focus {
  background: #b77c17;
  color: #fff;
}

.button--secondary {
  background: #fff;
  box-shadow: inset 0 0 0 1px #cfdad1;
  color: #123c35;
}

.button--secondary:hover,
.button--secondary:focus {
  background: #e7f0e8;
}

.contact-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  padding: 1.5rem;
}

.contact-card h3 {
  color: #1f2f2b;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.contact-card p {
  color: rgba(31, 47, 43, .8);
  line-height: 1.65;
}

@media (min-width: 768px) {
  .contact-page__layout {
    grid-template-columns: 2fr 1fr;
  }

  .contact-form__field {
    align-items: center;
    grid-template-columns: 10rem minmax(0, 1fr);
  }

  .contact-form__field--textarea {
    align-items: start;
  }

  .contact-form__actions {
    padding-left: 10rem;
  }
}
</style>
