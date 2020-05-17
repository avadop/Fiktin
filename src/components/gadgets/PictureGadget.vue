<template>
  <div>
    <b-card>
      <div class="d-flex justify-content-start">
        <h6 class="title">Elija la imagen que desea añadir</h6>
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
          <b-img v-if="this.picture !== ''" :src="this.picture" style="min-height: 200px; max-height: 200px; width: auto;padding-top: 13px; padding-bottom: 13px;"></b-img>
        </b-row>
      </b-container>
    </b-card>

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
    pictureAux: String
  },
  data () {
    return {
      selectedFile: '',
      picture: this.pictureAux
    }
  },
  watch: {
    picture () {
      this.save()
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
    save: async function () {
      var htmlText = ('<img src="' + this.picture + '" style="min-height: 200px; max-height: 200px; width: auto;padding-top: 13px; padding-bottom: 13px;">')
      this.$emit('html', htmlText, this.picture, this.index)
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
