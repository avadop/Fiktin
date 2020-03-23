<template>
  <div class="books">
    <b-card>
    <b-button variant="primary" v-show = "!create" @click="createButton">Crear libro</b-button>
    <!-- <p v-if="books.length === 0">Todavia no tienes ningun libro creado. Pulsa <router-link to="/crearLibro">aquí</router-link> para crear uno.</p> -->
    <p>Tienes {{ books.length }} libros creados.</p>
    <CreateBook v-show="create" id="createBook" @cancel="discardChangesBook" @create="saveChangesBook()"/>
    <!-- lista de libros -->
    <div class="row">
      <div v-show="!create" v-for="(book, idx) in books" :key="idx">
        <div v-if="modifyID !== book.ID">
          <b-card
            :title="book.title"
            :img-src="book.cover"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem; cursor: pointer;"
            class="mb-2"
            @click="openBook(book, idx)"
          >
            <h6 v-if="book.author == 'Nombre'">{{ name }} </h6>
            <h6 v-else>{{ nick }}</h6>
            <b-card-text>
              {{ book.description}}
            </b-card-text>

            <b-badge v-for="(tag, idt) in book.tags" :key="idt" variant="secondary">{{ tag }}</b-badge>

            <!-- Publicado -->
            <span>
              <!-- <br> -->
              <p class="h1 mb-2" v-if="book.published"><b-icon icon="eye"></b-icon></p>
              <p class="h1 mb-2" v-else><b-icon icon="eye-slash"></b-icon></p>
            </span>

            <!-- Botones -->
            <div class="d-flex justify-content-end">
              <b-button variant="danger" class="mr-auto" v-if="modifyID !== book.ID" @click.stop="deleteBook(book.ID)">Eliminar</b-button>
              <b-button variant="primary" id="modifyButton" @click.stop="modifyBook(book)" v-show="modifyID !== book.ID">Modificar</b-button>
            </div>

            <!-- Añadir libro a bibliotecas -->
            <b-button variant="success" @click.stop="addToLibraryButton(idx)">Añadir a bibliotecas</b-button>
            <AddToLibraryModal v-if="showModal===idx" :bookId="primaryKeys[idx]" @add="addToLibrary" @cancel="addToLibraryButton"/>
          </b-card>
        </div>

        <!-- componente modificar libro -->
        <div v-else>
          <ModifyBook :bookAux="book" @delete="deleteBook(book.id)" @cancel="discardChangesBook" @save="saveChangesBook()"/>
        </div>
      </div>
    </div>
    </b-card>
  </div>
</template>

<script>
import ModifyBook from '@/components/ModifyBook.vue'
import CreateBook from '@/components/CreateBook.vue'
import AddToLibraryModal from '@/components/modals/AddToLibraryModal.vue'
import { booksCollection, userCollection, librariesCollection } from '../firebase.js'
import { store } from '../store/index.js'

export default {
  name: 'booksList',
  data () {
    return {
      books: [],
      modifyID: null,
      create: false,
      userID: store.state.userID,
      nick: '',
      name: '',
      primaryKeys: [],
      showModal: -1
    }
  },
  components: {
    ModifyBook,
    CreateBook,
    AddToLibraryModal
  },
  mounted () {
    // if (!this.userID || this.userID === 'store') return this.$router.push('/404')
    this.refresh()
    userCollection.doc(this.userID).get().then(doc => {
      const data = doc.data()
      this.nick = data.nick
      this.name = data.name
    })
  },
  methods: {
    refresh () {
      this.books = []
      booksCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data().user_id === this.userID) {
            this.primaryKeys.push(doc.id)
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
    deleteBook: async function (ID) {
      await booksCollection.doc(ID).delete()
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
    },
    addToLibraryButton (idx) {
      this.showModal = idx
    },
    addToLibrary: async function (selectedLibraries) {
      for (var i = 0; i < selectedLibraries.length; ++i) {
        var a
        await librariesCollection.doc(selectedLibraries[i]).get().then(doc => {
          if (doc.exists) {
            a = doc.data().array_keys
          }
        })
        a.push(this.primaryKeys[this.showModal])
        librariesCollection.doc(selectedLibraries[i]).update({
          array_keys: a
        })
      }
      this.addToLibraryButton(-1)
    },
    openBook (book, idx) {
      this.$router.push({ name: 'readBook', params: { book: book, bookID: this.primaryKeys[idx] } })
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
