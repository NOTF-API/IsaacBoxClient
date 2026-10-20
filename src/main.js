import { createApp } from 'vue'
import 'normalize.css'
import './style.css'
import App from './App.vue'
import { initResources } from '@/utils/resources'
import { initI18n } from '@/utils/i18n'
import { disableTab } from '@/utils/keys'
import { TITLE } from '../app.config'

const init = async () => {
  document.title = TITLE;
  disableTab();
  const i18n = initI18n();
  try {
    await initResources();
    await createApp(App)
      .use(i18n)
      .mount('#app')
    document.querySelector("#loading").remove()
  } catch (error) {
    console.error(error);
    const loading = document.querySelector("#loading");
    if (loading) {
      loading.textContent = "资源加载失败，请重新启动程序";
    }
  }
}

init();