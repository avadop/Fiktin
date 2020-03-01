<template>
  <div class="user">
    <form >
      <p> Cambia los datos que desees modificar </p>
      <label>Nombre</label>
      <br>
      <input v-model="newName" type="text" placeholder="Maria Martinez"> <br>
      <label>Email</label>
      <br>
      <input v-model="newEmail" type="text" placeholder="email@fiktin.com"> <br>
      <button class="btn" type="submit" @click="update"> Confirmar</button>
    </form>
  </div>
</template>

<script>
import { userCollection, librariesCollection } from '../firebase.js'

export default {
  name: 'ModifyUser',
  data () {
    return {
      newName: '',
      newEmail: ''
    }
  },
  props: {
    userKey: String,
    email: String,
    name: String
  },
  created () {
    this.newName = this.name
    this.newEmail = this.email
  },
  methods: {
    update: async function () {
      // this.$emit('modifications', this.newName, this.newEmail)
      this.$emit('new-name', this.newName)
      this.$emit('new-email', this.newEmail)
      this.$emit('flip-edit')
      
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
