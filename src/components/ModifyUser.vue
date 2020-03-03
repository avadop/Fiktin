<template>
  <div class="user">
    <form >
      <br>
      <p> Cambia los datos que desees modificar </p>
      <label>Nombre</label>
      <br>
      <input v-model="newName" type="text" placeholder="Maria Martinez"> <br>
      <label>Email</label>
      <br>
      <input v-model="newEmail" type="text" placeholder="email@fiktin.com"> <br>
      <label>Contraseña</label>
      <br>
      <input v-model="newPassword" type="text" placeholder="123456"><br>
      <label>Confirmar contraseña</label>
      <br>
      <input v-model="newPassword2" type="text" :class="{red: !same_passwords}" placeholder="123456"><br>
      <button class="btn" type="submit" @click="update"> Confirmar</button>
    </form>
  </div>
</template>

<script>
import { userCollection } from '../firebase.js'

export default {
  name: 'ModifyUser',
  data () {
    return {
      newName: '',
      newEmail: '',
      newPassword: '',
      newPassword2: ''
    }
  },
  props: {
    userKey: String,
    email: String,
    name: String,
    password: String
  },
  created () {
    this.newName = this.name
    this.newEmail = this.email
    this.newPassword = this.password
    this.newPassword2 = this.password
  },
  methods: {
    update: async function () {
      if (this.same_passwords) {
        userCollection.doc(this.userKey).update({
          name: this.newName,
          email: this.newEmail,
          password: this.newPassword
        })
        this.$emit('new-name', this.newName)
        this.$emit('new-email', this.newEmail)
        this.$emit('flip-edit')
      } else {
        window.alert('Contraseñas diferentes')
      }
    }
  },
  computed: {
    same_passwords () {
      return this.newPassword === this.newPassword2
    }
  }
}
</script>

<style>
.btn {
    margin: 10px;
}
.red{
  border-color: crimson
}
</style>
