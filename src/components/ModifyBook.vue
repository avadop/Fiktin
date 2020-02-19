<template>
  <div class="modify" >
    <!-- titulo -->
    <span>
      Título: <input v-model="title" type="text" placeholder="Título del libro">
    </span>
    <br>

    <!-- autor -->
    <span>
      Autor:
      <div class="etiquetas">
        <input type="radio" id="nombre" value="Nombre" v-model="author">
        <label for="one"> Nombre de usuario</label>
        <br>
        <input type="radio" id="nick" value="Nick" v-model="author">
        <label for="two"> Nickname</label>
      </div>
    </span>
    <br>

    <!-- descripcion -->
    <span>
      Descripción:
      <br>
      <textarea class="model" v-model="description" placeholder="Descripción"/>
      <br>
    </span>

    <!-- portada -->
    <span>
      Portada:
      <br>
      <img width="320" :src="this.cover">
      <b-button v-if="this.cover != null" variant="danger" @click="removeImg">Eliminar</b-button>
      <br>
    </span>

    <br>
    <input type="file" name="modify_cover" @change="onFileSelected" accept="image/*">
    <br>

    <!-- etiquetas -->
    <span>
      Etiquetas:
      <div class="etiquetas ">
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
      </div>
      <br>
    </span>

    <!-- publicado -->
    <span>
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="published_modify_id" v-model="published">
        <label class="custom-control-label" for="published_modify_id"> Publicar</label>
      </div>
    </span>

    <!-- botones -->
    <b-button variant="danger" @click="deleteButton">Eliminar</b-button>
    <b-button variant="secondary" @click="cancelButton">Descartar</b-button>
    <b-button variant="success" @click="saveButton" :disabled="this.UploadValue != 0 && this.UploadValue != 100">Guardar</b-button>
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
      UploadValue: 0
    }
  },
  methods: {
    removeImg () {
      this.cover = null
    },
    onFileSelected (event) {
      this.selectedFile = event.target.files[0] // coge el nombre de la primera imagen subida
      this.onUpload()
    },
    onUpload () {
      const storageRef = storageFirebase.ref(`/img/covers/${this.selectedFile.name}`)
      const task = storageRef.put(this.selectedFile)
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.UploadValue = percentage
      }, error => { console.log(error.message) },
      () => {
        this.UploadValue = 100
        // downloadURL
        task.snapshot.ref.getDownloadURL().then((url) => {
          this.cover = url
          console.log(this.cover)
        })
      })
    },
    saveButton () {
      booksCollection.doc(this.bookAux.ID).set({
        title: this.title,
        author: this.author,
        tags: this.tags,
        description: this.description,
        cover: this.cover,
        published: this.published,
        user_id: this.userID
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
