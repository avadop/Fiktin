import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueFire from 'vuefire'
import { firestorePlugin } from 'vuefire'

// bootstrap
// import BootstrapVue from 'bootstrap-vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
