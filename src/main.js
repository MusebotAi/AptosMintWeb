import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import router from "./route" 

createApp(App).use(router).mount('#app')
