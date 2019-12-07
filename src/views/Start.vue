<template>
  <div class="start">
    <h1>FIKTIN</h1>
    <div id="options-menu">
      <div v-if="!create">
        <LogIn/>
        <button @click="switchCreate"> Crear Usuario</button>
      </div>
      <div v-else>
        <NewUser/>
        <button @click="switchCreate"> Log In</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NewUser from '@/components/NewUser.vue'
import LogIn from '@/components/LogIn.vue'

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
    }
  }
}

</script>
