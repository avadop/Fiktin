<template>
  <div>
     <b-modal id="modal-video" v-model="openModal" hide-footer hide-header>
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
          <b-row class="my-1">
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
    openModal: Boolean
  },
  data () {
    return {
      selectedFile: '',
      video: ''
    }
  },
  mounted () {
    if (this.openModal || this.htmlTextAux === '') {
      this.$bvModal.show('modal-video')
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
      var htmlText = ('<video width="460" height="300" controls><source src="' + this.video +
        ' type="' + this.type + '">No se puede reproducir el video en este navegador</video>')
      this.$emit('html', htmlText, this.index)
    },
    cancelar () {
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
