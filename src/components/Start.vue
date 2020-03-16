<template>
<div class = "start">
  <!-- <modal name="start"> -->
    <h1>Bienvenidos a Fiktin</h1>
    <h3>Es necesario registrarse e iniciar sesion antes de acceder a la aplicacion</h3>
    <div id="options-menu">
      <div v-if="!create">
        <LogIn @loggedIn="logIn"/>
        <b-button variant="primary" @click="switchCreate"> Crear Usuario</b-button>
      </div>
      <div v-else>
        <NewUser @switch-create="switchCreate"/>
        <b-button variant="primary" @click="switchCreate"> Log In</b-button>
      </div>
    </div>
  <!-- </modal> -->
  </div>
</template>

<script>
// @ is an alias to /src
import NewUser from '@/components/start/NewUser.vue'
import LogIn from '@/components/start/LogIn.vue'

export default {
  name: 'start',
  components: {
    NewUser,
    LogIn
  },
  data () {
    return {
      create: {
        type: Boolean,
        default: false
      }
    }
  },
  methods: {
    switchCreate: function () {
      this.create = !this.create
    },
    logIn: function () {
      this.$emit('loggedIn')
    }
  }
}
</script>

<style>
.start {
    padding:20px;
}
.btn {
    margin: 5px;
    font-size: 20px;
}
</style>
