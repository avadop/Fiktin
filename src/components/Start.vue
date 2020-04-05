<template>
<div class = "start">
  <!-- <b-card class="background-card"> -->
  <!-- <modal name="start"> -->
    <!-- <h6>Es necesario registrarse e iniciar sesion antes de acceder a la aplicacion</h6>
    <br> -->
    <div id="options-menu">
      <div v-if="!create">
        <NewUser @switch-create="switchCreate" @switchCreate="switchCreate"/>
      </div>
      <div v-else>
        <LogIn @loggedIn="logIn" @switchCreate="switchCreate"/>
      </div>
    </div>
  <!-- </modal> -->
  <!-- </b-card> -->
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
.card.background-card {
  background-color: #e2e7ec;
}
.start {
    padding:20px;
}
.btn {
    margin: 5px;
    font-size: 20px;
}
</style>
