<template>
  <div class="new-user">
    <form >
      <p> Introduce tus datos para crear un usuario </p>
      <label>Nickname</label>
      <br>
      <input v-model="newNick" type="text" :class="{red: exists}" placeholder="Maririta26"> <br>
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
      same_nick: [],
      exists: false
    }
  },
  watch: {
    newNick: {
      inmediate: true,
      handler (newNick) {
        this.$bind('same_nick', userCollection.where('nickToSearch', '==', this.newNick.toLowerCase()).limit(1)).then(docs => {
        })
      }
    },
    same_nick: function () {
      this.exists = !(this.same_nick.length === 0)
    }
  },
  methods: {
    addUser: function () {
      if (!this.exists) { //  Si no existe user con el mismo nick, creamos usu
        userCollection.add({
          nick: this.newNick,
          name: this.newName,
          email: this.newEmail,
          password: this.newPassword,
          nickToSearch: this.newNick.toLowerCase()
        })
        this.newNick = ''
        this.newPassword = ''
        this.newEmail = ''
        this.newName = ''
      } else {
        window.alert('El usuario existe ')
      }
    }
  }
}
</script>

<style>
.btn {
    margin: 5px;
}
.red{
  border-color: crimson
}
</style>
