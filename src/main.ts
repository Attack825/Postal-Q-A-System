import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import {
  faComments,
  faPaperPlane,
  faPaperclip,
  faHome,
  faCog,
  faHouse,
  faGear,
  faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
  faComments,
  faPaperPlane,
  faPaperclip,
  faHome,
  faCog,
  faHouse,
  faGear,
  faArrowUpFromBracket,
)

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 持久化插件，将状态保存到浏览器本地存储

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
