<template>
  <div class="user">
    <form >
      <p> Cambia los datos que desees modificar </p>
      <label>Nickname</label>
      <br>
      <input v-model="newNick" type="text" :class="{red: exists}" placeholder="Maririta26"> <br>
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
import { userCollection } from '../firebase.js'

export default {
  name: 'ModifyUser',
  data () {
    return {
      same_nick: [],
      exists: false,
      newNick: '',
      newName: '',
      newEmail: ''
    }
  },
  props: {
    userKey: String,
    nick: String,
    email: String,
    name: String
  },
  created () {
    this.newNick = this.nick
    this.newName = this.name
    this.newEmail = this.email
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
      this.exists = !(this.same_nick.length === 0) && !(this.same_nick[0].nickToSearch === this.newNick.toLowerCase())
    }
  },
  methods: {
    update: function () {
      if (!this.exists) {
        this.$emit('modifications', this.newNick, this.newName, this.newEmail)
        userCollection.doc(this.userKey).update({
          name: this.newName,
          nick: this.newNick,
          email: this.newEmail,
          nickToSearch: this.newNick.toLowerCase()
        })
        // this.$emit('modifications', this.newNick, this.newName, this.newEmail)
        this.$emit('new-name', this.newName)
        this.$emit('new-nick', this.newNick)
        this.$emit('new-email', this.newEmail)
        this.$emit('flip-edit')
      } else {
        window.alert('Nombre de usuario ya en uso')
      }
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
