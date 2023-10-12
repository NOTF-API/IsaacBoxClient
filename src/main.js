import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import './style.css'
import App from './App.vue'
const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
window.onerror = (err) => {
  console.warn(err)
  return false
}
