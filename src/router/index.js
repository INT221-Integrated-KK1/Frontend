import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/task' // Redirect to '/task' when accessing the root path
    },
    {
      path: '/task',
      name: 'task',
      component: App
    }
  ]
})

export default router
