<template>
  <div>
    <b-card>
        <div class="d-flex justify-content-start">
        <h6 class="title">Elija el video que desea añadir</h6>
      </div>

      <b-container fluid class="col">
        <b-form-file
          @change="onFileSelected"
          class="my-2"
          placeholder="Selecciona un video"
          drop-placeholder="Arrastra aquí el video..."
          accept="video/*"
        ></b-form-file>

        <div id="optionsCheckbox" label="Opciones de reproduccion">
            <b-form-checkbox v-model="autoplay"
              value="true" unchecked-value="false" >
              Autorreproducción
            </b-form-checkbox>
            <b-form-checkbox v-model="loop"
              value="true" unchecked-value="false" >
              Bucle
            </b-form-checkbox>
        </div>

        <b-row class="my-1">
          <p v-if="this.selectedFile !== '' && this.video === ''">Espere a que cargue el video</p>
          <iframe v-if="this.video !== ''" :src="this.video"></iframe>
        </b-row>
      </b-container>
    </b-card>
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
    videoAux: String,
    autoplayAux: String,
    loopAux: String
  },
  data () {
    return {
      selectedFile: '',
      video: this.videoAux,
      autoplay: this.autoplayAux,
      loop: this.loopAux
    }
  },
  watch: {
    autoplay () {
      this.save()
    },
    loop () {
      this.save()
    },
    autoplayAux () {
      this.refresh()
    },
    loopAux () {
      this.refresh()
    },
    videoAux () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.autoplay = this.autoplayAux
      this.loop = this.loopAux
      this.video = this.videoAux
    },
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
          this.save()
        })
      })
    },
    save: async function () {
      var htmlText = '<video width="460" height="300" style="padding-top: 13px; padding-bottom: 13px;" controls'
      if (this.autoplay === 'true') {
        htmlText = htmlText + ' autoplay '
      }
      if (this.loop === 'true') {
        htmlText = htmlText + ' loop '
      }
      htmlText = htmlText + '><source src="' + this.video + '">No se puede reproducir el video en este navegador</video>'

      this.$emit('html', htmlText, this.video, this.autoplay, this.loop, this.index)
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
#optionsCheckbox {
  padding: 10px;
}
#button-modal-accept {
  width: 115px;
}
#button-modal-return {
  width: 130px;
}
</style>
