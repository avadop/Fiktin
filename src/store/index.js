import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userID: 'store'
  },
  mutations: {
    logIn (state, id) {
      state.userID = id
    },
    logOut (state) {
      state.userID = ''
    }
  },
  actions: {
  },
  modules: {
  }
})
