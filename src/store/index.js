import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userID: '',
    userNick: ''
  },
  mutations: {
    logIn (state, id) {
      state.userID = id
    },
    logOut (state) {
      state.userID = ''
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
