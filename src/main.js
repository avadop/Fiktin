import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'
// import VueFire from 'vuefire'
import { firestorePlugin } from 'vuefire'

// bootstrap
// import BootstrapVue from 'bootstrap-vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

//  Modal = ventanitas pop-up
Vue.use(VModal, { dialog: true })

Vue.use(firestorePlugin)

// Vue.use(VueFire)

Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue()
// export const eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
