<template>
  <div class="log-in">
      <p> Log In </p>
      <label>Nickname</label> <br>
      <input v-model="nick" type="text" placeholder="Maririta26"> <br>
      <label>Contraseña</label> <br>
      <input v-model="password" type="text" placeholder="123456"><br>
    <button class="btn" @click="logIn"> Sign In</button>
  </div>
</template>

<script>

import { userCollection } from '../firebase.js'
import { store } from '../store/index.js'

export default {
  name: 'LogIn',
  data () {
    return {
      nick: '',
      password: '',
      user: []
    }
  },
  methods: {
    logIn: async function () {
      await this.$bind('user', userCollection.where('nickToSearch', '==', this.nick.toLowerCase()).limit(1)).then(docs => {})
      if (this.user.length === 0) {
        window.alert('Usuario no existe')
      } else {
        if (this.user[0].password === this.password) {
          store.commit('logIn', this.user[0].id)
          this.nick = ''
          this.password = ''
          this.$router.push('/home')
        } else {
          window.alert('Contraseña incorrecta')
        }
      }
    }
  },
  computed: {
    getUser () {
      return store.state.userID
    }
  }
}
</script>

<style>
.btn {
    margin: 5px;
}
</style>
