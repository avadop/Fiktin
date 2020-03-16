<template>
  <div class="new-user">
    <form >
      <h4> Introduce tus datos para crear un usuario </h4>
      <label>Nickname</label>
      <br>
      <input v-model="newNick" type="text" :class="{red_box: exists}" placeholder="Maririta26"><br>
      <span v-if="exists" class="red_letter">Nick ya existe</span><br v-if="exists">
      <span v-if="minNick && !exists" class="red_letter">Minimo 4 caracteres</span><br v-if="minNick && !exists">
      <span v-if="maxNick && !exists" class="red_letter">Nick muy largo (max. 10 caracteres)</span><br v-if="maxNick && !exists">
      <label>Nombre</label>
      <br>
      <input v-model="newName" type="text" placeholder="Maria Martinez"> <br>
      <label>Email</label>
      <br>
      <input v-model="newEmail" type="text" placeholder="email@fiktin.com"> <br>
      <label>Contraseña</label>
      <br>
      <input v-model="newPassword" type="password" placeholder="123456"><br>
      <span v-if="minPassword" class="red_letter">Minimo 6 caracteres</span><br v-if="minPassword">
      <span v-if="maxPassword" class="red_letter">Contraseña muy larga</span><br v-if="maxPassword">
      <label>Confirmar contraseña</label>
      <br>
      <input v-model="newPassword2" type="password" :class="{red_box: !samePasswords}" placeholder="123456"><br>
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
            <b-img :src="this.picture" fluid width="250%" alt="No has subido ninguna imagen"></b-img>
            <b-button v-if="this.picture != null" class="my-2" variant="danger" @click="removeImg">Eliminar imagen</b-button>
          </b-col>
        </b-row>
      </b-container>

      <b-button variant="success" type="submit" @click="addUser"> Crear</b-button>
    </form>
  </div>
</template>

<script>

import { userCollection, librariesCollection, storageFirebase } from '@/firebase.js'

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
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
      this.onUpload()
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/img/profile_pictures/${this.newNick.toLowerCase()}/${this.selectedFile.name}`)
      const task = storageRef.put(this.selectedFile)
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.UploadValue = 100
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
                this.$emit('switch-create')
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
.red_box{
  border-style: solid;
  border-width: 1px;
  border-color: crimson;
}
.red_letter{
  color: crimson;
}
</style>
