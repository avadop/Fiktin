<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg"  class="navbar-color">
        <b-navbar-brand><router-link to="/home" class="main-nav-ref"><img width="120px" src="@/assets/fiktin_logo_blanco.png"/></router-link></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse v-if="loggedIn" id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item><router-link to="/books" class="nav-ref">Mis libros</router-link></b-nav-item>
            <b-nav-item><router-link to="/libraries" class="nav-ref">Bibliotecas </router-link></b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item><router-link to="/user" class="h4 nav-ref"><b-icon icon="person"></b-icon></router-link></b-nav-item>
            <b-nav-item><div @click="confirmLogOut" class="h4 nav-ref"><b-icon icon="power"></b-icon></div></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <router-view v-if="loggedIn"/>
    </div>

    <b-modal v-model="modal" hide-footer hide-header no-close-on-backdrop>
        <div class="d-block text-center">
          <h3>Cerrar Sesión</h3>
          <p>¿Está seguro que desea cerrar sesión?</p>
        </div>
        <b-button class="mt-3" variant="outline-danger" block @click="logOut">Si</b-button>
        <b-button class="mt-2" variant="primary" block @click="modal = false">Cancelar</b-button>
    </b-modal>

    <div v-if="!loggedIn">
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
      loggedIn: store.state.loggedIn,
      modal: false
    }
  },
  mounted () {
    if (store.state.loggedIn !== true) this.$router.push('/home')
  },
  methods: {
    logIn: function () {
      this.loggedIn = true
    },
    logOut: function () {
      store.commit('logOut')
      this.loggedIn = false
      this.modal = false
      this.$router.push('/')
    },
    confirmLogOut: function () {
      if (!this.loggedIn) {
        window.alert('Inicie sesión primero')
      } else this.modal = true
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

.navbar-color {
  background-color: #35afba;
}

.main-nav-ref {
  color: #fff;
}
.main-nav-ref:hover {
  color: #fff;
}

.nav-ref {
  font-size: 20px;
  color: #abe5eb;
}
.nav-ref:hover {
  color: #fff;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

.nav-ref.router-link-exact-active {
  color: rgba(255, 255, 255, 0.85);
}
</style>
