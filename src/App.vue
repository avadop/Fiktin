<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg"  class="navbar-color">
        <b-navbar-brand><router-link to="/" class="main-nav-ref"><img width="120px" src="@/assets/fiktin_logo_blanco.png"/></router-link></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse v-if="loggedIn" id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item><router-link to="/" class="nav-ref">Inicio</router-link></b-nav-item>
            <b-nav-item><router-link to="/books" class="nav-ref">Mis libros</router-link></b-nav-item>
            <b-nav-item><router-link to="/libraries" class="nav-ref">Bibliotecas </router-link></b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item><router-link to="/user" class="h4 nav-ref"><b-icon icon="person"></b-icon></router-link></b-nav-item>
            <b-nav-item><div @click="confirmLogOut" class="h4 nav-ref"><b-icon icon="power"></b-icon></div></b-nav-item>
          </b-navbar-nav>
        </b-collapse>

        <!-- Not logged In nav-bar-->
        <b-collapse v-else id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item><router-link to="/" class="nav-ref">Inicio</router-link></b-nav-item>
            <b-nav-item @click="needLogIn('/books')"><div class="nav-ref">Mis libros</div></b-nav-item>
            <b-nav-item @click="needLogIn('/libraries')"><div class="nav-ref">Bibliotecas</div></b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item @click="needLogIn('/')"><div class=" h4 nav-ref"><b-icon icon="box-arrow-in-right"></b-icon></div></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <router-view @deleteUser="deleteUser"/>
    </div>

    <b-modal v-model="modalLogOut" hide-footer hide-header no-close-on-backdrop>
        <div class="d-block text-center">
          <h3>Cerrar Sesión</h3>
          <p>¿Está seguro que desea cerrar sesión?</p>
        </div>
        <b-button class="mt-3" variant="outline-danger" block @click="logOut">Si</b-button>
        <b-button class="mt-2" variant="primary" block @click="modalLogOut = false">Cancelar</b-button>
    </b-modal>

    <b-modal v-model="modalLogIn" hide-footer hide-header no-close-on-backdrop centered>
      <start :urlLogIn="urlLogIn" @loggedIn="logIn"/>
      <b-button class="mt-2" variant="outline-secondary" size="sm" block @click="modalLogIn = false">Cancelar</b-button>
    </b-modal>
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
      modalLogOut: false,
      modalLogIn: false,
      urlLogIn: ''
    }
  },
  methods: {
    needLogIn (value) {
      this.urlLogIn = value
      this.modalLogIn = true
    },
    logIn: function () {
      this.loggedIn = true
      this.modalLogIn = false
    },
    logOut: function () {
      store.commit('logOut')
      this.loggedIn = false
      this.modalLogOut = false
      this.$router.push('/')
    },
    confirmLogOut: function () {
      if (!this.loggedIn) {
        window.alert('Inicie sesión primero')
      } else this.modalLogOut = true
    },
    deleteUser: function () {
      this.loggedIn = false
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
