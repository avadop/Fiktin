<template>
  <div class="create">
    <div class="d-flex justify-content-start">
      <h4>Crear libro</h4>
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
          <b-form-invalid-feedback v-if='title.length < 3' id="input-live-feedback">
            Introduce al menos 3 caracteres
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else id="input-live-feedback">
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
        <label>Portada</label>
        <b-form-file
          @change="onFileSelected"
          class="my-2"
          placeholder="Selecciona una imagen o arrastrala aquí..."
          drop-placeholder="Arrastra aquí la imagen..."
          accept="image/*"
        ></b-form-file>
        <b-row class="my-1">
            <b-img :src="this.auxCover" fluid width="250%" alt="No has subido ninguna imagen"></b-img>
            <b-button v-if="this.auxCover != null" class="my-2" variant="danger" @click="removeImg">Eliminar</b-button>
        </b-row>
      </b-container>
    </b-container>

    <b-container class="row">
      <!-- etiquetas -->
      <b-container fluid class="col">
        <div>
          <label for="tags-basic">Etiquetas</label>
          <b-form-tags input-id="tags-basic" v-model="tags" class="mb-2" placeholder="Añade una etiqueta..." @keydown.space.prevent></b-form-tags>
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
      <!-- publicado -->
      <div class="custom-control custom-checkbox my-4">
        <input type="checkbox" class="custom-control-input" id="published_id" v-model="published">
        <label class="custom-control-label" for="published_id"> Publicar</label>
      </div>

      <b-button variant="outline-secondary" @click="cancelButton">Cancelar</b-button>
      <b-button variant="dark" @click="createButton" :disabled="(this.uploadValue != 0 && this.uploadValue != 100) || repited || title.length < 3 || title.length > 50 || description.length > 250">Crear libro</b-button>
    </div>
  </div>
</template>

<script>
import { booksCollection, sectionsCollection, storageFirebase, defaultImageBook } from '../firebase.js'
import { store } from '../store/index.js'

export default {
  name: 'CreateBook',
  props: [],
  data () {
    return {
      title: '',
      author: 'Nombre',
      tags: [],
      description: '',
      cover: null,
      published: false,
      userID: store.state.userID,

      selectedFile: null,
      uploadValue: 0,

      repitedTitle: [],
      repited: false,
      modalCreate: false,

      auxCover: ''
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
      this.auxCover = null
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
      this.onUpload()
    },
    onUpload () {
      const storage = storageFirebase.ref(`/aux/${this.selectedFile.name}`)
      const task = storage.put(this.selectedFile)
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        // downloadURL
        task.snapshot.ref.getDownloadURL().then((url) => {
          this.auxCover = url
          console.log(this.cover)
        })
      })
    },
    onUpdate: async function (bookId) {
      if (this.auxCover !== null) {
        const storage = storageFirebase.ref(`/${store.state.userNick.toLowerCase()}/books/${bookId}/cover/${this.selectedFile.name}`)
        const task = storage.put(this.selectedFile)
        await task.on('state_changed', snapshot => {
          let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.uploadValue = percentage
        }, error => { console.log(error.message) },
        () => {
          this.uploadValue = 100
          // downloadURL
          task.snapshot.ref.getDownloadURL().then(async function (url) {
            await booksCollection.doc(bookId).update({
              cover: url
            })
          })
        })
      }
    },
    createButton: async function () {
      var sections = []
      sections.push(await sectionsCollection.add({
        name: 'Primera sección',
        book_author_ID: this.userID,
        book_title: this.title,
        gadgets: [{
          htmlText: '',
          component: 'Normal',
          componentName: 'Texto normal'
        }]
      }))
      var bookID = ''
      await booksCollection.add({
        title: this.title,
        author: this.author,
        tags: this.tags,
        description: this.description,
        published: this.published,
        user_id: this.userID,
        sections: [sections[0].id],
        customBoxes: [],
        cover: defaultImageBook
      }).then(docRef => {
        bookID = docRef.id
      })
      this.onUpdate(bookID)
      this.title = ''
      this.author = ''
      this.tags = []
      this.description = ''
      this.cover = ''
      this.published = 'not_published'
      this.modalCreate = false
      setTimeout(() => { this.$emit('create') }, 200)
    },
    cancelButton () {
      this.modalCreate = false
      this.title = ''
      this.author = ''
      this.tags = []
      this.description = ''
      this.cover = ''
      this.published = 'not_published'
      this.$emit('cancel')
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
