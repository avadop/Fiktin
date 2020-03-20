<template>
  <div class="modify" >
    <b-card>
      <h4>Editar libro</h4>
      <b-container class="row">
        <b-container class="col">
          <!-- titulo -->
          <b-container fluid class="row">
            <b-row class="my-1">
              <b-form-group>
                <label>Título</label>
                <b-form-input
                  type="text"
                  v-model="title"
                  :state="!repited && title.length >= 3"
                  aria-describedby="input-live-help input-live-feedback"
                  placeholder="Título del libro"
                ></b-form-input>
                <!-- This will only be shown if the preceding input has an invalid state -->
                <b-form-invalid-feedback v-if='repited' id="input-live-feedback">
                  Título repetido
                </b-form-invalid-feedback>
                <!-- This will only be shown if the preceding input has an invalid state -->
                <b-form-invalid-feedback v-else id="input-live-feedback">
                  Introduce al menos 3 letras
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
          </b-container>

          <!-- autor -->
          <b-container fluid class="row">
            <b-row class="my-1">
              <b-form-group>
                <label>Autor</label>
                <b-form-group>
                  <b-form-radio v-model="author" value="Nombre"> Nombre de usuario</b-form-radio>
                  <b-form-radio v-model="author" value="Nick"> Nickname</b-form-radio>
                </b-form-group>
              </b-form-group>
            </b-row>
          </b-container>
        </b-container>

        <!-- portada -->
        <b-container fluid class="col">
          <b-row class="my-1">
            <b-container sm="3">
              <label>Portada</label>
              <b-form-file
                @change="onFileSelected"
                class="my-2"
                placeholder="Selecciona una imagen o arrastrala aquí..."
                drop-placeholder="Arrastra aquí la imagen..."
                accept="image/*"
              ></b-form-file>
            </b-container>
          </b-row>
          <b-row class="my-1">
            <b-col sm="9">
              <b-img :src="this.cover" fluid width="250%" alt="No has subido ninguna imagen"></b-img>
              <b-button v-if="this.cover != null" class="my-2" variant="danger" @click="removeImg">Eliminar</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-container>

      <b-container class="row">
        <!-- etiquetas -->
        <b-container fluid class="col">
          <b-row class="my-1">
            <b-form-group>
              <label>Etiquetas</label>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="accion_aventura_modify_id" value="AccionAventura" v-model="tags">
              <label class="custom-control-label" for="accion_aventura_modify_id"> Acción y aventura</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="ciencia_ficcion_modify_id" value="CienciaFiccion" v-model="tags">
              <label class="custom-control-label" for="ciencia_ficcion_modify_id"> Ciencia ficción</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="comedia_modify_id" value="Comedia" v-model="tags">
              <label class="custom-control-label" for="comedia_modify_id"> Comedia</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="crimen_modify_id" value="Crimen" v-model="tags">
              <label class="custom-control-label" for="crimen_modify_id"> Crimen</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="drama_modify_id" value="Drama" v-model="tags">
              <label class="custom-control-label" for="drama_modify_id"> Drama</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="fantasia_modify_id" value="Fantasia" v-model="tags">
              <label class="custom-control-label" for="fantasia_modify_id"> Fantasia</label>
            </div>
            </b-form-group>
          </b-row>
        </b-container>

        <!-- descripcion -->
        <b-container fluid class="col">
          <b-row class="my-1">
            <b-container sm="3">
              <label>Descripción</label>
              <b-form-textarea
                v-model="description"
                placeholder="Descripción"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-container>
          </b-row>
        </b-container>
      </b-container>

      <!-- botones -->
      <div class="d-flex justify-content-end">
        <b-button variant="danger" class="mr-auto" @click="deleteButton">Eliminar</b-button>
        <!-- publicado -->
        <div class="custom-control custom-checkbox my-4">
          <input type="checkbox" class="custom-control-input" id="published_modify_id" v-model="published">
          <label class="custom-control-label" for="published_modify_id"> Publicar</label>
        </div>

        <b-button variant="secondary" @click="cancelButton">Descartar</b-button>
        <b-button variant="success" @click="saveButton" :disabled="(this.uploadValue != 0 && this.uploadValue != 100) || repited || title.length < 3">Guardar</b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import { booksCollection, storageFirebase } from '../firebase.js'

export default {
  name: 'ModifyBook',
  props: ['bookAux'],
  data () {
    return {
      title: this.bookAux.title,
      author: this.bookAux.author,
      description: this.bookAux.description,
      cover: this.bookAux.cover,
      tags: this.bookAux.tags,
      published: this.bookAux.published,
      userID: this.bookAux.userID,
      id: this.bookAux.ID,

      selectedFile: null,
      uploadValue: 0,

      repitedTitle: [],
      repited: false
    }
  },
  watch: {
    title: {
      inmediate: true,
      handler (title) {
        this.$bind('repitedTitle', booksCollection.where('title', '==', this.title).limit(1)).then(docs => {
        })
      }
    },
    repitedTitle: function () {
      this.repited = !(this.repitedTitle.length === 0)
    }
  },
  methods: {
    removeImg () {
      this.cover = null
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
      this.onUpload()
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/img/covers/${this.selectedFile.name}`)
      const task = storageRef.put(this.selectedFile)
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        // downloadURL
        task.snapshot.ref.getDownloadURL().then((url) => {
          this.cover = url
          console.log(this.cover)
        })
      })
    },
    async saveButton () {
      await booksCollection.doc(this.bookAux.ID).update({
        title: this.title,
        author: this.author,
        tags: this.tags,
        description: this.description,
        cover: this.cover,
        published: this.published
      })
      this.$emit('save')
    },
    cancelButton () {
      this.$emit('cancel')
    },
    deleteButton () {
      this.$emit('delete')
    }
  }
}
</script>

<style scoped>
.booksBox {
  text-align: justify;
  background-color: #cafbf1;
  border: 2px solid #748983;
  margin-top: 5px;
  margin-left: 30px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 10px;
}
.etiquetas {
  text-align: justify;
  margin-top: 5px;
  margin-left: 30px;
}
</style>
