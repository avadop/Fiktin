import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userID: '',
    userNick: '',
    loggedIn: false,
    openBookID: '',
    openedBook: null,
    sectionID: '',
    sectionPreview: false
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
    },
    openBookID (state, id) {
      state.openBookID = id
    },
    openBook (state, book) {
      state.openedBook = book
    },
    changeSection (state, id) {
      state.sectionID = id
    },
    closeBook (state) {
      state.openBookID = ''
      state.openedBook = ''
      state.sectionID = ''
    },
    switchSectionPreview (state, value) {
      state.sectionPreview = value
    }
  },
  actions: {
  },
  modules: {
  }
})
