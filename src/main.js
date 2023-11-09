import { createApp } from 'vue'
import 'normalize.css'
import './style.css'
import App from './App.vue'
import { initResources } from '@/utils/resources'
import { i18n,getI18nType } from '@/utils/i18n'

(async () => {
  const resource = await initResources();
  window._resource = resource
  document.body.classList.add("i18n-" + getI18nType())
  const loadingEl = document.querySelector("#loading")
  await createApp(App).use(i18n).mount('#app')
  loadingEl.classList.add("fade-out")
  setTimeout(() => {
    loadingEl.remove()
  }, 1000);
})();