<template>
  <div id="app">
    <div id="nav" v-if="loggedIn">
      <router-link to="/home">Home</router-link> |
      <router-link to="/books">Libros </router-link> |
      <router-link to="/libraries">Bibliotecas </router-link> |
      <router-link to="/user">Usuario </router-link> |
      <router-link to="/" @click.native="confirmLogOut">Cerrar Sesion</router-link>
      <v-dialog/>
      <router-view/>
    </div>
    <div v-else>
      <start @loggedIn="logIn"/>
    </div>
  </div>
</template>

<script>
import Start from './components/Start.vue'
import { store } from './store/index.js'

export default {
  name: 'App',
  components: {
    Start
  },
  data () {
    return {
      loggedIn: false
    }
  },
  methods: {
    logIn: function () {
      this.loggedIn = true
    },
    logOut: function () {
      store.commit('logOut')
      this.loggedIn = false
      this.$router.push('/#/')
    },
    confirmLogOut: function () {
      this.$modal.show('dialog', {
        text: '¿Está seguro que desea cerrar sesión?',
        buttons: [
          {
            title: 'SI',
            default: true,
            handler: () => { this.logOut() }
          },
          {
            title: 'Cancelar'
          }
        ]
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
