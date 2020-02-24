<template>
  <div class="viewLibrary">
    <!-- Cabecera -->
    <button class="buttonBack" @click="goBack()">Atrás</button>
    <br><br>
    <span class="title">{{ name }} </span>
    <span class="nBooks" v-if="numberOfBooks===-1"></span> <!--No mostramos nada-->
    <span class="nBooks" v-else-if="numberOfBooks===1"> {{ numberOfBooks }} libro</span>
    <span class="nBooks" v-else> {{ numberOfBooks }} libros</span>
    <br><br>
    <!-- Comprobamos conexión -->
    <h3 v-if="this.numberOfBooks === 0 && this.internetConnection === 0">No hay libros en esta biblioteca</h3>
    <h3 v-else-if="this.numberOfBooks === -1 && this.internetConnection === 0">Cargando</h3>
    <h3 v-else-if="this.internetConnection === -1">vaya, parece que no tienes conexión y no podemos mostrar los libros de esta biblioteca<br>Revisa tu conexión y actualiza la página para solucionar el problema</h3>
    <span v-else>
      <!-- Lista de libros -->
      <div v-for="(book, index) in booksList" :key="book.id">
        <div class="booksListSuccess" v-if="book.found==1"> <!--En caso de libro encontrado y publicado-->
          <span class="text">Nombre: {{ book.title }}</span>
          <br>
          <span>Autor: {{ book.author }}</span>
          <br>
          <span v-if="book.description!==''">Descripción: {{ book.description }}</span>
          <span v-else>Sin descripción</span>
          <br>
          <span>Fecha de publicación: Todavía no está implementada esta función </span>
          <br><br>
          <button class="buttonSuccess" @click="deleteButton(index)">Eliminar</button>
          <button class="buttonSuccess" @click="upButton(index)" :disabled="index===0">Subir</button>
          <button class="buttonSuccess" @click="downButton(index)" :disabled="index===booksList.length-1">Bajar</button>
        </div>
        <div class="booksListError" v-else-if="book.found==2"> <!--En caso de libro encontrado pero no publicado-->
          <span class="textError">Libro no publicado :(</span>
          <br>
          <span>El autor de este libro ha decidido no publicar su libro. Cuando lo publique, se podrá leer de forma normal</span>
          <br><br>
          <button class="buttonError" @click="deleteButton(index)">Eliminar</button>
          <button class="buttonError" @click="upButton(index)" :disabled="index===0">Subir</button>
          <button class="buttonError" @click="downButton(index)" :disabled="index===booksList.length-1">Bajar</button>
          <span class="textInfo">(Código del libro: {{ book.id }})</span>
        </div>
        <div class="booksListError" v-else> <!--En caso de libro no encontrado o error-->
          <span class="textError">Libro no encontrado :(</span>
          <br>
          <span>Puede que este libro no se encuentre publicado o haya sido eliminado</span>
          <br><br>
          <button class="buttonError" @click="deleteButton(index)">Eliminar</button>
          <button class="buttonError" @click="upButton(index)" :disabled="index===0">Subir</button>
          <button class="buttonError" @click="downButton(index)" :disabled="index===booksList.length-1">Bajar</button>
          <span class="textInfo">(Código del libro: {{ book.id }})</span>
        </div>
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
  /**
   * booksList: Array con los datos de los libros. Contiene, además de los datos del propio libro, el campo found para indicar si el libro existe y está publicado. Adquiere los valores:
   *  0: El libro no existe en la base de datos
   *  1: El libro existe y se encuentra publicado
   *  2: El libro existe pero no se encuentra publicado
   * numberOfBooks: Indica la cantidad de libros presentes en la biblioteca. Tiene varios valores:
   *  -3: No se ha iniciado.
   *  -1: No se ha encontrado la biblioteca o se están cargando.
   *  >=0: Indica la cantidad de libros en la biblioteca.
   * referencesList: Hace alusión al campo "array_keys" de la tabla de bibliotecas de la base de datos.Cada vez que un elemento del array se modifica, se manda a la bbdd.
   * internetConnection: Indica el estado de la conexión a Internet. Tiene varios valores:
   *  -1: No hay conexión a Internet.
   *  0: Hay conexión a Internet.
   *  1: No se ha iniciado el valor.
   */
  data () {
    return {
      booksList: [],
      numberOfBooks: -3,
      referencesList: [],
      internetConnection: 1
    }
  },
  /**
   * En este método comprobamos que la biblioteca exista, volviendo a la vista anterior si no.
   * Una vez realizada esa comprobación, probamos la conexión a Internet. Si hay conexión, se actualiza la lista de libros, si no, no.
   */
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
    /**
     * Refrescamos la página consultando la bbdd.
     * Para ello, extraemos las ids de los libros de la biblioteca y a continuación cogemos de cada uno sus datos.
     * Después actualizamos el campo "numberOfBooks" al número de libros totales, incluídos aquellos que no se han encontrado o no se han publicado.
     * Se llama a este método cada vez que montamos la página y cada vez que hacemos un cambio en "referencesList".
     */
    refresh: async function () {
      let booksKeys
      this.booksList = []
      this.referencesList = []
      this.numberOfBooks = -1
      // Extraemos las ids de los libros en la biblioteca
      await librariesCollection.doc(this.libID).get().then(doc => {
        booksKeys = doc.data().array_keys
      })
      // Por cada id de cada libro...
      for (let i = 0; i < booksKeys.length; ++i) {
        let a = booksKeys[i]
        this.referencesList.push(booksKeys[i])
        // ...cogemos sus datos
        await booksCollection.doc(a).get().then(doc => {
          if (doc.exists && doc.data().published) { // Comprobamos que el documento exista y sea público
            this.booksList.push({
              found: 1,
              id: a,
              title: doc.data().title,
              author: doc.data().author,
              description: doc.data().description
            })
          } else if (doc.exists) {
            this.booksList.push({
              found: 2,
              id: a
            })
          } else {
            this.booksList.push({
              found: 0,
              id: a
            })
          }
        })
      }
      this.numberOfBooks = this.booksList.length
    },

    /**
     * Volvemos a la vista anterior.
     */
    goBack () {
      this.$router.go(-1)
    },

    /**
     * Actualizamos el campo "array_keys" de la bbdd en base a la lista "referencesList".
     */
    updateReferencesList () {
      librariesCollection.doc(this.libID).update({
        array_keys: this.referencesList
      })
    },

    /**
     * @param {int} index: Índice en "booksList" del libro eliminado.
     * Cada vez que se presiona el botón de borrar un libro se accede a este método.
     * Su procedimiento es:
     *  Elimina el libro del array "referencesList".
     *  Llama a "updateReferencesList()" para actualizar la bbdd.
     *  Refresca la página.
     */
    deleteButton (index) {
      this.referencesList.splice(index, 1)
      this.updateReferencesList()
      this.refresh()
    },

    /**
     * @param {int} index: Índice en "booksList" del libro subido.
     * Cada vez que se presiona el botón de subir un libro se accede a este método.
     * Su procedimiento es:
     *  Actualiza el array "referencesList" subiendo el libro de "index" y bajando el de "preIndex".
     *  Llama a "updateReferencesList()" para actualizar la bbdd.
     *  Refresca la página.
     */
    upButton (index) {
      let preIndex = index - 1
      let aux = this.referencesList[preIndex]
      this.referencesList[preIndex] = this.referencesList[index]
      this.referencesList[index] = aux
      this.updateReferencesList()
      this.refresh()
    },

    /**
     * @param {int} index: Índice en "booksList" del libro bajado.
     * Cada vez que se presiona el botón de bajar un libro se accede a este método.
     * Su procedimiento es:
     *  Actualiza el array "referencesList" bajando el libro de "index" y subiendo el de "posIndex".
     *  Llama a "updateReferencesList()" para actualizar la bbdd.
     *  Refresca la página.
     */
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

.booksListSuccess {
  text-align: justify;
  background-color: #E9FFE2;
  border: 1px solid #DBECD5;
  margin-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 10px;
}

.booksListError {
  text-align: justify;
  background-color: #ffeaea;
  border: 1px solid #ebdbdb;
  margin-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 10px;
}

.buttonSuccess {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-right: 5px;
  text-align: center;
}

.buttonError {
  cursor: pointer;
  background-color: #ee9090;
  border: 1px solid #640000;
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

.textInfo {
  font: 12px/12px Arial;
}

.textError {
  font: bold 14px/30px Arial;
  color: #C24D4D;
}
</style>
