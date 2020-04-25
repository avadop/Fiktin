import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userID: '',
    userNick: '',
    loggedIn: false
  },
  plugins: [createPersistedState()],
  mutations: {
    logIn (state, id) {
      state.userID = id
      state.loggedIn = true
    },
    logOut (state) {
      state.userID = ''
      state.loggedIn = false
    },
    nickChange (state, nick) {
      state.userNick = nick
    }
  },
  actions: {
  },
  modules: {
  }
})
