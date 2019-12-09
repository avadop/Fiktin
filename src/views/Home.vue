<template>
  <div class="home">
    <div id="nav">
      <p> Los siguientes nombres se pueden clicar (aunque no hagan nada) </p>
      <p>{{userID}}</p>
      <span class="linkis" @click="setOptionToHome"> Home </span>
      <span class="linkis" @click="setOptionToBooks"> Libros </span>
      <span class="linkis" @click="setOptionToLibrary"> Bibliotecas </span>
      <span class="linkis" @click="setOptionToUser"> Usuario </span> <br>
      <br>
      <button @click="logOut"> Log Out para siempre </button>
    </div>
    <div v-if="option === 0"></div>
    <div v-if="option === 1"></div>
    <div v-if="option === 2"></div>
    <div v-if="option === 3">
      <User :userKey="userID" :user="user"/>
    </div>
  </div>
</template>

<script>

import User from '@/components/User.vue'
import { store } from '../store/index.js'

export default {
  name: 'start',
  components: {
    User
  },
  data () {
    return {
      option: 0,
      userID: '',
      user: null
    }
  },
  mounted () {
    this.userID = store.state.userID
  },

  methods: {
    setOptionToHome: function () {
      this.option = 0
    },
    setOptionToBooks: function () {
      this.option = 1
    },
    setOptionToLibrary: function () {
      this.option = 2
    },
    setOptionToUser: function () {
      this.option = 3
    },
    setUserID: function (value) {
      this.userID = value
    },
    logOut: function () {
      store.commit('logOut')
      this.$router.push('/')
    }
  }
}

</script>

<style>
.linkis{
  text-decoration: underline;
  padding: 5px;
}
</style>
