import Vue from 'vue'
import VueRouter from 'vue-router'

import User from '../views/User.vue'
import Home from '../views/Home.vue'
import Books from '../views/Books.vue'
import Libraries from '../views/Libraries.vue'
import ViewLibrary from '../views/ViewLibrary.vue'
// import { userInfo } from 'os'

// bootstrap
// import BootstrapVue from 'bootstrap-vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

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
    path: '/books',
    name: 'books',
    component: Books
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
