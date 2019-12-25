<template>
  <div class="viewLibrary">
    <button class="buttonBack" @click="goBack()">Atrás</button>
    <br><br>
    <span class="title">{{ name }} </span>
    <span class="nBooks" v-if="numberOfBooks===-1"></span> <!--No mostramos nada-->
    <span class="nBooks" v-else-if="numberOfBooks===1"> {{ numberOfBooks }} libro</span>
    <span class="nBooks" v-else> {{ numberOfBooks }} libros</span>
    <br><br>
    <h3 v-if="this.numberOfBooks === 0 && this.internetConnection === 0">No hay libros en esta biblioteca</h3>
    <h3 v-else-if="this.numberOfBooks === -1 && this.internetConnection === 0">Cargando</h3>
    <h3 v-else-if="this.internetConnection === -1">vaya, parece que no tienes conexión y no podemos mostrar los libros de esta biblioteca<br>Revisa tu conexión y actualiza la página para solucionar el problema</h3>
    <span v-else>
      <div class="booksList" v-for="(book, index) in booksList" :key="book.id">
        <span class="text">Nombre: {{ book.title }}</span>
        <br>
        <span>Autor: {{ book.author }}</span>
        <br>
        <span v-if="book.description!==''">Descripción: {{ book.description }}</span>
        <span v-else>Sin descripción</span>
        <br>
        <span>Fecha de publicación: Todavía no está implementada esta función </span>
        <br><br>
        <button class="button" @click="deleteButton(index)">Eliminar</button>
        <button class="button" @click="upButton(index)" :disabled="index===0">Subir</button>
        <button class="button" @click="downButton(index)" :disabled="index===booksList.length-1">Bajar</button>
      </div>
    </span>
  </div>
</template>

<script>
import { librariesCollection, booksCollection, connectedRef } from '../firebase.js'

export default {
  name: 'viewLibrary',
  props: {
    libID: String,
    name: String
  },
  data () {
    return {
      booksList: [],
      numberOfBooks: -3,
      referencesList: [],
      internetConnection: 1
    }
  },
  mounted () {
    // Comprobamos la conexión
    if (this.libID == null) this.goBack()
    else {
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
    }
    // BUSCAR CÓMO HACER PERSISTENCIA DE DATOS CUANDO LA PÁGINA REFRESCA. ¿PLUGIN VUEX-PERSISTEDSTATE?
    // if (this.libID == null) this.goBack() Esto lo he escrito arriba. No olvidarse de quitarlo en caso de persistencia
  },
  methods: {
    refresh: async function () {
      let booksKeys
      this.booksList = []
      this.referencesList = []
      this.numberOfBooks = -1
      // Extraemos las ids de los libros en la librería
      await librariesCollection.doc(this.libID).get().then(doc => {
        booksKeys = doc.data().array_keys
      })
      // Por cada id de cada libro...
      for (let i = 0; i < booksKeys.length; ++i) {
        let a = booksKeys[i]
        this.referencesList.push(booksKeys[i])
        // ...cogemos sus datos
        await booksCollection.doc(a).get().then(doc => {
          if (doc.exists) {
            this.booksList.push({
              id: a,
              title: doc.data().title,
              author: doc.data().author,
              description: doc.data().description
            })
          }
        })
      }
      this.numberOfBooks = this.booksList.length
    },
    goBack () {
      this.$router.go(-1)
    },
    updateReferencesList () {
      librariesCollection.doc(this.libID).update({
        array_keys: this.referencesList
      })
    },
    deleteButton (index) {
      this.referencesList.splice(index, 1)
      this.updateReferencesList()
      this.refresh()
    },
    upButton (index) {
      let preIndex = index - 1
      let aux = this.referencesList[preIndex]
      this.referencesList[preIndex] = this.referencesList[index]
      this.referencesList[index] = aux
      this.updateReferencesList()
      this.refresh()
    },
    downButton (index) {
      let posIndex = index + 1
      let aux = this.referencesList[posIndex]
      this.referencesList[posIndex] = this.referencesList[index]
      this.referencesList[index] = aux
      this.updateReferencesList()
      this.refresh()
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

.booksList {
  text-align: justify;
  background-color: #E9FFE2;
  border: 1px solid #DBECD5;
  margin-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 10px;
}

.button {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-right: 5px;
  text-align: center;
}

.title {
  font: bold 30px Arial;
  color: #272927;
}

.nBooks {
    font: bold 14px Arial;
    color: #798079;
}

.text {
  font: bold 14px/30px Arial;
}
</style>
