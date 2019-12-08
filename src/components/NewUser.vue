<template>
  <div class="new-user">
    <form >
      <p> Introduce tus datos para crear un usuario </p>
      <label>Nickname</label>
      <br>
      <input v-model="newNick" type="text" placeholder="Maririta26"> <br>
      <label>Nombre</label>
      <br>
      <input v-model="newName" type="text" placeholder="Maria Martinez"> <br>
      <label>Email</label>
      <br>
      <input v-model="newEmail" type="text" placeholder="email@fiktin.com"> <br>
      <label>Contraseña</label>
      <br>
      <input v-model="newPassword" type="text" placeholder="123456"><br>
      <button type="submit" class="btn" @click="addUser"> Crear</button>
    </form>
  </div>
</template>

<script>

import { userCollection } from '../firebase.js'

export default {
  name: 'NewUser',
  data () {
    return {
      newNick: '',
      newName: '',
      newEmail: '',
      newPassword: '',
      msg: ''
    }
  },
  methods: {
    addUser: function () {
      userCollection.add({
        nick: this.newNick,
        name: this.newName,
        email: this.newEmail,
        password: this.newPassword
      })
      this.newNick = ''
      this.newPassword = ''
      this.newEmail = ''
      this.newName = ''
    }
  }
}
</script>

<style>
.btn {
    margin: 5px;
}
</style>
