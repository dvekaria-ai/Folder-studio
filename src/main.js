import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './styles/index.css'
import App from './App.vue'
import Gallery from './pages/Gallery.vue'
import Create from './pages/Create.vue'
import ApplyGuide from './pages/ApplyGuide.vue'
import Styleguide from './pages/Styleguide.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Gallery },
    { path: '/create', component: Create },
    { path: '/apply', component: ApplyGuide },
    { path: '/styleguide', component: Styleguide },
  ],
})

createApp(App).use(router).mount('#app')
