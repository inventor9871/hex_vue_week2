// import './assets/main.css'
import './assets/all.scss'
// import './assets/week2.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(router)

app.mount('#app')
