<template>
  <div class="user">
    <b-card class="background-card">
      <div v-if=loggedIn>
        <b-list-group-item v-if=!edit>
          <div class="d-flex justify-content-start">
            <!-- Img perfil -->
            <div class="card-img-box">
              <img class="card-img-top" :src="this.picture" alt="Imgane de perfil">
            </div>
            <div>
              <br>
              <!-- nick -->
              <div class="d-flex justify-content-start">
                <h4>{{ nick }}</h4>
              </div>
              <!-- nombre -->
              <div class="d-flex justify-content-start">
                <h6 class="user-name">{{ name }}</h6>
              </div>
              <!-- mail -->
              <div class="d-flex justify-content-start">
                <p><b-icon icon="envelope"></b-icon> {{ email }}</p>
              </div>
              <!-- botones -->
              <div class="d-flex mr-1 buttons">
                <b-button variant="outline-dark" @click="switchEdit" style="font-size: 16px;"> Modificar</b-button>
                <b-button variant="danger" class="mr-auto" @click="modal = true" style="font-size: 16px;"> Eliminar</b-button>
              </div>
            </div>
          </div>
        </b-list-group-item>
        <div v-else>
            <ModifyUser :email="email" :name="name" :userKey="userKey" :password="password" :picture="picture"
            @new-name="newName" @new-email="newEmail" @new-password="newPassword" @new-picture="newPicture" @flip-edit="switchEdit" @switchEdit="switchEdit"/>
        </div>

        <b-modal id="modal-delete" v-model="modal" hide-footer hide-header no-close-on-backdrop>
          <div class="d-block text-center">
            <h3>Eliminar usuario</h3>
            <p>¿Está seguro que desea eliminar usuario?</p>
            <span> Una vez realizado dicha operación no se podrá volver atrás </span>
          </div>
          <div id="buttons-layout" class="d-flex justify-content-center">
            <b-button id="modal-buttons" style="font-size: 16px;" class="mt-2" variant="primary" block @click="modal = false">Cancelar</b-button>
            <b-button id="modal-buttons" style="font-size: 16px;" class="mt-2" variant="outline-danger" block @click="deleteUser">ELIMINAR</b-button>
          </div>
        </b-modal>
      </div>

      <div v-else>
          <p>No tienes la sesion iniciada</p>
      </div>
    </b-card>
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
      picture: '',
      modal: false
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
    deleteUser: async function () {
      await librariesCollection.where('user_id', '==', this.userKey).get().then(snapshot => {
        snapshot.forEach(doc => {
          librariesCollection.doc(doc.id).delete()
        })
      })
      await booksCollection.where('user_id', '==', this.userKey)
        .get().then(snapshot => {
          snapshot.forEach(doc => {
            booksCollection.doc(doc.id).delete()
          })
        })
      userCollection.doc(this.userKey).delete()
      this.$emit('deleteUser')
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

<style scoped>
.background-card {
  background-color: #e2e7ec;
}
.card-img-box {
  text-align: center;
  min-width: 260px;
}
.card-img-top {
  display: block;
  max-height: 140px;
  width: auto;
}
.user-name {
  color: #7b8793;
}
.buttons {
  position: absolute;
  left: 0;
  right: 95px;
  margin-left: auto;
  margin-right: auto;
  bottom: 10px;
  width: 106px;
}
.card-body {
  padding-left: 60px;
  padding-right: 60px;
}

</style>

<style>
#modal-delete {
  margin-top: 180px;
}
#buttons-layout {
  padding-top:12px;
}

#modal-buttons {
  width:150px;
}
</style>
