<template>
<div class="home">
  <h1>HOME</h1>
  <div class="row">
    <div v-for="(book, idx) in books" :key="idx">
      <b-card
        :title="book.title"
        :img-src="book.cover"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <h6 v-if="book.author == 'Nombre'">{{ book.name }} </h6>
        <h6 v-else>{{ book.nick }}</h6>
        <b-card-text v-if="book.description !== ''">
          {{ book.description}}
        </b-card-text>

        <b-badge v-for="(tag, idt) in book.tags" :key="idt" variant="secondary">{{ tag }}</b-badge>
        <br>
        <b-button variant="success" @click="addToLibraryButton(idx)">Añadir a bibliotecas</b-button>
        <AddToLibraryModal v-if="showModal===idx" :bookId="primaryKeys[idx]" @add="addToLibrary" @cancel="addToLibraryButton"/>
      </b-card>
    </div>
  </div>
</div>
</template>

<script>
import AddToLibraryModal from '@/components/modals/AddToLibraryModal.vue'
import { booksCollection, userCollection, librariesCollection } from '../firebase.js'

export default {
  name: 'homeBooksList',
  components: {
    AddToLibraryModal
  },
  data () {
    return {
      books: [],
      primaryKeys: [],
      showModal: -1
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh: async function () {
      this.books = []
      await booksCollection.get().then(snapshot => {
        snapshot.forEach(doc1 => {
          if (doc1.data().published) {
            userCollection.doc(doc1.data().user_id).get().then(doc2 => {
              this.primaryKeys.push(doc1.id)
              this.books.push({
                author: doc1.data().author,
                title: doc1.data().title,
                description: doc1.data().description,
                cover: doc1.data().cover,
                tags: doc1.data().tags,
                ID: doc1.data().user_id,
                nick: doc2.data().nick,
                name: doc2.data().name
              })
            })
          }
        })
      })
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
