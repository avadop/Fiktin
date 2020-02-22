<template>
  <b-modal id="bv-modal-example" scrollable centered hide-header-close title="Añadir libro a..." size="sm" @hide="cancelButton">
    <div v-if="this.numberOfLibraries < 0 && this.internetConnection === 0">
      <b>
        Cargando bibliotecas...
      </b>
    </div>
    <div v-else-if="this.numberOfLibraries === 0 && this.internetConnection === 0">
      <b>
        Vaya, parece que no tienes ninguna biblioteca creada...
        Prueba a crear una antes de añadir libros a ellas.
        </b>
    </div>
    <div v-else-if="this.internetConnection === -1">
      <b>
        Vaya, parece que no tienes conexión a Internet.
        Revisa tu conexión y actualiza la página para solucionar el problema.
      </b>
    </div>
    <div v-else>
      <b-form-checkbox-group v-model="selectedLibraries" stacked>
        <b-form-checkbox v-for="(library) in librariesList" :key="library.id" :value="library.id">{{ library.name }}</b-form-checkbox>
        <b v-if="librariesList.length===0">¡Has agregado este libro a todas tus bibliotecas! :D</b>
      </b-form-checkbox-group>
    </div>
    <template v-slot:modal-footer>
      <b-button size="mt-1" variant="outline-danger" @click="cancelButton">Cancelar</b-button>
      <b-button size="mt-1" variant="outline-success" @click="readyButton">Guardar</b-button>
    </template>
    </b-modal>
</template>

<script>
import { store } from '@/store/index.js'
import { librariesCollection, connectedRef } from '@/firebase.js'

export default {
  name: 'AddToLibraryModal',
  props: {
    bookId: String
  },
  data () {
    return {
      numberOfLibraries: -1,
      librariesList: [],
      selectedLibraries: [],
      internetConnection: 1
    }
  },
  mounted () {
    // Comprobamos la conexión
    connectedRef.on('value', snap => {
      if (snap.val() === true && this.internetConnection !== 0) { // "this.internetConnection !== 0" se pone como seguridad para quitar tráfico innecesario a la bbdd
        // Hay conexión a Internet
        this.internetConnection = 0
        this.refresh()
      } else if (snap.val() === false && this.internetConnection !== 0) {
        // No hay conexión a Internet
        this.internetConnection = -1
      }
    })
  },
  methods: {
    refresh: async function () {
      this.$bvModal.show('bv-modal-example')
      let librariesListAux = []
      var userNick = store.state.userNick
      var searchNick = store.state.userNick.concat('_mis_obras').toLowerCase()
      var searchHistory = store.state.userNick.concat('_historial').toLowerCase()
      await librariesCollection.where('nick', '==', userNick).get().then(snapshot => {
        snapshot.forEach(doc => {
          // Comprobamos que no se agregue la biblioteca de la variable "searchNick" ni "searchHistory"
          if (doc.id !== searchNick && doc.id !== searchHistory) {
            librariesListAux.push({
              id: doc.id,
              name: doc.data().name,
              arrayKeys: doc.data().array_keys
            })
          }
        })
      })
      this.librariesList = librariesListAux
      this.numberOfLibraries = librariesListAux.length
      this.checkArrayKeys()
    },
    checkArrayKeys () {
      for (var i = 0; i < this.librariesList.length; ++i) {
        var a = this.librariesList[i].arrayKeys.length
        for (var j = 0; j < a; ++j) {
          if (this.librariesList[i].arrayKeys[j] === this.bookId) {
            this.librariesList.splice(i, 1)
            j = a
            --i
          }
        }
      }
    },
    readyButton () {
      this.$emit('add', this.selectedLibraries)
    },
    cancelButton () {
      this.$emit('cancel')
    }
  }
}
</script>
