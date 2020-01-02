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
import { userCollection, librariesCollection } from '../firebase.js'

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
        this.$bind('same_nick', userCollection.where('nick_to_search', '==', this.newNick.toLowerCase()).limit(1)).then(docs => {
        })
      }
    },
    same_nick: function () {
      this.exists = !(this.same_nick.length === 0) && !(this.same_nick[0].nick_to_search === this.newNick.toLowerCase())
    }
  },
  methods: {
    update: async function () {
      if (!this.exists) {
        //  Si son distintos hay que updatear las libraries
        if (this.newNick !== this.nick) {
          await this.updateLibraries()
        }
        var historial = this.newNick.toLowerCase() + '_historial'
        var obras = this.newNick.toLowerCase() + '_mis_obras'
        userCollection.doc(this.userKey).update({
          name: this.newName,
          nick: this.newNick,
          email: this.newEmail,
          nick_to_search: this.newNick.toLowerCase(),
          clave_bibliotecas: [historial, obras]
        })
        // this.$emit('modifications', this.newNick, this.newName, this.newEmail)
        this.$emit('new-name', this.newName)
        this.$emit('new-nick', this.newNick)
        this.$emit('new-email', this.newEmail)
        this.$emit('flip-edit')
      } else {
        window.alert('Nombre de usuario ya en uso')
      }
    },
    updateLibraries: async function () {
      var libraries
      await userCollection.doc(this.userKey).get().then(doc => {
        const data = doc.data()
        libraries = data.clave_bibliotecas
      })
      var historial = '_historial'
      var obras = '_mis_obras'
      libraries.forEach(async element => {
        if ((element === (this.nick.toLowerCase() + historial)) || (element === (this.nick.toLowerCase() + obras))) {
          var libData
          await librariesCollection.doc(element).get().then(doc => {
            var data = doc.data()
            data.nick = this.newNick
            libData = data
          })
          console.log(element)
          librariesCollection.doc(element).delete()
          if (element === this.nick.toLowerCase() + historial) {
            librariesCollection.doc(this.newNick.toLowerCase() + historial).set(libData)
          } else {
            librariesCollection.doc(this.newNick.toLowerCase() + obras).set(libData)
          }
        } else {
          librariesCollection.doc(element).update({
            nick: this.newNick
          })
        }
      })
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
