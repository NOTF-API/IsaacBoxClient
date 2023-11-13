import { createApp } from 'vue'
import 'normalize.css'
import './style.css'
import App from './App.vue'
import { initResources } from '@/utils/resources'
import { initI18n } from '@/utils/i18n'
import { disableTab } from '@/utils/keys'

const init = async () => {
  disableTab();
  const i18n = initI18n();
  await initResources();
  await createApp(App)
    .use(i18n)
    .mount('#app')
  document.querySelector("#loading").remove()
}

init();