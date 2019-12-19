<template>
  <div class="create" >
    <span> Título del libro </span>
    <input v-model="title" class="model" placeholder="Título del libro"/>
    <br><br>
    <span>¿Cuál quiere que sea el nombre que aparezca como autor?</span>
    <br>
    <input type="radio" id="nombre" value="Nombre" v-model="author">
    <label for="one"> Nombre de usuario</label>
    <br>
    <input type="radio" id="nick" value="Nick" v-model="author">
    <label for="two"> Nickname</label>
    <br><br>
    <span>Seleccione las etiquetas con las que identifique su obra</span>
    <br>
    <input type="checkbox" id="accionAventura" value="AccionAventura" v-model="tags">
    <label for="checkbox"> Acción y aventura</label>
    <br>
    <input type="checkbox" id="cienciaFiccion" value="CienciaFiccion" v-model="tags">
    <label for="checkbox"> Ciencia ficción</label>
    <br>
    <input type="checkbox" id="comedia" value="Comedia" v-model="tags">
    <label for="checkbox"> Comedia</label>
    <br>
    <input type="checkbox" id="crimen" value="Crimen" v-model="tags">
    <label for="checkbox"> Crimen</label>
    <br>
    <input type="checkbox" id="drama" value="Drama" v-model="tags">
    <label for="checkbox"> Drama</label>
    <br>
    <input type="checkbox" id="fantasia" value="Fantasia" v-model="tags">
    <label for="checkbox"> Fantasia</label>
    <br><br>
    <textarea class="model" v-model="description" placeholder="Descripción"/>
    <br><br>
    <span>Seleccione una imagen como cover</span>
    <br>
    <input type="file" name="cover" @change="onFileSelected" accept="image/*">
    <br><br>
    <button @click="addBook" :disabled="this.title.length <= 0">Crear</button>
    <button @click="cancelButton()">Cancelar</button>
  </div>
</template>

<script>
import { booksCollection } from '../firebase.js'
export default {
  name: 'CreateLibro',
  data () {
    return {
      title: '',
      author: 'Nombre',
      tags: [],
      description: '',
      cover: null
    }
  },
  computed: {
    getTitleTam () {
      return this.title.length
    },
    getDescriptionTam () {
      return this.description.length
    }
  },
  methods: {
    addBook: function () {
      booksCollection.add({
        title: this.title,
        author: this.author,
        tags: this.tags,
        description: this.description,
        cover: this.cover
      })
      this.title = ''
      this.author = ''
      this.tags = ''
      this.description = ''
      this.cover = ''
    },
    characterLimitTitle () {
      let titleAux = this.title
      let titleLength = this.title.length
      if (titleAux.length > 20) {
        titleLength -= 20
        this.title = titleAux.slice(0, -titleLength)
      }
    },
    characterLimitDescription () {
      let descAux = this.description
      let descLength = this.description.length
      if (descAux.length > 200) {
        descLength -= 200
        this.description = descAux.slice(0, -descLength)
      }
    },
    createButton () {
      this.$emit('create', this.title, this.author, this.tags, this.description, this.imagen)
    },
    cancelButton () {
      this.$router.push('/libros')
    },
    onFileSelected (event) {
      this.cover = event.target.files[0].name // coge el nombre de la primera imagen subida
    }
  }
}
</script>

<style scoped>
.create {
  padding: 10px;
}

.frame {
  background-color: beige;
  border: 1px solid lightpink;
}
</style>
