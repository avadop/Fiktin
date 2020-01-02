<template>
  <div class="user">
      <div v-if=loggedIn>
        <div v-if=!edit>
            <p>Nick: {{ nick }}</p>
            <p>Nombre: {{ name }}</p>
            <p>email: {{ email }}</p>
            <button class="btn" @click="switchEdit"> Modificar</button>
            <button class="btn" @click="deleteUser"> Eliminar</button>
        </div>
        <div v-else>
            <ModifyUser :email="email" :nick="nick" :name="name" :userKey="userKey" @new-name="newName"
            @new-nick="newNick" @new-email="newEmail" @flip-edit="switchEdit"/>
            <!-- <ModifyUser :email="email" :nick="nick" :name="name" @updateData="modifications"/> -->
            <button class="btn" @click="switchEdit"> Cancelar</button>
        </div>
    </div>
    <div v-else>
        <p>No tienes la sesion iniciada</p>
    </div>
  </div>
</template>

<script>
import { userCollection, librariesCollection } from '../firebase.js'
import ModifyUser from '@/components/ModifyUser.vue'
import { store } from '../store/index.js'

export default {
  name: 'User',
  components: {
    ModifyUser
  },
  data () {
    return {
      nick: '',
      email: '',
      name: '',
      password: '',
      edit: false,
      userKey: '',
      libraryKeys: []
    }
  },
  mounted () {
    this.userKey = store.state.userID
    userCollection.doc(this.userKey).get().then(doc => {
      const data = doc.data()
      this.nick = data.nick
      this.email = data.email
      this.name = data.name
      this.password = data.password
      this.libraryKeys = data.clave_bibliotecas
    })
  },
  methods: {
    deleteUser: function () {
      this.deleteLibraries()
      userCollection.doc(this.userKey).delete()
      store.commit('logOut')
      this.$router.push('/')
    },
    switchEdit: function () {
      this.edit = !this.edit
    },
    newName (value) {
      this.name = value
    },
    newNick (value) {
      this.nick = value
    },
    newEmail (value) {
      this.email = value
    },
    deleteLibraries: async function () {
      await this.libraryKeys.forEach(element => {
        librariesCollection.doc(element).delete()
      })
    }
  },
  computed: {
    loggedIn () {
      return !(this.userKey === '')
    }
  }
}
</script>

<style>
.btn {
    margin: 10px;
}
</style>
