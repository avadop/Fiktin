<template>
<div class="home">
  <h1>HOME</h1>
  <div class="booksBox" v-for="(book, idx) in books" :key="idx">
    <br>
    <div>
      <!-- Titulo -->
      <span>
        Título: {{ book.title }}
      </span>
      <br>

      <!-- Autor -->
      <h6 v-if="book.author == 'Nombre'">{{ book.name }} </h6>
      <h6 v-else>{{ book.nick }}</h6>
      <br>

      <!-- Descripcion -->
      <span v-if="book.description">
        Descripción: {{ book.description }}
        <br>
      </span>

      <!-- Portada -->
      <span v-if="book.cover != null">
        Portada:
        <br>
        <img width="320" :src="book.cover">
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
    </div>
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
