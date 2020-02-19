<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/home">Fiktin</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/books">Libros</b-nav-item>
            <b-nav-item href="/libraries">Bibliotecas</b-nav-item>
            <label class="my-2">Bonito, pero no funciona (por eso de que se cierra la sesión al recargar la página)</label>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>

            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">ES</b-dropdown-item>
              <b-dropdown-item href="#">RU</b-dropdown-item>
              <b-dropdown-item href="#">FA</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="/user">Usuario</b-dropdown-item>
              <b-dropdown-item href="/" @click.native="confirmLogOut">Cerrar Sesión</b-dropdown-item>
              <!-- <b-dropdown-item v-else="loggedIn" href="/home" @click.native="confirmLogOut">Iniciar Sesión</b-dropdown-item> -->
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
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
