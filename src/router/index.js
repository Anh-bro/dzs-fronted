import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    component: () => import('../views/Main.vue'),
    redirect: '/login',

    children: [
      { path: '/home', name: 'home', component: HomeView },
      { path: '/read', name: 'read', component: () => import('../views/ReadView.vue') },
      { path: '/user', name: 'user', component: () => import('../views/UserView.vue') },
      { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
      { path: '/note', name: 'note', component: () => import('../views/NoteView.vue') },
      { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue') },
      { path: '/personal', name: 'personal', component: () => import('../views/PersonalView.vue') },
      { path: '/adduser', name: 'adduser', component: () => import('../views/AddUserView.vue') },
      { path: '/mark', name: 'mark', component: () => import('../views/MarkView.vue') },

    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
