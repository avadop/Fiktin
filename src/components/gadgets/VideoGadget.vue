<template>
  <div>
     <b-modal v-if="(this.lastPressed === this.index)" id="modal-video" v-model="openModal" hide-footer hide-header no-close-on-backdrop>
        <div class="d-block text-center">
          <p>Elija el video que desea añadir</p>
        </div>
        <b-container fluid class="col">
          <b-form-file
            @change="onFileSelected"
            class="my-2"
            placeholder="Selecciona un video o arrastrala aquí..."
            drop-placeholder="Arrastra aquí el video..."
            accept="video/*"
          ></b-form-file>

          <div id="optionsCheckbox" label="Opciones de reproduccion">
              <b-form-checkbox
                id="checkbox-autoplay"
                v-model="autoplay"
                name="checkbox-autoplay"
                value="true"
                unchecked-value="false">
                Autorreproducción
              </b-form-checkbox>
              <b-form-checkbox
                id="checkbox-loop"
                v-model="loop"
                name="checkbox-loop"
                value="true"
                unchecked-value="false">
                Bucle
              </b-form-checkbox>
          </div>

          <b-row class="my-1">
            <p v-if="this.selectedFile !== '' && this.video === ''">Espere a que cargue el video</p>
            <iframe v-if="this.video !== ''" :src="this.video" fluid width="250%"></iframe>
          </b-row>
        </b-container>
        <div class="d-flex justify-content-center">
          <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="cancelar()">Cancelar</b-button>
          <b-button id="button-modal-accept" class="mt-1" variant="primary" block @click="createButton" :disabled="video === ''">Confirmar</b-button>
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
  name: 'videoGadget',
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
      video: '',
      autoplay: false,
      loop: false
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
          this.video = url
        })
      })
    },
    createButton: async function () {
      var htmlText = '<video width="460" height="300" controls'
      if (this.autoplay) {
        htmlText = htmlText + ' autoplay '
      }
      if (this.loop) {
        htmlText = htmlText + ' loop '
      }
      htmlText = htmlText + '><source src="' + this.video +
        ' type="' + this.type + '">No se puede reproducir el video en este navegador</video>'

      this.autoplay = false
      this.loop = false
      this.$emit('html', htmlText, this.index)
    },
    cancelar () {
      this.autoplay = false
      this.loop = false
      this.$emit('cancel-video')
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
