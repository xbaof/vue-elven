import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'
import setPlugins from '@/plugins'

const app = createApp(App)
app.use(setPlugins)
app.mount('#app')
