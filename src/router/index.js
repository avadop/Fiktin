import Vue from 'vue'
import VueRouter from 'vue-router'

import Start from '../views/Start.vue'
import Home from '../views/Home.vue'
// import { userInfo } from 'os'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'start',
    component: Start
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
