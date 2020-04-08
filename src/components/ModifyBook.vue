<template>
  <div class="modify" >
    <b-card>
      <div class="d-flex justify-content-start">
        <h4>Modificar libro</h4>
      </div>
      <b-container class="row">
        <b-container class="col">
          <!-- titulo -->
          <b-container fluid class="row">
            <label>Título</label>
            <b-form-input
              type="text"
              v-model="title"
              :state="!repited && title.length >= 3 && title.length <= 50"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Título del libro"
            ></b-form-input>
            <b-form-invalid-feedback v-if='repited' id="input-live-feedback">
              Título repetido
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if='title.length < 3' id="input-live-feedback">
              Introduce al menos 3 caracteres
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if='title.length > 50' id="input-live-feedback">
              Superada longitud máxima de 50 caracteres
            </b-form-invalid-feedback>
          </b-container>
          <br>
          <!-- autor -->
          <b-container fluid class="row">
            <b-form-group>
              <label>Autor</label>
              <b-form-group>
                <b-form-radio v-model="author" value="Nombre"> Nombre de usuario</b-form-radio>
                <b-form-radio v-model="author" value="Nick"> Nickname</b-form-radio>
              </b-form-group>
            </b-form-group>
          </b-container>
        </b-container>

        <!-- portada -->
        <b-container fluid class="col">
          <b-row class="my-1">
            <label>Portada</label>
            <b-form-file
              @change="onFileSelected"
              class="my-2"
              placeholder="Selecciona una imagen o arrastrala aquí..."
              drop-placeholder="Arrastra aquí la imagen..."
              accept="image/*"
            ></b-form-file>
          </b-row>
          <b-row class="my-1">
            <b-img :src="this.cover" fluid width="250%" alt="No has subido ninguna imagen"></b-img>
            <b-button v-if="this.cover != null" class="my-2" variant="danger" @click="removeImg">Eliminar</b-button>
          </b-row>
        </b-container>
      </b-container>

      <b-container class="row">
        <!-- etiquetas -->
        <b-container fluid class="col">
          <div>
            <label for="tags-basic">Type a new tag and press enter</label>
            <b-form-tags input-id="tags-basic" v-model="tags" class="mb-2" placeholder="Añade una etiqueta..."></b-form-tags>
          </div>
        </b-container>

        <!-- descripcion -->
        <b-container fluid class="col">
          <label>Descripción</label>
          <b-form-textarea
            v-model="description"
            :state="description.length <= 250"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Descripción"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
          <b-form-invalid-feedback v-if="description.length >= 250" id="input-live-feedback">
            Superada longitud máxima de 250 caracteres
          </b-form-invalid-feedback>
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

        <b-button variant="outline-secondary" @click="cancelButton">Descartar</b-button>
        <b-button variant="dark" @click="modalModify = true" :disabled="(this.uploadValue != 0 && this.uploadValue != 100) || repited || title.length < 3 || title.length > 50 || description.length > 250">Guardar</b-button>
      </div>

      <b-modal id="modal-modify" v-model="modalModify" hide-footer hide-header>
        <div class="d-block text-center">
          <p>¿Está seguro que desea aplicar las modificaciones?</p>
        </div>
        <div class="d-flex justify-content-center">
          <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="modalModify = false">Volver Atrás</b-button>
          <b-button id="button-modal-accept" class="mt-1" variant="primary" block @click="saveButton">Confirmar</b-button>
        </div>
      </b-modal>
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
      repited: false,
      modalModify: false
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
      this.modalModify = false
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
.btn-secondary {
    color: #fff;
    background-color: #838c95;
    border-color: #838c95;
}
</style>

<style>
#modal-modify {
  margin: 40%;
  margin-top: 180px;
  font-size: 20px;
  max-width: 330px;
}
#button-modal-accept {
  width: 100px;
}
#button-modal-return {
  width: 200px;
}
</style>
