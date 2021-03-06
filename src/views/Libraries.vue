<template>
  <div class="CreateLibrary">
    <b-card class="background-card">
      <b-modal id="modal-create" size="xl" v-model="modalCreate" hide-footer hide-header no-close-on-backdrop>
        <CreateLibrary v-if="this.internetConnection === 0" class="create" @cancel="discardChangesLibrary" @create="createLibrary"/>
      </b-modal>
      <div v-if="this.internetConnection === 0" class="d-flex justify-content-end">
        <h4 class="mr-auto">Mis bibliotecas</h4>
        <!-- Botón de creación de librería según la conexión. Si no hay, no aparece el botón -->
        <b-button variant="info" size="sm" class="m-md-2" v-b-modal.modal-create style="font-size: 14px;">
          <b-icon icon="plus"></b-icon> Crear biblioteca
        </b-button>
      </div>
      <!-- <CreateLibrary v-if="opened && this.internetConnection === 0" class="create" @cancel="btnCreateNewLib" @create="createLibrary"/> -->
      <!-- Mensaje o librerías según la conexión y el número de libros -->
      <h3 v-if="this.numberOfLibraries === 0 && this.internetConnection === 0">No hay bibliotecas creadas</h3>
      <h3 v-else-if="this.numberOfLibraries === -1 && this.internetConnection === 0">Cargando</h3>
      <h3 v-else-if="this.internetConnection === -1">vaya, parece que no tienes conexión y no podemos mostrar tus bibliotecas<br>Revisa tu conexión y actualiza la página para solucionar el problema</h3>
      <span v-else> <!-- Aunque no haya conexión, si se han cargado las librerías se siguen mostrando -->
        <b-list-group v-for="(library, index) in librariesList" :key="library.name" @click="viewLibrary(library.id, library.name, library.numberOfBooks, index)">
          <b-list-group-item>
            <div>
              <div class="row d-flex justify-content-end">
                <!-- Nombre -->
                <h4 class="mr-auto">
                  {{ library.name }} <a class="h4 mb-2" v-if="library.privacy==='public'"><b-icon icon="eye"></b-icon></a>
                  <a class="h4 mb-2" v-else><b-icon icon="eye-slash"></b-icon></a>
                </h4>
                <!-- Número de libros -->
                <div class="m-md-2">
                  <span v-if="library.numberOfBooks === 0">Sin libros </span>
                  <span v-else-if="library.numberOfBooks === 1">{{ library.numberOfBooks }} libro </span>
                  <span v-else>{{ library.numberOfBooks }} libros </span>
                </div>
              </div>
              <div class="row d-flex justify-content-end">
                <!-- Descripción -->
                <div class="mr-auto">
                  <span v-if="library.description!==''">{{ library.description }}</span>
                  <span v-else>Sin descripción</span>
                </div>
                <!-- Botones -->
                <div class="m-md-2">
                  <b-button v-if="(modifying===-1 || modifying !==index) && library.id == searchHistory" variant="outline-dark" style="font-size: 16px;" @click.stop="btnEmptyHistory(library.id)">Vaciar historial</b-button>
                  <b-button variant="outline-dark" v-if="library.id != searchHistory" @click.stop="btnModifyLib(index)" style="font-size: 16px;">Modificar</b-button>
                  <b-button variant="danger" v-if="library.id != searchHistory" @click.stop="btnDeleteHandler(index)" style="font-size: 16px;">Eliminar</b-button>
                  <DeleteLibraryModal v-if="showModal===index" :name="librariesList[index].name" :id="librariesList[index].id" @cancel="btnDeleteHandler" @delete="deleteLib"/>
                </div>
              </div>
            </div>
          </b-list-group-item>
          <b-modal v-if="modifying === index" size="xl" v-model="modalModify" hide-footer hide-header no-close-on-backdrop>
            <ModifyLibrary :index="index" :nameAux="librariesList[index].name" :descriptionAux="librariesList[index].description" :privacyAux="librariesList[index].privacy" :id="librariesList[index].id" @cancel="btnModifyLib" @modify="modifyLibrary"/>
          </b-modal>
        </b-list-group>
      </span>
    </b-card>
  </div>
</template>

<script>
// import router from '../router/index.js'
import CreateLibrary from '@/components/CreateLibrary.vue'
import ModifyLibrary from '@/components/ModifyLibrary.vue'
import DeleteLibraryModal from '@/components/modals/DeleteLibraryModal.vue'
import { librariesCollection, connectedRef } from '../firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'libraries',
  components: {
    CreateLibrary,
    ModifyLibrary,
    DeleteLibraryModal
  },
  /**
   * librariesList: Array con los datos de las librerías del usuario con la sesión iniciada.
   * searchNick: Nombre en minúsculas de la biblioteca "mis obras" del usuario con la sesión iniciada.
   * searchHistory: Nombre en minúsculas de la biblioteca "historial" del usuario con la sesión iniciada.
   * showModal: Índice del libro que se desea eliminar. Si su valor es -1, significa que no se ha pulsado sobre ninguno.
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
      // searchNick: store.state.userNick.concat('_mis_obras').toLowerCase(),
      searchHistory: store.state.userNick.concat('_historial').toLowerCase(),
      showModal: -1,
      modifying: -1,
      numberOfLibraries: -3,
      internetConnection: 1,
      modalCreate: false,
      modalModify: false
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
          // if (doc.id !== this.searchNick) {
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
          // }
        })
      })
      this.librariesList = librariesListAux
      this.numberOfLibraries = this.librariesList.length
    },

    /**
     * @param {int} index: Índice en "librariesList" de la biblioteca a modificar.
     * Cada vez que se presiona el botón de modificar biblioteca se llama a este método.
     * Se modifica el valor de "modifying" con el índice del libro que se va a modificar.
     */
    btnModifyLib (index) {
      this.modifying = index
      this.modalModify = true
    },

    /**
     * @param {Number} index: Índice de la biblioteca que se desea eliminar.
     * Cada vez que se presiona el botón de eliminar, se llama a este método.
     * Se encarga de modificar la variable "showModal" para que se pueda mostrar o no el modal de borrar la biblioteca.
     */
    btnDeleteHandler (index) {
      // Usamos un modal dinámico
      this.showModal = index
    },

    /**
     * @param {String} id: ID de la biblioteca que se desea vaciar.
     * Cada vez que se presiona el botón de vaciar, se llama a este método.
     * Se encarga de vaciar de libros la biblioteca con el id pasado como parámetro. Después de hacerlo, recarga la página.
     */
    async btnEmptyHistory (id) {
      await librariesCollection.doc(id).update({
        array_keys: []
      })
      this.refresh()
    },

    /**
     * @param {String} idAux: ID en la bbdd de la biblioteca a eliminar.
     * Cada vez que se presiona el botón de confirmación de eliminar biblioteca (en el modal emergente) se llama a este método.
     * Su procedimiento es:
     *  Actualiza la bbdd eliminando la biblioteca.
     *  Refresca la página.
     *  Actualiza la variable "showModal" para que el modal no se siga mostrando.
     */
    async deleteLib (idAux) {
      await librariesCollection.doc(idAux).delete()
      this.refresh()
      this.showModal = -1
    },

    /**
     * Cada vez que se presiona el botón de crear biblioteca en el componente "CreateLibrary" se llama a este método.
     * Su procedimiento es:
     *  Refresca la página.
     */
    createLibrary () {
      this.modalCreate = false
      this.refresh()
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
      this.modalModify = false
    },
    discardChangesLibrary: function () {
      this.modalCreate = false
      this.modifying = -1
      this.modalModify = false
    },

    /**
     * @param {String} id: ID (en la bbdd) de la biblioteca que se desea ver.
     * @param {String} name: Nombre de la biblioteca que se desea ver.
     * @param {String} nBooks: Cantidad de libros de la biblioteca a eliminar.
     * Llama a la vista "ViewLibrary" para mostrar el contenido de la biblioteca seleccionada
     */
    viewLibrary (id, name, nBooks, index) {
      var isHistorial = false
      if (this.librariesList[index].id === this.searchHistory) { isHistorial = true }
      if (this.modifying === -1 && !this.opened) this.$router.push({ name: 'viewLibrary', params: { libID: id, name: name, numberOfBooks: nBooks, idx: index, historial: isHistorial } })
    }
  }
}
</script>

<style scoped>
.background-card {
  background-color: #e2e7ec;
}
.list-group {
  padding-left: 60px;
  padding-right: 60px;
}
.list-group-item {
  cursor: pointer;
}
</style>
