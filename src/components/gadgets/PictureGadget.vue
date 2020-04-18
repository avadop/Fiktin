<template>
  <div>
     <b-modal v-if="(this.lastPressed === this.index)" id="modal-picture" v-model="openModal" hide-footer hide-header no-close-on-backdrop>
        <div class="d-block text-center">
          <h5>Elija la imagen que desea añadir</h5>
        </div>
        <b-container fluid class="col">
          <b-form-file
            @change="onFileSelected"
            class="my-2"
            placeholder="Selecciona una imagen o arrastrala aquí..."
            drop-placeholder="Arrastra aquí la imagen..."
            accept="image/*"
          ></b-form-file>
          <b-row class="my-1">
            <p v-if="this.selectedFile !== '' && this.picture === ''">Espere a que cargue la imagen</p>
            <b-img v-if="this.picture !== ''" :src="this.picture" fluid width="250%"></b-img>
          </b-row>
        </b-container>
        <div class="d-flex justify-content-center">
          <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="cancelar()">Cancelar</b-button>
          <b-button id="button-modal-accept" class="mt-1" variant="primary" block @click="createButton" :disabled="picture === ''">Confirmar</b-button>
        </div>
      </b-modal>
      <div v-if="htmlTextAux !== ''" v-html="htmlTextAux">
      </div>
  </div>
</template>

<script>
import { storageFirebase } from '@/firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'pictureGadget',
  props: {
    index: Number,
    bookID: String,
    htmlTextAux: String,
    openModal: Boolean,
    lastPressed: Number
  },
  data () {
    return {
      selectedFile: '',
      picture: ''
    }
  },
  methods: {
    onFileSelected () {
      if (this.selectedFile !== '' && this.selectedFile !== event.target.files[0]) {
        const storageRef = storageFirebase.ref(`/${store.state.userNick.toLowerCase()}/books/${this.bookID}/multimedia/${this.index + '_gadget_' + this.selectedFile.name}`)
        storageRef.delete()
        this.selectedFile = event.target.files[0]
        this.onUpload()
      } else {
        this.selectedFile = event.target.files[0]
        this.onUpload()
      }
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/${store.state.userNick.toLowerCase()}/books/${this.bookID}/multimedia/${this.index + '_gadget_' + this.selectedFile.name}`)
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
        })
      })
    },
    createButton: async function () {
      var htmlText = ('<img src="' + this.picture + '" width="460" height="300" style="padding-top: 13px; padding-bottom: 13px;">')
      this.$emit('html', htmlText, this.index)
    },
    cancelar () {
      this.$emit('cancel-picture')
    }
  },
  computed: {
    allowCreate () {
      return this.picture === ''
    }
  }
}
</script>

<style scoped>
.editme {
  outline: 0px solid transparent;
  cursor: text;
  display: block;
  min-height: 28px;
}
</style>

<style>
#button-modal-accept {
  width: 115px;
}
#button-modal-return {
  width: 130px;
}
</style>
