import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueFire from 'vuefire'
import { firestorePlugin } from 'vuefire'

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
