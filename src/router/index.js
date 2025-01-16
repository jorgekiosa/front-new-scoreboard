import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ScoreBoardLayout from '@/layouts/ScoreBoardLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeView from '../views/HomeView.vue'
import PointsView from '../views/PointsView.vue'
import Dashboard from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import Broadcast from '@/components/broadcast.vue'
import Boards from '@/components/scoreboard/Boards.vue'
import Users from '@/components/users/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes:[
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'auth',
          component: LoginView,
        }
      ],
    },
    {
      path: '/scoreboard',
      component: ScoreBoardLayout,
      children: [
        {
          path: '/broadcast',
          name: 'broadcast',
          component: Broadcast ,
        },
        {
          path: '/board',
          name: 'board',
          component: HomeView,
        },
        {
          path: '/points',
          name: 'points',
          component: PointsView,
        },
      ],
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: '/user',
          name: 'user',
          component: Users,
        },
        {
          path: '/boards',
          name: 'boards',
          component: Boards ,
        },
      ],
    },
  ]
})

export default router
