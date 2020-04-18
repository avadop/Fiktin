<template>
  <div>
    <div class="buttons">
      <button class="buttonBack" @click="goBack()">Atrás</button>
      <button class="buttonEdit" v-if="isBookOfLoggedUser() && book.published===false" @click="goEdit()">Editar</button>
      <button class="buttonEditDisabled" v-else-if="isBookOfLoggedUser()" :disabled="book.published===true">Editar</button>
      <span style="color: red; padding-left: 10px;" v-if="isBookOfLoggedUser() && book.published===true">No se puede editar un libro si este se encuentra publicado</span>
    </div>
    <div class="readBook">
      <div v-for="(text, index) in sectionGadgets" :key="index">
        <span v-html="text.htmlText"/>
      </div>
    </div>
  </div>
</template>

<script>
import { librariesCollection, sectionsCollection } from '@/firebase.js'
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
      currentSection: '',
      sectionGadgets: []
    }
  },
  mounted () {
    if (this.bookID !== undefined) this.addBookToLibrary()
    this.loadSection(0)
  },
  methods: {
    async loadSection (sectionIndex) {
      this.currentSection = sectionIndex
      await sectionsCollection.doc(this.book.sections[sectionIndex]).get().then(doc => {
        this.sectionGadgets = doc.data().gadgets
      })
    },
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
    // saveHTML (plainText, htmlText, index) {
    //   this.data[index].plainText = plainText
    //   this.data[index].htmlText = htmlText
    // },
    goEdit () {
      this.$router.replace({ name: 'editBook', params: { book: this.book, bookID: this.bookID } })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.buttons {
  text-align: justify;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
}
.readBook {
  text-align: justify;
  margin-top: 50px;
  margin: auto;
  width: 60%;
  border: 1px solid;
  padding: 20px;
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
