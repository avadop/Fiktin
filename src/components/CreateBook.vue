<template>
  <div class="create" >
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
    <input type="file" name="cover" @change="onFileSelected" accept="image/*">
    <br>

    <!-- etiquetas -->
    <span>
      Etiquetas:
      <div class="etiquetas">
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="accion_aventura_id" value="AccionAventura" v-model="tags">
          <label class="custom-control-label" for="accion_aventura_id"> Acción y aventura</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="ciencia_ficcion_id" value="CienciaFiccion" v-model="tags">
          <label class="custom-control-label" for="ciencia_ficcion_id"> Ciencia ficción</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="comedia_id" value="Comedia" v-model="tags">
          <label class="custom-control-label" for="comedia_id"> Comedia</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="crimen_id" value="Crimen" v-model="tags">
          <label class="custom-control-label" for="crimen_id"> Crimen</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="drama_id" value="Drama" v-model="tags">
          <label class="custom-control-label" for="drama_id"> Drama</label>
        </div>
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="fantasia_id" value="Fantasia" v-model="tags">
          <label class="custom-control-label" for="fantasia_id"> Fantasia</label>
        </div>
      </div>
      <br>
    </span>

    <!-- publicado -->
    <span>
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="published_id" v-model="published">
        <label class="custom-control-label" for="published_id"> Publicar</label>
      </div>
    </span>

    <!-- botones -->
    <b-button variant="secondary" @click="cancelButton">Cancelar</b-button>
    <b-button variant="success" @click="createButton" :disabled="this.UploadValue != 0 && this.UploadValue != 100">Crear libro</b-button>
  </div>
</template>

<script>
import { booksCollection, storageFirebase } from '../firebase.js'
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
      UploadValue: 0
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
    createButton () {
      booksCollection.add({
        title: this.title,
        author: this.author,
        tags: this.tags,
        description: this.description,
        cover: this.cover,
        published: this.published,
        user_id: this.userID
      })
      this.title = ''
      this.author = ''
      this.tags = []
      this.description = ''
      this.cover = ''
      this.published = 'not_published'
      this.$emit('create')
    },
    cancelButton () {
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
  span {
   font: bold 14px/30px Arial;
    margin: 10px 0;
    width: 20%;
    margin-top:40px;
    font-size: 13px;
    text-decoration: inderline;
  }
.button {
  background-color: #96e9f2;
  border: 1px solid #000000;
  margin-top: 5px;
  margin-left: 30px;
}
.button-accept {
  background-color: #acf296;
  border: 1px solid #000000;
  margin-top: 5px;
  margin-left: 30px;
}
.etiqueta {
  text-align: justify;
  margin-top: 5px;
  margin-left: 30px;
}
</style>
