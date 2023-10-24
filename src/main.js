import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import './style.css'
import App from './App.vue'
import { initResources } from '@/utils/resources'
import { i18n } from '@/utils/i18n'

(async () => {
  const resource = await initResources();
  window._resource = resource
  const loadingEl = document.querySelector("#loading")
  await createApp(App).use(createPinia()).use(i18n).mount('#app')
  loadingEl.classList.add("fade-out")
  setTimeout(() => {
    loadingEl.remove()
  }, 1000);
})();