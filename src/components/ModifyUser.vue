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
      <span v-if="minPassword" class="red_letter">Minimo 6 caracteres</span><br v-if="minPassword">
      <span v-if="maxPassword" class="red_letter">Contraseña muy larga</span><br v-if="maxPassword">
      <label>Confirmar contraseña</label>
      <br>
      <input v-model="newPassword2" type="text" :class="{red_box: !samePasswords}" placeholder="123456"><br>
      <span v-if="!samePasswords" class="red_letter">Las contraseñas deben coincidir</span><br>

      <!-- Imagen de perfil -->
      <b-container fluid class="col">
        <b-row class="my-1">
          <b-container sm="3">
            <label>Portada</label>
            <b-form-file @change="onFileSelected"
              class="my-2"
              placeholder="Selecciona una imagen o arrastrala aquí..."
              drop-placeholder="Arrastra aquí la imagen..."
              accept="image/*"></b-form-file>
          </b-container>
        </b-row>
        <b-row class="my-1">
          <b-col sm="9">
            <b-img :src="this.newPicture" fluid width="250%" alt="No has subido ninguna imagen"></b-img>
            <b-button v-if="this.newPicture != null" class="my-2" variant="danger" @click="removeImg">Eliminar imagen</b-button>
          </b-col>
        </b-row>
      </b-container>

      <b-button variant="success" type="submit" @click="update"> Confirmar</b-button>
    </form>
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
      newPicture: ''
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
        this.UploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.UploadValue = 100
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
.red_box{
  border-style: solid;
  border-width: 1px;
  border-color: crimson;
}
.red_letter{
  color: crimson;
}
</style>
