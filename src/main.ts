import { createApp } from 'vue'
import App from './App.vue'
import './styles/reset.scss'
import './styles/index.scss'
import setupPlugins from '@/plugins'

const app = createApp(App)
app.use(setupPlugins)
app.mount('#app')
