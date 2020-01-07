<template>
  <div class="log-in">
      <h4> Log In </h4>
      <label>Nickname</label> <br>
      <input v-model="nick" type="text" placeholder="Maririta26"> <br>
      <label>Contraseña</label> <br>
      <input v-model="password" type="text" placeholder="123456"><br>
    <button class="btn" @click="logIn"> Sign In</button>
  </div>
</template>

<script>
import { userCollection } from '@/firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'LogIn',
  data () {
    return {
      nick: '',
      password: '',
      user: [],
      same_nick: false,
      same_psw: false
    }
  },
  methods: {
    logIn: async function () {
      await this.$bind('user', userCollection.where('nick_to_search', '==', this.nick.toLowerCase()).limit(1)).then(docs => {})
      if (this.user.length === 0) {
        window.alert('Usuario no existe')
      } else {
        if (this.user[0].password === this.password) {
          store.commit('logIn', this.user[0].id)
          store.commit('nickChange', this.user[0].nick)
          this.nick = ''
          this.password = ''
          this.$emit('loggedIn')
          this.$router.push('/home')
        } else {
          window.alert('Contraseña incorrecta')
        }
      }
    }
  }
}
</script>

<style>
.btn {
    margin: 5px;
    font-size: 20px;
}
</style>
