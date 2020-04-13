<template>
  <div class="books">
    <b-card class="background-card">
      <div v-show = "!create" class="d-flex justify-content-end">
        <h4 class="mr-auto">Mis libros</h4>
        <b-button variant="info" size="sm" class="m-md-2" @click="createButton">
          <b-icon icon="plus"></b-icon> Crear libro
        </b-button>
      </div>
      <div class="d-flex justify-content-end">
        <p v-show = "!create" class="mr-auto">Tienes {{ books.length }} libro(s).</p>
      </div>
      <CreateBook v-show="create" id="createBook" @cancel="discardChangesBook" @create="saveChangesBook()"/>
      <!-- lista de libros -->
      <div class="row">
        <div v-show="!create" v-for="(book, idx) in books" :key="idx">
          <div v-if="modifyID !== book.ID">
            <b-card
              tag="article"
              style="max-width: 20rem; cursor: pointer;"
              class="mb-2"
            >
              <div class="card-img-box">
                <img class="card-img-top" :src="book.cover" alt="Portada" @click="openBook(book, idx)">
              </div>
              <br>
              <h6 class="card-title"  @click="openBook(book, idx)">
                {{upperCase(book.title)}} <a class="h5 mb-2" v-if="book.published"><b-icon icon="eye"></b-icon></a>
                <a class="h5 mb-2" v-else><b-icon icon="eye-slash"></b-icon></a>
              </h6>
              <div class="d-flex justify-content-start">
                <h6 class="autor-name" v-if="book.author == 'Nombre'">{{ name }}</h6>
                <h6 class="autor-name" v-else>{{ nick }}</h6>
              </div>
              <div class="d-flex justify-content-start">
                <b-card-text>
                  {{ description(book.description) }}
                </b-card-text>
              </div>
              <br>
              <div class="text-small"><a href="" v-for="(tag, idt) in book.tags.slice(0, 3)" :key="idt">#{{ tag }} </a><a v-if="book.tags.length>3">...</a></div>

              <!-- Botones -->
              <div>
                <b-dropdown id="dropdown-1" variant="light" text="Opciones" class="mr-3 opt-button">
                  <b-dropdown-item id="modifyButton" @click.stop="modifyBook(book)" v-show="modifyID !== book.ID">Modificar</b-dropdown-item>
                  <b-dropdown-item @click.stop="addToLibraryButton(idx)">Añadir a bibliotecas</b-dropdown-item>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item variant="danger" v-if="modifyID !== book.ID" @click.stop="deleteBook(book.ID, idx)"><b-icon icon="trash-fill"></b-icon> Eliminar</b-dropdown-item>
                </b-dropdown>
              </div>
              <AddToLibraryModal v-if="showModal===idx" :bookId="primaryKeys[idx]" @add="addToLibrary" @cancel="addToLibraryButton"/>
            </b-card>
          </div>

          <!-- componente modificar libro -->
          <div v-else>
            <ModifyBook :bookAux="book" @delete="deleteBook(book.ID, idx)" @cancel="discardChangesBook" @save="saveChangesBook()"/>
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
import { booksCollection, userCollection, librariesCollection, sectionsCollection } from '../firebase.js'
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
              sections: doc.data().sections,
              ID: doc.id
            })
          }
        })
      })
    },
    deleteBook: async function (ID, idx) {
      for (var i = 0; i < this.books[idx].sections.length; ++i) {
        await sectionsCollection.doc(this.books[idx].sections[i]).delete()
      }
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
    },
    description (desc) {
      if (desc.length > 100) {
        desc = desc.substr(0, 99) + '...'
      }
      return desc
    },
    upperCase (title) {
      return title.toUpperCase()
    }
  }
}
</script>

<style scoped>
.background-card {
  background-color: #e2e7ec;
}
.card.mb-2 {
  cursor: auto!important;
  width: 250px;
  height: 400px;
  margin-left: 10px;
}
.card-img-box {
  text-align: left;
}
.card-img-top {
  display: block;
  cursor: pointer;
  max-height: 140px;
  max-width: 100%;
  width: auto;
}
.card-img-top:hover {
  box-shadow: 1px 1px 4px #000000;
}
.card-text {
  font-size: 0.9rem;
  text-align: justify;
}
.card-title {
  cursor: pointer;
}
.card-title:hover {
  text-decoration: underline;
}
.opt-button, .text-small {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
.opt-button {
  top: 10px;
  width: 106px;
}
.text-small {
  bottom: 20px;
  width: 200px;
}
.card-title {
  text-align: left;
}
.autor-name {
  color: #7b8793;
}
.btn-light {
  border-color: #ccc;
}
</style>
