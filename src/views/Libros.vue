<template>
  <div class="libros">
    <h3>En esta página podemos acceder a las distintas interacciones con los libros</h3>
    <button class="button" @click="createBook">Crear libro</button>
    <p v-if="books.length === 0">Todavia no tienes ningun libro creado. Pulsa <router-link to="/crearLibro">aquí</router-link> para crear uno.</p>
    <p v-else>Tienes {{ books.length }} libros creados.</p>

    <!-- formulario de libros -->
    <div class="booksBox" v-for="(book, idx) in books" :key="idx">
      <br>

      <!-- Titulo -->
      <span v-if="modifyID !== book.ID">
        Título: {{ book.title }}
      </span>
      <span v-else>
        Título: <input v-model="title" type="text" placeholder="Título del libro">
      </span>
      <br>

      <!-- Autor -->
      <span v-if="modifyID !== book.ID">
        Autor: {{ book.author }}
      </span>
      <span v-else>
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

      <!-- Descripcion -->
      <span v-if="book.description && modifyID !== book.ID">
        Descripción: {{ book.description }}
        <br>
      </span>
      <span v-if="modifyID === book.ID">
        Descripción:
        <br>
        <textarea class="model" v-model="description" placeholder="Descripción"/>
        <br>
      </span>

      <!-- Portada -->
      <span v-if="book.cover && modifyID !== book.ID">
        Portada: {{ book.cover }}
        <br>
      </span>
      <span v-if="modifyID === book.ID">
        Portada:
        <input type="file" name="cover" @change="onFileSelected" accept="image/*">
        <br>
      </span>

      <!-- Etiquetas -->
      <span class="etiquetas" v-if="book.tags.length > 0 && modifyID !== book.ID">
        Etiquetas:
        <div class="etiqueta">
          <li v-for="(tag, idt) in book.tags" :key="idt">{{ tag }}</li>
        </div>
        <br>
      </span>
      <span v-else>
        Etiquetas:
        <div class="etiquetas" v-show="modifyID === book.ID">
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
        </div>
        <br>
      </span>
      <br>

      <!-- Botones -->
      <button class="button" @click="deleteBook(book.ID)">Eliminar libro</button>
      <button id="modifyButton" class="button" @click="modifyBook(book)" v-show="modifyID !== book.ID">Modificar libro</button>
      <button class="button" @click="discardChangesBook()" v-show="modifyID === book.ID">Descartar cambios</button>
      <button class="button" @click="saveChangesBook(book.ID)" v-show="modifyID === book.ID">Guardar cambios</button>
    </div>
  </div>
</template>

<script>
import router from '../router/index.js'
import { booksCollection } from '../firebase.js'

export default {
  name: 'booksList',
  data () {
    return {
      books: [],
      // prueba
      title: '',
      author: 'Nombre',
      tags: [],
      description: '',
      cover: null,
      // prueba
      modifyID: null
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.books = []
      booksCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
          this.books.push({
            author: doc.data().author,
            title: doc.data().title,
            description: doc.data().description,
            cover: doc.data().cover,
            tags: doc.data().tags,
            ID: doc.id
          })
        })
      })
    },
    createBook: function () {
      router.push('/crearLibro')
    },
    deleteBook: function (ID) {
      Promise.all(
        booksCollection.doc(ID).delete()
      )
      this.refresh()
    },
    modifyBook: function (book) {
      this.title = book.title
      this.author = book.author
      this.tags = book.tags
      this.description = book.description
      this.cover = book.cover
      this.modifyID = book.ID
    },
    discardChangesBook: function () {
      this.modifyID = null
    },
    saveChangesBook: function (ID) {
      booksCollection.doc(ID).set({
        title: this.title,
        author: this.author,
        tags: this.tags,
        description: this.description,
        cover: this.cover
      })
      this.modifyID = null
      this.refresh()
    }
  }
}
</script>

<style scoped>
  span {
   font: bold 14px/30px Arial;
    margin: 10px 0;
    width: 20%;
    cursor: pointer;
  }
  span {
    margin-top:40px;
    font-size: 13px;
  }
  span {
    text-decoration: inderline;
    cursor: pointer;
  }

.button {
  background-color: #96e9f2;
  border: 1px solid #000000;
  margin-top: 5px;
  margin-left: 30px;
}

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

.etiqueta {
  text-align: justify;
  margin-top: 5px;
  margin-left: 30px;
}
</style>
