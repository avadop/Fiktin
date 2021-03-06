<template>
<div class="home">
  <b-card class="background-card">
  <h1>Libros publicados</h1>
  <div class="row">
    <div v-for="(book, idx) in books" :key="idx">
      <b-card
        tag="article"
        style="max-width: 20rem; cursor: pointer;"
        class="mb-2"
      >
        <b-button variant="light" style="font-size: 16px;" v-b-tooltip.hover title="Añadir a biblioteca" @click.stop="addToLibraryButton(idx)" class="mr-1 add-lib-button">
          <b-icon variant="warning" icon="bookmark-fill"></b-icon>
        </b-button>
        <div class="card-img-box">
          <img class="card-img-top" :src="book.cover" alt="Portada" @click="openBook(book, idx)">
        </div>
        <br>
        <h6 class="card-title" @click="openBook(book, idx)">
          {{upperCase(book.title)}}
        </h6>
        <div class="d-flex justify-content-start">
          <h6 class="autor-name" v-if="book.author == 'Nombre'">{{ book.name }} </h6>
          <h6 class="autor-name" v-else>{{ book.nick }}</h6>
        </div>
        <div class="d-flex justify-content-start">
          <b-card-text>
            {{ description(book.description) }}
          </b-card-text>
        </div>
        <br>
        <div class="text-small"><a href="" v-for="(tag, idt) in book.tags.slice(0, 3)" :key="idt">#{{ tag }} </a><a v-if="book.tags.length>3">...</a></div>
        <br>
        <AddToLibraryModal v-if="showModal===idx" :bookId="primaryKeys[idx]" @add="addToLibrary" @cancel="addToLibraryButton"/>
      </b-card>
    </div>
  </div>
  </b-card>
</div>
</template>

<script>
import AddToLibraryModal from '@/components/modals/AddToLibraryModal.vue'
import { booksCollection, userCollection, librariesCollection } from '../firebase.js'
import { store } from '@/store/index.js'

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
                published: doc1.data().published,
                userID: doc1.data().user_id,
                nick: doc2.data().nick,
                name: doc2.data().name,
                sections: doc1.data().sections,
                customBoxes: doc1.data().customBoxes
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
    },
    openBook (book, idx) {
      store.commit('openBookID', this.primaryKeys[idx])
      store.commit('openBook', book)
      store.commit('changeSection', book.sections[0])
      this.$router.push({ name: 'readBook' })
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
h1 {
  padding-top: 5px;
  padding-bottom: 15px;
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
  min-height: 140px;
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
.add-lib-button, .text-small {
  position: absolute;
  left: 0;
  margin-left: auto;
  margin-right: auto;
}
.add-lib-button {
  right: 10px;
  top: 10px;
  width: 50px;
}
.text-small {
  right: 0;
  bottom: 20px;
  width: 200px;
}
.background-card {
  background-color: #e2e7ec;
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
