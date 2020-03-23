<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/home">Fiktin</b-navbar-brand>
        <b-navbar-brand><router-link to="/home" class="main-nav-ref">Fiktin</router-link></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/books">Mis libros</b-nav-item>
            <b-nav-item href="/libraries">Bibliotecas</b-nav-item>
            <label class="my-2">Bonito, pero no funciona (por eso de que se cierra la sesión al recargar la página)</label>
            <b-nav-item><router-link to="/books" class="nav-ref">Mis libros</router-link></b-nav-item>
            <b-nav-item><router-link to="/libraries" class="nav-ref">Bibliotecas </router-link></b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="/user">Usuario</b-dropdown-item>
              <b-dropdown-item href="/" @click.native="confirmLogOut">Cerrar Sesión</b-dropdown-item>
              <!-- <b-dropdown-item v-else="loggedIn" href="/home" @click.native="confirmLogOut">Iniciar Sesión</b-dropdown-item> -->
            </b-nav-item-dropdown>
            <b-nav-item><router-link to="/user" class="h4 nav-ref"><b-icon icon="person"></b-icon></router-link></b-nav-item>
            <b-nav-item><router-link to="/" @click.native="confirmLogOut" class="h4 nav-ref"><b-icon icon="power"></b-icon></router-link></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div id="nav" v-if="loggedIn">
      <router-link to="/home">Home</router-link> |
      <router-link to="/books">Mis libros </router-link> |
      <router-link to="/libraries">Bibliotecas </router-link> |
      <router-link to="/user">Usuario </router-link> |
      <router-link to="/" @click.native="confirmLogOut">Cerrar Sesion</router-link>
      <v-dialog/>
      <router-view/>
    </div>
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

.main-nav-ref {
  color: #fff;
}
.main-nav-ref:hover {
  color: #fff;
}

.nav-ref {
  color: rgba(255, 255, 255, 0.5);
}
.nav-ref:hover {
  color: rgba(255, 255, 255, 0.85);
}

.nav-exp {
  color: #000;
}
.nav-exp:hover {
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
