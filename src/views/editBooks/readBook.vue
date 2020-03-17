<template>
  <div class="viewLibrary">
    <button class="buttonBack" @click="goBack()">Atrás</button>
    <button class="buttonBack" v-if="isBookOfLoggedUser()" @click="goEdit()">Editar</button>
    <h1>Patatillas con chorizo ricas ricas</h1>
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
      searchNick: store.state.userNick.concat('_historial').toLowerCase()
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
.viewLibrary {
  text-align: justify;
  margin-left: 30px;
}
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
</style>
