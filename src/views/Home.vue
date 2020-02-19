<template>
<div class="home">
  <h1>HOME</h1>
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
      <b-card-text>
        {{ book.description}}
      </b-card-text>

      <b-badge v-for="(tag, idt) in book.tags" :key="idt" variant="secondary">{{ tag }}</b-badge>
    </b-card>
  </div>
</div>
</template>

<script>
import { booksCollection, userCollection } from '../firebase.js'

export default {
  name: 'homeBooksList',
  data () {
    return {
      books: []
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.books = []
      booksCollection.get().then(snapshot => {
        snapshot.forEach(doc1 => {
          if (doc1.data().published) {
            userCollection.doc(doc1.data().user_id).get().then(doc2 => {
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
