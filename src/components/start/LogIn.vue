<template>
  <div class="log-in">
    <h3> Iniciar sesión </h3>
    <div class="form-div">
      <div class="d-flex">
        <b-icon class="h4" icon="person"></b-icon>
        <b-form-input
          trim
          type="text"
          v-model="nick"
          class="ml-2 input-form"
          @keyup.enter="logIn"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Usuario"
        ></b-form-input>
      </div>
      <br>
      <div class="d-flex">
        <b-icon class="h4" icon="shield-lock"></b-icon>
        <b-form-input
          trim
          type="password"
          v-model="password"
          class="ml-2 input-form"
          @keyup.enter="logIn"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Contraseña"
        ></b-form-input>
      </div>
    </div>
    <br>
    <br>
    <b-button variant="light" style="font-size: 16px;" @click="switchCreate">Crear Usuario</b-button>
    <b-button variant="dark" style="font-size: 16px;" @click="logIn">Entrar</b-button>
  </div>
</template>

<script>
import { userCollection } from '@/firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'LogIn',
  props: {
    url: String
  },
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
          this.$router.push(this.url)
        } else {
          window.alert('Contraseña incorrecta')
        }
      }
    },
    switchCreate () {
      this.$emit('switchCreate')
    }
  }
}
</script>

<style>
.input-form {
  max-width:200px;
}
.log-in {
  text-align: center;
}
.form-div {
  display: inline-block;
}
h3 {
  padding-bottom: 10px;
}
.btn-secondary {
    color: #fff;
    background-color: #838c95;
    border-color: #838c95;
}
</style>
