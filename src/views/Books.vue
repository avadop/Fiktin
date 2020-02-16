<template>
  <div class="books">
    <h3>En esta página podemos acceder a las distintas interacciones con los libros.</h3>
    <b-button variant="primary" v-show = "!create" @click="createButton">Crear libro</b-button>
    <!-- <p v-if="books.length === 0">Todavia no tienes ningun libro creado. Pulsa <router-link to="/crearLibro">aquí</router-link> para crear uno.</p> -->
    <p>Tienes {{ books.length }} libros creados.</p>
    <CreateBook v-show="create" id="createBook" class="booksBox" @cancel="discardChangesBook" @create="saveChangesBook()"/>
    <!-- lista de libros -->
    <div v-show="!create" class="booksBox" v-for="(book, idx) in books" :key="idx">
      <br>
      <div v-if="modifyID !== book.ID">
        <!-- Titulo -->
        <span>
          Título: {{ book.title }}
        </span>
        <br>

        <!-- Autor -->
        <span>
          Autor: {{ book.author }}
        </span>
        <br>

        <!-- Descripcion -->
        <span v-if="book.description">
          Descripción: {{ book.description }}
          <br>
        </span>

        <!-- Portada -->
        <span v-if="book.cover">
          Portada: {{ book.cover }}
          <br>
        </span>

        <!-- Etiquetas -->
        <span class="etiquetas" v-if="book.tags.length > 0">
          Etiquetas:
          <div class="etiqueta">
            <li v-for="(tag, idt) in book.tags" :key="idt">{{ tag }}</li>
          </div>
          <br>
        </span>

        <!-- Publicado -->
        <span>
          <a v-if="book.published"> Público </a>
          <a v-else> Privado </a>
          <br>
        </span>
      </div>

      <!-- componente modificar libro -->
      <div v-else>
        <ModifyBook :bookAux="book" @delete="deleteBook(book.id)" @cancel="discardChangesBook" @save="saveChangesBook()"/>
      </div>

      <!-- Botones -->
      <b-button variant="danger" v-if="modifyID !== book.ID" @click="deleteBook(book.ID)">Eliminar libro</b-button>
      <b-button variant="primary" id="modifyButton" @click="modifyBook(book)" v-show="modifyID !== book.ID">Modificar libro</b-button>
    </div>
  </div>
</template>

<script>
import ModifyBook from '@/components/ModifyBook.vue'
import CreateBook from '@/components/CreateBook.vue'
import { booksCollection } from '../firebase.js'
import { store } from '../store/index.js'

export default {
  name: 'booksList',
  data () {
    return {
      books: [],
      modifyID: null,
      create: false,
      userID: store.state.userID
    }
  },
  components: {
    ModifyBook,
    CreateBook
  },
  mounted () {
    // if (!this.userID || this.userID === 'store') return this.$router.push('/404')
    this.refresh()
  },
  methods: {
    refresh () {
      this.books = []
      booksCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data().user_id === this.userID) {
            this.books.push({
              author: doc.data().author,
              title: doc.data().title,
              description: doc.data().description,
              cover: doc.data().cover,
              tags: doc.data().tags,
              published: doc.data().published,
              userID: doc.data().user_id,
              ID: doc.id
            })
          }
        })
      })
    },
    deleteBook: function (ID) {
      booksCollection.doc(ID).delete()
      this.refresh()
    },
    modifyBook: function (book) {
      this.modifyID = book.ID
    },
    discardChangesBook: function () {
      this.modifyID = null
      this.create = false
    },
    saveChangesBook: function () {
      this.modifyID = null
      this.create = false
      this.refresh()
    },
    createButton: function () {
      this.create = true
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
