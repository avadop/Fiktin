import Vue from 'vue'
import VueRouter from 'vue-router'

import User from '@/views/User.vue'
import Home from '@/views/Home.vue'
import Books from '@/views/Books.vue'
import Libraries from '@/views/Libraries.vue'
import ViewLibrary from '@/views/ViewLibrary.vue'
import EditBook from '@/views/editBooks/editBook.vue'
import ReadBook from '@/views/editBooks/readBook.vue'
// import { userInfo } from 'os'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/',
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
  },
  {
    path: '/editBooks/readBook',
    name: 'readBook',
    component: ReadBook,
    props: true
  },
  {
    path: '/editBooks/editBook',
    name: 'editBook',
    component: EditBook,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
