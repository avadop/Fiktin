<template>
  <div class="user">
    <p> {{user}} </p>
    <p>Nick: {{ nick }}</p>
    <p>Nombre: {{ name }}</p>
    <p>email: {{ email }}</p>
    <button class="btn"> Modificar</button>
    <button class="btn" @click="deleteUser"> Eliminar</button>
  </div>
</template>

<script>
import { userCollection } from '../firebase.js'
import { store } from '../store/index.js'

export default {
  name: 'NewUser',
  data () {
    return {
      nick: '',
      email: '',
      name: ''
    }
  },
  props: {
    userKey: {
      type: String,
      default: ''
    },
    user: {
      default: null
    }
  },
  // mounted () {
  //   userCollection.doc(this.userKey).get().then(doc => {
  //     console.log(doc.data())
  //   })
  // },
  watch: {
    userKey: {
      inmediate: true,
      handler (userKey) {
        this.$bind('user', userCollection.doc(this.userKey).get().then(doc => { }))
      }
    }
  },
  methods: {
    deleteUser: function () {
      userCollection.doc(this.userKey).delete()
      store.commit('logOut')
      this.$router.push('/')
    }
  }
}
</script>

<style>
.btn {
    margin: 10px;
}
</style>
