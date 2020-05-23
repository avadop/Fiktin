<template>
<div class = "start">
    <div id="options-menu">
      <div v-if="!create">
        <NewUser @switchCreate="switchCreate"/>
      </div>
      <div v-else>
        <LogIn :url="urlLogIn" @loggedIn="logIn" @switchCreate="switchCreate"/>
      </div>
    </div>
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
  props: {
    urlLogIn: String,
    optionStart: Boolean
  },
  data () {
    return {
      create: this.optionStart
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
