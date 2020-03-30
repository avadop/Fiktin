<template>
  <div class="readBook">
    <button class="buttonBack" @click="goBack()">Atrás</button>
    <button class="buttonEdit" v-if="isBookOfLoggedUser() && book.published===false" @click="goEdit()">Editar</button>
    <button class="buttonEditDisabled" v-else-if="isBookOfLoggedUser()" :disabled="book.published===true">Editar</button>
    <span style="color: red; padding-left: 10px;" v-if="isBookOfLoggedUser() && book.published===true">No se puede editar un libro si este se encuentra publicado</span>
    <div v-for="(text, index) in data" :key="index">
      <span v-html="text.htmlText"/>
    </div>
    <h1>{{ book }}</h1>
  </div>
</template>

<script>
import { librariesCollection } from '../../firebase.js'
import { store } from '../../store/index.js'

export default {
  name: 'readBook',
  props: {
    book: Object,
    bookID: String
  },
  data () {
    return {
      searchNick: store.state.userNick.concat('_historial').toLowerCase(),
      data: [{
        plainText: 'heyo',
        htmlText: '<b>hola</b>',
        component: 'Bold' }, {
        plainText: 'aaaa',
        htmlText: '<i>bbbb</i>',
        component: 'Italic'
      }]
    }
  },
  mounted () {
    if (this.bookID !== undefined) this.addBookToLibrary()
  },
  methods: {
    addBookToLibrary: async function () {
      var a
      await librariesCollection.doc(this.searchNick).get().then(doc => {
        if (doc.exists) {
          a = doc.data().array_keys
        }
      })
      a.unshift(this.bookID)
      await librariesCollection.doc(this.searchNick).update({
        array_keys: a
      })
    },
    isBookOfLoggedUser () {
      return this.book.userID === store.state.userID
    },
    saveHTML (plainText, htmlText, index) {
      this.data[index].plainText = plainText
      this.data[index].htmlText = htmlText
    },
    goEdit () {
      this.$router.replace({ name: 'editBook', params: { book: this.book } })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.readBook {
  text-align: justify;
  margin-left: 30px;
  margin-top: 10px;
}
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.buttonEdit {
  cursor: pointer;
  margin-left: 5px;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.buttonEditDisabled {
  margin-left: 5px;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
</style>
