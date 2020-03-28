<template>
  <div class="CreateLibrary">
    <b-card class="background-card">
      <div v-if="this.internetConnection === 0" class="d-flex justify-content-end">
        <h4 class="mr-auto">Sección de tus bibliotecas</h4>
        <b-button v-if="!opened" variant="info" size="sm" class="m-md-2" :disabled="modifying != -1" @click="btnCreateNewLib()">
          <b-icon icon="plus"></b-icon> Crear biblioteca
        </b-button>
      </div>
      <CreateLibrary v-if="opened && this.internetConnection === 0" class="create" @cancel="btnCreateNewLib" @create="createLibrary"/>
      <!-- Mensaje o librerías según la conexión y el número de libros -->
      <h3 v-if="this.numberOfLibraries === 0 && this.internetConnection === 0">No hay bibliotecas creadas</h3>
      <h3 v-else-if="this.numberOfLibraries === -1 && this.internetConnection === 0">Cargando</h3>
      <h3 v-else-if="this.internetConnection === -1">vaya, parece que no tienes conexión y no podemos mostrar tus bibliotecas<br>Revisa tu conexión y actualiza la página para solucionar el problema</h3>
      <span v-else> <!-- Aunque no haya conexión, si se han cargado las librerías se siguen mostrando -->
        <b-list-group v-for="(library, index) in librariesList" :key="library.name" @click="viewLibrary(library.id, library.name, library.numberOfBooks, index)">
          <b-list-group-item>
            <div v-if="modifying!==index || library.id === searchHistory">
              <div class="row d-flex justify-content-end">
                <h4 class="mr-auto">
                  {{ library.name }} <a class="h4 mb-2" v-if="library.privacy==='public'"><b-icon icon="eye"></b-icon></a>
                  <a class="h4 mb-2" v-else><b-icon icon="eye-slash"></b-icon></a>
                </h4>
                <div class="m-md-2">
                  <span v-if="library.numberOfBooks === 0">Sin libros </span>
                  <span v-else-if="library.numberOfBooks === 1">{{ library.numberOfBooks }} libro </span>
                  <span v-else>{{ library.numberOfBooks }} libros </span>
                </div>
              </div>
              <div class="row d-flex justify-content-end">
                <div class="mr-auto">
                  <span v-if="library.description!==''">{{ library.description }}</span>
                  <span v-else>Sin descripción</span>
                </div>
                <div class="m-md-2">
                  <b-button v-if="(modifying===-1 || modifying !==index) && library.id !== searchHistory" variant="primary" :disabled="opened || modifying != -1" @click.stop="btnModifyLib(index)">Modificar</b-button>
                  <b-button v-if="modifying!==index && library.id !== searchHistory" variant="danger" :disabled="opened || modifying != -1" @click.stop="btnDeleteHandler(library.id)">Eliminar</b-button>
                </div>
              </div>
            </div>
            <ModifyLibrary v-else :disabled="opened || modifying != -1" :index="index" :nameAux="librariesList[index].name" :descriptionAux="librariesList[index].description" :privacyAux="librariesList[index].privacy" :id="librariesList[index].id" @cancel="btnModifyLib" @modify="modifyLibrary"/>
          </b-list-group-item>
        </b-list-group>
      </span>
    </b-card>
  </div>
</template>

<script>
// import router from '../router/index.js'
import CreateLibrary from '@/components/CreateLibrary.vue'
import ModifyLibrary from '@/components/ModifyLibrary.vue'
import { librariesCollection, connectedRef } from '../firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'libraries',
  components: {
    CreateLibrary,
    ModifyLibrary
  },
  /**
   * librariesList: Array con los datos de las librerías del usuario con la sesión iniciada.
   * searchNick: Nombre en minúsculas de la biblioteca "mis obras" del usuario con la sesión iniciada.
   * searchHistory: Nombre en minúsculas de la biblioteca "historial" del usuario con la sesión iniciada.
   * opened: Booleano que indica si el botón de crear biblioteca ha sido presionado o no. false para no, true para sí.
   * opened: Entero que indica si el botón de modificar biblioteca ha sido presionado o no. Tiene varios valores:
   *  -1: No se ha presionado.
   *  >=0: Índice de la biblioteca a modificar.
   * numberOfLibraries: Número de bibliotecas que tiene el usuario (menos la biblioteca "mis obras"). Tiene varios valores:
   *  -3: No se ha iniciado.
   *  -1: No se ha encontrado ninguna biblioteca o se están cargando.
   *  >=0: Indica la cantidad de libros en la biblioteca.
   * internetConnection: Indica el estado de la conexión a Internet. Tiene varios valores:
   *  -1: No hay conexión a Internet.
   *  0: Hay conexión a Internet.
   *  1: No se ha iniciado el valor.
   */
  data () {
    return {
      librariesList: [],
      searchNick: store.state.userNick.concat('_mis_obras').toLowerCase(),
      searchHistory: store.state.userNick.concat('_historial').toLowerCase(),
      opened: false,
      modifying: -1,
      numberOfLibraries: -3,
      internetConnection: 1
    }
  },
  /**
   * En este método comprobamos la conexión a Internet. Si hay conexión, se actualiza la lista de bibliotecas, si no, no.
   */
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
    /**
     * Refrescamos la página consultando la bbdd.
     * Para ello, consultamos las bibliotecas del usuario con la sesión iniciada e insertamos sus datos en "librariesListAux".
     * Después actualizamos el campo "numberOfLibraries" al número de bibliotecas totales.
     * Se llama a este método cada vez que montamos la página y cada vez que hacemos un cambio en "librariesList".
     */
    refresh: async function () {
      this.numberOfLibraries = -1
      let librariesListAux = []
      var userID = store.state.userID
      await librariesCollection.where('user_id', '==', userID).get().then(snapshot => {
        snapshot.forEach(doc => {
          // Comprobamos que no se agregue la biblioteca de la variable "searchNick"
          if (doc.id !== this.searchNick) {
            // Comprobamos que siempre se muestre el historial delante del resto de bibliotecas
            if (doc.id === this.searchHistory) {
              librariesListAux.unshift({ // insertamos en la primera posición del array
                id: doc.id,
                name: doc.data().name,
                description: doc.data().description,
                privacy: doc.data().privacy,
                numberOfBooks: doc.data().array_keys.length
              })
            } else {
              librariesListAux.push({
                id: doc.id,
                name: doc.data().name,
                description: doc.data().description,
                privacy: doc.data().privacy,
                numberOfBooks: doc.data().array_keys.length
              })
            }
          }
        })
      })
      this.librariesList = librariesListAux
      this.numberOfLibraries = this.librariesList.length
    },

    /**
     * Se modifica el valor de "opened", negándolo (si era true, ahora es false, y viceversa).
     */
    btnCreateNewLib () {
      this.opened = !this.opened
    },

    /**
     * @param {int} index: Índice en "librariesList" de la biblioteca a modificar.
     * Cada vez que se presiona el botón de modificar biblioteca se llama a este método.
     * Se modifica el valor de "modifying" con el índice del libro que se va a modificar.
     */
    btnModifyLib (index) {
      this.modifying = index
    },

    /**
     * @param {String} idAux: ID en la bbdd de la biblioteca a eliminar. No se usa en este método más que para pasárselo al de borrar.
     * Cada vez que se presiona el botón de eliminar, se llama a este método.
     * Se encarga de mostrar en una pequeña ventana emergente una confirmación del borrado de una biblioteca.
     * Se ofrecen dos opciones para pulsar:
     *  "Sí", en cuyo caso se cierra la ventana emergente y se borra la biblioteca.
     *  "No", en cuyo caso se cierra la ventana emergente.
     * Si se pulsa fuera de la ventana emergente, esta se cierra.
     * Si se pulsa la tecla "Intro", la ventana emergente se cierra.
     */
    btnDeleteHandler (idAux) {
      // Usamos un modal dinámico
      this.$modal.show('dialog', {
        text: '¿Estás seguro de que deseas borrar esta biblioteca?',
        buttons: [
          {
            title: 'Sí',
            handler: () => {
              this.$modal.hide('dialog') // Escondemos el modal
              this.deleteLib(idAux)
            }
          },
          {
            title: 'No',
            default: true // Si se pulsa la tecla intro, se activa esta opción
          }
        ]
      })
    },

    /**
     * @param {String} idAux: ID en la bbdd de la biblioteca a eliminar.
     * Cada vez que se presiona el botón de confirmación de eliminar biblioteca (en la ventana emergente) se llama a este método.
     * Su procedimiento es:
     *  Actualiza la bbdd eliminando la biblioteca.
     *  Refresca la página.
     */
    async deleteLib (idAux) {
      await librariesCollection.doc(idAux).delete()
      this.refresh()
    },

    /**
     * Cada vez que se presiona el botón de crear biblioteca en el componente "CreateLibrary" se llama a este método.
     * Su procedimiento es:
     *  Refresca la página.
     *  Llama a "btnCreateNewLib()".
     */
    createLibrary () {
      this.refresh()
      this.btnCreateNewLib()
    },

    /**
     * Cada vez que se presiona el botón de modificar biblioteca en el componente "ModifyLibrary" se llama a este método.
     * Su procedimiento es:
     *  Refresca la página.
     *  Llama a "btnModifyLib()" con un valor de -1, indicando que se ha cerrado el apartado de modificar biblioteca correspondiente.
     */
    modifyLibrary () {
      this.refresh()
      this.btnModifyLib(-1)
    },

    /**
     * @param {String} id: ID (en la bbdd) de la biblioteca que se desea ver.
     * @param {String} name: Nombre de la biblioteca que se desea ver.
     * @param {String} nBooks: Cantidad de libros de la biblioteca a eliminar.
     * Llama a la vista "ViewLibrary" para mostrar el contenido de la biblioteca seleccionada
     */
    viewLibrary (id, name, nBooks, index) {
      if (this.modifying === -1 && !this.opened) this.$router.push({ name: 'viewLibrary', params: { libID: id, name: name, numberOfBooks: nBooks, idx: index } })
    }
  }
}
</script>

<style scoped>
.background-card {
  background-color: #e2e7ec;
}
</style>
