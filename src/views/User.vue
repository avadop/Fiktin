<template>
  <div class="user">
      <div v-if=loggedIn>
        <div v-if=!edit>
            <p>Nick: {{ nick }}</p>
            <p>Nombre: {{ name }}</p>
            <p>email: {{ email }}</p>
            <b-img :src="this.picture" fluid width="250%" alt="No tienes imagen de perfil"></b-img>
            <b-button variant="primary" @click="switchEdit"> Modificar</b-button>
            <b-button variant="danger" class="mr-auto" @click="confirmDelete"> Eliminar</b-button>
        </div>
        <div v-else>
            <ModifyUser :email="email" :name="name" :userKey="userKey" :password="password" :picture="picture"
            @new-name="newName" @new-email="newEmail" @new-password="newPassword" @new-picture="newPicture" @flip-edit="switchEdit"/>
            <b-button variant="primary" class="mr-auto" @click="switchEdit"> Cancelar</b-button>
        </div>
    </div>
    <div v-else>
        <p>No tienes la sesion iniciada</p>
    </div>
  </div>
</template>

<script>
import { userCollection, librariesCollection, booksCollection } from '../firebase.js'
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
      picture: ''
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
      this.picture = data.profile_picture
    })
  },
  methods: {
    confirmDelete: function () {
      this.$modal.show('dialog', {
        text: '¿Está seguro que desea eliminar el usuario?',
        buttons: [
          {
            title: 'SI',
            default: true,
            handler: () => { this.deleteUser() }
          },
          {
            title: 'Cancelar'
          }
        ]
      })
    },
    deleteUser: async function () {
      await librariesCollection.where('user_id', '==', this.userKey).get().then(snapshot => {
        snapshot.forEach(doc => {
          librariesCollection.doc(doc.id).delete()
        })
      })
      await booksCollection.where('user_id', '==', this.userKey)
        .where('published', '==', false).get().then(snapshot => {
          snapshot.forEach(doc => {
            booksCollection.doc(doc.id).delete()
          })
        })
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
    newPicture (value) {
      this.picture = value
    },
    newEmail (value) {
      this.email = value
    },
    newPassword (value) {
      this.password = value
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

</style>
