import Vue from 'vue'
import VueRouter from 'vue-router'

import User from '../views/User.vue'
import Home from '../views/Home.vue'
import Libros from '../views/Libros.vue'
import CrearLibro from '../views/CrearLibro.vue'
import Libraries from '../views/Libraries.vue'
import ViewLibrary from '../views/ViewLibrary.vue'
// import { userInfo } from 'os'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/libros',
    name: 'libros',
    component: Libros
  },
  {
    path: '/crearLibro',
    name: 'crearLibro',
    component: CrearLibro
  },
  {
    path: '/libraries',
    name: 'libraries',
    component: Libraries
  },
  {
    path: '/viewLibrary',
    name: 'viewLibrary',
    component: ViewLibrary,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
