<template>
  <div>
    <b-card>
      <div class="d-block text-center">
        <h5>Edite su texto emergente</h5>
      </div>
      <b-container fluid class="col">
        <label>Texto principal</label>
        <b-form-textarea
          v-model="mainText"
          :state="mainText.length <= 2000 && mainText.length > 0"
          :formatter="limit"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que quieres que se muestre..."
          rows="3"
          max-rows="6"
          @change="save()"
        ></b-form-textarea>
        <span v-if="mainText.length > 1900" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.mainText.length}} /2000</span>
        <b-form-invalid-feedback v-else-if="mainText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
      <b-container fluid class="col">
        <label>Texto emergente</label>
        <b-form-textarea
          v-model="popupText"
          :state="popupText.length <= 2000 && popupText.length > 0"
          :formatter="limit"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que se mostrara al emergentemente..."
          rows="3"
          max-rows="6"
          style="margin-bottom: 15px;"
          @change="save()"
        ></b-form-textarea>
        <span v-if="popupText.length > 1900" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.popupText.length}} /2000</span>
        <b-form-invalid-feedback v-else-if="popupText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
        <p v-if="addPicture === false && this.picture === ''" style="color: darkblue; font-weight: bold; cursor: pointer;" @click="addPicture = true">Añadir imagen al final del texto</p>
        <div v-if="addPicture === true || this.picture !== ''">
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
            <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="cancel()">Cancelar</b-button>
            <b-button id="button-modal-accept" class="mt-1" variant="primary" block @click="uploadPicture()" :disabled="picture === ''">Confirmar</b-button>
          </div>
        </div>
      </b-container>
      <div class="d-flex justify-content-center">
        <b-button variant="outline-secondary" @click="preview = !preview">Previsulizar</b-button>
      </div>
      <div v-show="preview">
        <hr>
        <span>{{ mainText }}<span @click="openPopupTextModal = !openPopupTextModal" style="cursor: pointer; color: #0a8df4;"> [...]</span></span>
        <b-modal v-model="openPopupTextModal" hide-footer hide-header scrollable centered>
          <p v-show="openPopupTextModal">{{popupText}}</p>
          <div v-html="htmlText"></div>
        </b-modal>
      </div>
    </b-card>
  </div>
</template>

<script>
import { storageFirebase } from '@/firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'popupText',
  props: {
    mainTextAux: String,
    popupTextAux: String,
    index: Number,
    lastPressed: Number,
    htmlTextAux: String,
    pictureAux: String
  },
  data () {
    return {
      mainText: this.mainTextAux,
      popupText: this.popupTextAux,
      htmlText: this.htmlTextAux,
      openPopupTextModal: false,
      preview: false,
      addPicture: false,
      picture: this.pictureAux,
      selectedFile: ''
    }
  },
  watch: {
    mainTextAux: function () {
      this.refresh()
    },
    popupTextAux: function () {
      this.refresh()
    },
    htmlTextAux: function () {
      this.refresh()
    },
    pictureAux: function () {
      this.refresh()
    },
    index: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.mainText = this.mainTextAux
      this.popupText = this.popupTextAux
      this.htmlText = this.htmlTextAux
      this.picture = this.pictureAux
    },
    onFileSelected () {
      if (this.selectedFile !== '' && this.selectedFile !== event.target.files[0]) {
        const storageRef = storageFirebase.ref(`/${store.state.userNick.toLowerCase()}/books/${store.state.openBookID}/popUpTextPictures/${this.index + '_gadget_' + this.selectedFile.name}`)
        storageRef.delete()
        this.selectedFile = event.target.files[0]
        this.onUpload()
      } else {
        this.selectedFile = event.target.files[0]
        this.onUpload()
      }
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/${store.state.userNick.toLowerCase()}/books/${store.state.openBookID}/popUpTextPictures/${this.index + '_gadget_' + this.selectedFile.name}`)
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
    uploadPicture: async function () {
      this.htmlText = ('<img src="' + this.picture + '" width="460" height="300" style="padding-top: 13px; padding-bottom: 13px;">')
      this.save()
    },
    cancel () {
      this.addPicture = false
      this.htmlText = ''
      this.picture = ''
      this.selectedFile = ''
      this.save()
    },
    save: async function () {
      this.$emit('html', this.mainText, this.popupText, this.htmlText, this.picture, this.index)
    },
    limit (value) {
      return String(value).substring(0, 2000)
    }
  }
}
</script>
