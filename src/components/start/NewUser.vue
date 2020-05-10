<template>
  <div class="new-user">
    <form >
      <h3>Registro</h3>
      <div class="form-div">
        <!-- Usuario -->
        <div class="d-flex">
          <b-icon class="h4" icon="person"></b-icon>
          <b-form-input
            v-if="newNick.length === 0"
            type="text"
            trim
            v-model="newNick"
            class="ml-2 input-form"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Usuario"
          ></b-form-input>
          <b-form-input
            v-else
            type="text"
            trim
            v-model="newNick"
            class="input-form"
            :state="!exists && newNick.length >= 4 && newNick.length <= 10"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Usuario"
          ></b-form-input>
          <b-form-invalid-feedback v-if='exists' id="input-live-feedback">
            Nombre se usuario ya existente
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if='newNick.length < 4' id="input-live-feedback">
            Mínimo 4 caracteres
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else-if="newNick.length > 10" id="input-live-feedback">
            Máximo 10 caracteres
          </b-form-invalid-feedback>
        </div>
        <br>
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
              v-if="newPassword.length === 0"
              type="password"
              v-model="newPassword"
              class="ml-2 input-form"
              trim
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Contraseña"
            ></b-form-input>
            <b-form-input
              v-else
              type="password"
              v-model="newPassword"
              class="ml-2 input-form"
              trim
              :state="newPassword.length >= 6 && newPassword.length <= 12"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Contraseña"
            ></b-form-input>
            <b-form-invalid-feedback v-if='newPassword.length > 0 && newPassword.length < 6' id="input-live-feedback">
              Mínimo 6 caracteres
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="newPassword.length > 0 && newPassword.length > 12" id="input-live-feedback">
              Máximo 12 caracteres
            </b-form-invalid-feedback>
          </div>
        <br>
        <!-- Confirmar contraseña -->
        <div class="d-flex">
          <b-icon class="h4" icon="shield-lock-fill"></b-icon>
          <b-form-input
            v-if="newPassword2.length === 0"
            trim
            type="password"
            v-model="newPassword2"
            class="ml-2 input-form"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Confirmar contraseña"
          ></b-form-input>
          <b-form-input
            v-else
            trim
            type="password"
            v-model="newPassword2"
            class="ml-2 input-form"
            :state="newPassword2 === newPassword"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Confirmar contraseña"
          ></b-form-input>
          <b-form-invalid-feedback v-if='newPassword2.length > 0 && newPassword2 !== newPassword' id="input-live-feedback">
            Las contraseñas deben coincidir
          </b-form-invalid-feedback>
        </div>
      </div>
      <br>
      <br>
      <!-- Imagen de perfil -->
      <b-container fluid class="col">
        <b-container sm="3">
          <label>Imagen de perfil:</label>
          <b-button v-if="this.picture != null" class="my-2" variant="danger-dark" @click="removeImg"><b-icon variant="danger" icon="x"></b-icon></b-button>
          <b-form-file v-show="this.uploadValue==0 && this.picture == null" @change="onFileSelected"
            class="my-2"
            placeholder="Selecciona una imagen o arrastrala aquí..."
            drop-placeholder="Arrastra aquí la imagen..."
            accept="image/*"></b-form-file>
        </b-container>
        <div class="card-img-box">
          <img class="card-img-top" :src="this.picture" alt="No has subido ninguna imagen">
        </div>
      </b-container>

      <b-button variant="light" @click="switchCreate">Iniciar sesión</b-button>
      <b-button variant="dark" type="submit" @click="addUser">Crear</b-button>
    </form>
  </div>
</template>

<script>

import { userCollection, librariesCollection, storageFirebase, defaultImageUser } from '@/firebase.js'

export default {
  name: 'NewUser',
  data () {
    return {
      newNick: '',
      newName: '',
      newEmail: '',
      newPassword: '',
      newPassword2: '',
      sameNick: [],
      exists: false,
      picture: null,

      selectedFile: null,
      uploadValue: 0
    }
  },
  watch: {
    newNick: {
      inmediate: true,
      handler (newNick) {
        this.$bind('sameNick', userCollection.where('nick_to_search', '==', this.newNick.toLowerCase()).limit(1)).then(docs => {
        })
      }
    },
    sameNick: function () {
      this.exists = !(this.sameNick.length === 0)
    }
  },
  methods: {
    removeImg () {
      this.picture = null
      this.uploadValue = 0
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
      this.onUpload()
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/${this.newNick.toLowerCase()}/profile_pictures/${this.selectedFile.name}`)
      const task = storageRef.put(this.selectedFile)
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        // downloadURL
        task.snapshot.ref.getDownloadURL().then((url) => {
          this.picture = url
          console.log(this.picture)
        })
      })
    },
    addUser: async function () {
      if (this.correctNick) {
        if (this.correctPassword) {
          if (!this.exists) { //  Si no existe user con el mismo nick, creamos usu
            if (this.validEmail) {
              if (this.samePasswords) {
                var historial = this.newNick.toLowerCase() + '_historial'
                var obras = this.newNick.toLowerCase() + '_mis_obras'
                if (this.picture === null) this.picture = defaultImageUser

                let doc = await userCollection.add({
                  nick: this.newNick,
                  name: this.newName,
                  email: this.newEmail,
                  password: this.newPassword,
                  profile_picture: this.picture,
                  nick_to_search: this.newNick.toLowerCase()
                })

                librariesCollection.doc(historial).set({
                  name: 'Historial',
                  description: ('Aqui se guardaran los ultimos libros consultados de ' + this.newNick),
                  privacy: 'private',
                  nick: this.newNick,
                  array_keys: [],
                  user_id: doc.id
                })

                librariesCollection.doc(obras).set({
                  name: 'Mis obras',
                  description: ('Aqui se guardaran tus libros escritos de ' + this.newNick),
                  privacy: 'private',
                  nick: this.newNick,
                  array_keys: [],
                  user_id: doc.id
                })
                this.newNick = ''
                this.newPassword = ''
                this.newEmail = ''
                this.newName = ''
                this.newPassword2 = ''
                this.picture = ''
                this.$emit('switchCreate')
              } else {
                window.alert('Contraseñas diferentes')
              }
            } else {
              window.alert('Necesitas introducir un email valido')
            }
          } else {
            window.alert('El usuario existe')
          }
        } else {
          window.alert('Longitud de contraseña inválida')
        }
      } else {
        window.alert('Longitud de nick inválida')
      }
    },
    switchCreate () {
      this.$emit('switchCreate')
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
    minNick () {
      return this.newNick.length < 4 && this.newNick.length > 0
    },
    maxNick () {
      return this.newNick.length > 10
    },
    correctPassword () {
      return this.newPassword.length >= 6 && this.newPassword.length <= 12
    },
    correctNick () {
      return this.newNick.length >= 4 && this.newNick.length <= 10
    },
    validEmail () {
      return this.newEmail.includes('@') && this.newEmail.includes('.')
    }
  }
}
</script>

<style>
.new-user {
  text-align: center;
}
.btn-secondary {
    color: #fff;
    background-color: #838c95;
    border-color: #838c95;
}
.card-img-box {
  text-align: center;
}
.card-img-top {
  display: inline-block;
  max-height: 200px;
  width: auto!important;
}
h3 {
  padding-bottom: 10px;
}
</style>
