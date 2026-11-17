import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { revealDirective } from './directives/reveal';
import './styles/tailwind.css';

createApp(App).directive('reveal', revealDirective).use(router).mount('#app');
