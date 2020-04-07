<template>
  <div class="user">
    <b-card>
      <form >
        <br>
        <p> Cambia los datos que desees modificar </p>
        <div class="row">
          <div class="col form-div">
            <!-- Imagen de perfil -->
            <b-container fluid class="col">
              <b-container sm="3">
                <label>Imagen de perfil:</label>
                <b-button v-if="this.newPicture != null" class="my-2" variant="danger-dark" @click="removeImg"><b-icon variant="danger" icon="x"></b-icon></b-button>
                <b-form-file v-show="this.uploadValue==0 && this.newPicture == null" @change="onFileSelected"
                  class="my-2"
                  placeholder="Selecciona una imagen o arrastrala aquí..."
                  drop-placeholder="Arrastra aquí la imagen..."
                  accept="image/*"></b-form-file>
              </b-container>
              <div class="card-img-box">
                <img class="card-img-top" :src="this.newPicture" alt="No has subido ninguna imagen">
              </div>
            </b-container>
          </div>

          <div class="center-col">
            <div class="col">
              <!-- Nombre -->
              <div class="d-flex">
                <b-icon class="h4" icon="person-lines-fill"></b-icon>
                <b-form-input
                  type="text"
                  v-model="newName"
                  class="ml-2 input-form"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Nombre"
                ></b-form-input>
              </div>
              <br>
              <!-- Email -->
              <div class="d-flex">
                <b-icon class="h4" icon="envelope"></b-icon>
                <b-form-input
                  type="text"
                  v-model="newEmail"
                  class="ml-2 input-form"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Email"
                ></b-form-input>
              </div>
              <br>
              <!-- Contraseña -->
              <div class="d-flex">
                <b-icon class="h4" icon="shield-lock"></b-icon>
                <b-form-input
                  v-if="newPassword.length == 0"
                  type="password"
                  v-model="newPassword"
                  class="ml-2 input-form"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Contraseña"
                ></b-form-input>
                <b-form-input
                  v-else
                  type="password"
                  v-model="newPassword"
                  class="ml-2 input-form"
                  :state="newPassword.length >= 6 && newPassword.length <= 12"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Contraseña"
                ></b-form-input>
                <b-form-invalid-feedback v-if='minPassword' id="input-live-feedback">
                  Mínimo 6 caracteres
                </b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="maxPassword" id="input-live-feedback">
                  Máximo 12 caracteres
                </b-form-invalid-feedback>
              </div>
              <br>
              <!-- Confirmar contraseña -->
              <div class="d-flex">
                <b-icon class="h4" icon="shield-lock-fill"></b-icon>
                <b-form-input
                  v-if="newPassword2.length == 0"
                  type="password"
                  v-model="newPassword2"
                  class="ml-2 input-form"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Confirmar contraseña"
                ></b-form-input>
                <b-form-input
                  v-else
                  type="password"
                  v-model="newPassword2"
                  class="ml-2 input-form"
                  :state="samePasswords"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Confirmar contraseña"
                ></b-form-input>
                <b-form-invalid-feedback v-if='!samePasswords' id="input-live-feedback">
                  Las contraseñas deben coincidir
                </b-form-invalid-feedback>
              </div>
            </div>
          </div>
        </div>

        <b-button variant="outline-secondary" class="mr-auto" @click="switchEdit"> Cancelar</b-button>
        <b-button variant="dark" type="submit" @click="update"> Confirmar</b-button>
      </form>
    </b-card>
  </div>
</template>

<script>
import { userCollection, storageFirebase } from '../firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'ModifyUser',
  data () {
    return {
      newName: '',
      newEmail: '',
      newPassword: '',
      newPassword2: '',
      newPicture: '',
      uploadValue: 0
    }
  },
  props: {
    userKey: String,
    email: String,
    name: String,
    password: String,
    picture: String
  },
  created () {
    this.newName = this.name
    this.newEmail = this.email
    this.newPassword = this.password
    this.newPassword2 = this.password
    this.newPicture = this.picture
  },
  methods: {
    removeImg () {
      this.newPicture = null
      this.uploadValue = 0
      this.selectedFile = ''
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
      this.onUpload()
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/img/profile_pictures/${store.state.userNick}/${this.selectedFile.name}`)
      const task = storageRef.put(this.selectedFile)
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        // downloadURL
        task.snapshot.ref.getDownloadURL().then((url) => {
          this.newPicture = url
          console.log(this.newPicture)
        })
      })
    },
    update: async function () {
      if (this.correctPassword) {
        if (this.validEmail) {
          if (this.samePasswords) {
            userCollection.doc(this.userKey).update({
              name: this.newName,
              email: this.newEmail,
              password: this.newPassword,
              profile_picture: this.newPicture
            })
            this.$emit('new-name', this.newName)
            this.$emit('new-email', this.newEmail)
            this.$emit('new-password', this.newPassword)
            this.$emit('new-picture', this.newPicture)
            this.$emit('flip-edit')
          } else {
            window.alert('Contraseñas diferentes')
          }
        } else {
          window.alert('Necesitas introducir un email valido')
        }
      } else {
        window.alert('Longitud de contraseña inválida')
      }
    },
    switchEdit () {
      this.$emit('switchEdit')
    }
  },
  computed: {
    samePasswords () {
      return this.newPassword === this.newPassword2
    },
    // Cumple el minimo requisito de password?
    minPassword () {
      return this.newPassword.length < 6 && this.newPassword.length > 0
    },
    // Se pasa del limite?
    maxPassword () {
      return this.newPassword.length > 12
    },
    validEmail () {
      return this.newEmail.includes('@') && this.newEmail.includes('.')
    },
    correctPassword () {
      return this.newPassword.length >= 6 && this.newPassword.length <= 12
    }
  }
}
</script>

<style>
.center-col {
  text-align: center;
  width: 50%;
}
.form-div {
  display: inline-block;
}
.card-img-box {
  text-align: center;
}
.card-img-top {
  display: inline-block;
  max-height: 200px;
  width: auto!important;
}
</style>
