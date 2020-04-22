<template>
  <div class="viewLibrary">
    <b-card class="background-card">
      <!-- Cabecera -->
      <div class="d-flex justify-content-start">
        <b-button variant="light" @click="goBack()"><b-icon icon="chevron-left"></b-icon></b-button>
        <div>
          <h4>{{ name }} </h4>
          <h6 class="nBooks" v-if="numberOfBooks===1"> {{ numberOfBooks }} libro</h6>
          <h6 class="nBooks" v-else-if="numberOfBooks>1"> {{ numberOfBooks }} libros</h6>
        </div>
      </div>
      <br><br>
      <!-- Comprobamos conexión -->
      <h3 v-if="this.numberOfBooks === 0 && this.internetConnection === 0">No hay libros en esta biblioteca</h3>
      <h3 v-else-if="this.numberOfBooks === -1 && this.internetConnection === 0">Cargando</h3>
      <h3 v-else-if="this.internetConnection === -1">vaya, parece que no tienes conexión y no podemos mostrar los libros de esta biblioteca<br>Revisa tu conexión y actualiza la página para solucionar el problema</h3>
      <span v-else>
        <!-- Lista de libros -->
        <b-list-group v-for="(book, index) in booksList" :key="index">
          <!--En caso de libro encontrado y publicado-->
          <b-list-group-item v-if="book.found==1">
              <div class="d-flex justify-content-start">
                <!-- portada -->
                <div class="card-img-box">
                  <img class="card-img-top" :src="book.cover" alt="Portada" @click="openBook(book, index)">
                </div>
                <div>
                  <!-- botones subir bajar -->
                  <b-button-group v-if="idx !== 0" class="mr-1 move-button">
                    <b-button variant="light" @click.stop="upButton(index)" :disabled="index===0">
                      <b-icon icon="chevron-up"></b-icon>
                    </b-button>
                    <b-button variant="light" @click.stop="downButton(index)" :disabled="index===booksList.length-1">
                      <b-icon icon="chevron-down"></b-icon>
                    </b-button>
                  </b-button-group>
                  <!-- titulo y fecha -->
                  <div class="d-flex justify-content-start">
                    <h6 class="card-title" @click="openBook(book, index)">{{upperCase(book.title)}}</h6>
                    <h6 class="ml-2 nBooks">(dd-mm-aaaa)</h6>
                  </div>
                  <!-- autor -->
                  <div class="d-flex justify-content-start">
                    <h6 class="author-name">{{ book.author }}</h6>
                  </div>
                  <!-- descripcion -->
                  <div class="d-flex justify-content-start">
                    <b-card-text v-if="book.description!==''">
                      {{ book.description }}
                    </b-card-text>
                    <b-card-text v-else>
                      Sin descripción
                    </b-card-text>
                  </div>
                  <!-- boton de eliminar -->
                  <div v-if="idx !== 0" class="mr-1 del-button">
                    <b-button variant="danger" class="m-md-2" @click.stop="deleteButton(index)">Eliminar</b-button>
                  </div>
                </div>
              </div>
          </b-list-group-item>
          <!--En caso de libro encontrado pero no publicado-->
          <!--En caso de libro no encontrado o error-->
          <b-list-group-item variant="danger" v-else>
            <!-- botones subir bajar -->
            <b-button-group v-if="idx !== 0" class="mr-1 move-button">
              <b-button variant="light" @click.stop="upButton(index)" :disabled="index===0">
                <b-icon icon="chevron-up"></b-icon>
              </b-button>
              <b-button variant="light" @click.stop="downButton(index)" :disabled="index===booksList.length-1">
                <b-icon icon="chevron-down"></b-icon>
              </b-button>
            </b-button-group>
            <!-- error y codigo -->
            <div class="d-flex justify-content-start">
              <h5 v-if="book.found==2"><b-icon variant="danger" icon="exclamation-octagon-fill"></b-icon> Libro no publicado</h5>
              <h5 v-else><b-icon variant="danger" icon="exclamation-octagon-fill"></b-icon> Libro no encontrado</h5>
              <h6 class="ml-2 nBooks">({{ book.id }})</h6>
            </div>
            <!-- descripcion -->
            <div class="d-flex justify-content-start">
              <b-card-text v-if="book.found==2">
                El autor de este libro ha decidido no publicarlo. Se podrá leer cuando se publique.
              </b-card-text>
              <b-card-text v-else>
                No se encuentra este libro, quizá haya sido eliminado.
              </b-card-text>
            </div>
            <!-- boton de eliminar -->
            <div v-if="idx !== 0" class="mr-1 del-button">
              <b-button variant="danger" class="m-md-2" @click.stop="deleteButton(index)">Eliminar</b-button>
            </div>
          </b-list-group-item>
        </b-list-group>
      </span>
    </b-card>
  </div>
</template>

<script>
import { librariesCollection, booksCollection, userCollection, connectedRef } from '../firebase.js'
import { store } from '../store/index.js'

export default {
  name: 'viewLibrary',
  props: {
    libID: String,
    name: String,
    idx: Number
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
          if (doc.exists && (doc.data().published || doc.data().user_id === store.state.userID)) { // Comprobamos que el documento exista y sea público
            this.booksList.push({
              found: 1,
              id: a,
              title: doc.data().title,
              author: doc.data().author,
              description: doc.data().description,
              cover: doc.data().cover
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
    },

    /**
     * @param {Object} book: Libro con algunos datos
     * @param {int} idx: Índice en la lista de libros del libro "book"
     * Cada vez que se pulsa sobre un libro, si este existe, se debe acceder a él.
     * Este método se encarga de abrir la vista de leer libros si existe.
     * Para ello, recoge sus datos de firebase y después hace push a leer libro
     */
    async openBook (book, idx) {
      var bookAux
      var a
      await booksCollection.doc(this.referencesList[idx]).get().then(doc1 => {
        a = doc1.data().user_id
        bookAux = {
          author: doc1.data().author,
          title: doc1.data().title,
          description: doc1.data().description,
          cover: doc1.data().cover,
          tags: doc1.data().tags,
          userID: doc1.data().user_id,
          sections: doc1.data().sections
        }
      })
      await userCollection.doc(a).get().then(doc2 => {
        bookAux.nick = doc2.data().nick
        bookAux.name = doc2.data().name
      })
      this.$router.push({ name: 'readBook', params: { book: bookAux, bookID: this.referencesList[idx] } })
    },

    upperCase (title) {
      return title.toUpperCase()
    }
  }
}
</script>

<style scoped>
.list-group-item:last-child {
  min-height: 120px;
}
.background-card {
  background-color: #e2e7ec;
}
.card-img-box {
  text-align: center;
  min-width: 260px;
}
.card-img-top {
  display: block;
  cursor: pointer;
  min-height: 140px;
  max-height: 140px;
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
.author-name {
  color: #7b8793;
}
.list-group {
  padding-left: 60px;
  padding-right: 60px;
}
.move-button, .del-button {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
.move-button {
  top: 10px;
  width: 106px;
}
.del-button {
  bottom: 10px;
  width: 106px;
}
.nBooks {
    /*font: bold 14px Arial;*/
    color: #798079;
}
</style>
