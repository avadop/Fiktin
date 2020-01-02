<template>
  <div class="CreateLibrary">
    <!-- Botón de creación de librería según la conexión. Si no hay, no aparece el botón -->
    <button v-if="!opened && this.internetConnection === 0" class="buttonCreate" :disabled="modifying != -1" @click="btnCreateNewLib()">Crear nueva biblioteca</button>
    <CreateLibrary v-else-if="opened && this.internetConnection === 0" class="create" @cancel="btnCreateNewLib" @create="createLibrary"/>
    <!-- Mensaje o librerías según la conexión y el número de libros -->
    <h3 v-if="this.numberOfLibraries === 0 && this.internetConnection === 0">No hay bibliotecas creadas</h3>
    <h3 v-else-if="this.numberOfLibraries === -1 && this.internetConnection === 0">Cargando</h3>
    <h3 v-else-if="this.internetConnection === -1">vaya, parece que no tienes conexión y no podemos mostrar tus bibliotecas<br>Revisa tu conexión y actualiza la página para solucionar el problema</h3>
    <span v-else> <!-- Aunque no haya conexión, si se han cargado las librerías se siguen mostrando -->
      <div class="librariesList" v-for="(library, index) in librariesList" :key="library.name" @click="viewLibrary(library.id, library.name, library.numberOfBooks)">
        <span class="text">Nombre: {{ library.name }}</span>
        <br>
        <span v-if="library.description!==''">Descripción: {{ library.description }}</span>
        <span v-else>Sin descripción</span>
        <br>
        <span>Privacidad: </span>
        <span v-if="library.privacy==='public'">pública</span>
        <span v-else>privada</span>
        <br>
        <span v-if="library.numberOfBooks === 0">Sin libros </span>
        <span v-else-if="library.numberOfBooks === 1">{{ library.numberOfBooks }} libro </span>
        <span v-else>{{ library.numberOfBooks }} libros </span>
        <br>
        <button v-if="modifying===-1 || modifying !==index" class="buttonModify" :disabled="opened || modifying != -1" @click.stop="btnModifyLib(index)">Modificar</button>
        <ModifyLibrary v-else-if="modifying===index" class="modify" :disabled="opened || modifying != -1" :index="index" :nameAux="librariesList[index].name" :descriptionAux="librariesList[index].description" :privacyAux="librariesList[index].privacy" :id="librariesList[index].id" @cancel="btnModifyLib" @modify="modifyLibrary"/>
        <button v-if="modifying!==index" class="buttonModify" :disabled="opened || modifying != -1" @click.stop="btnDeleteLib(library.id)">Eliminar</button>
      </div>
    </span>
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
  data () {
    return {
      librariesList: [],
      opened: false,
      modifying: -1,
      numberOfLibraries: -3,
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
      this.numberOfLibraries = -1
      let librariesListAux = []
      var userNick = store.state.userNick
      await librariesCollection.where('nick', '==', userNick).get().then(snapshot => {
        snapshot.forEach(doc => {
          librariesListAux.push({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            privacy: doc.data().privacy,
            numberOfBooks: doc.data().array_keys.length
          })
        })
      })
      this.librariesList = librariesListAux
      this.numberOfLibraries = this.librariesList.length
    },
    btnCreateNewLib () {
      this.opened = !this.opened
    },
    btnModifyLib (index) {
      this.modifying = index
    },
    btnDeleteLib (idAux, index) {
      Promise.all(
        this.librariesList.map(id => (
          librariesCollection.doc(idAux).delete()
        ))
      )
      this.refresh()
    },
    createLibrary () {
      this.refresh()
      this.btnCreateNewLib()
    },
    modifyLibrary () {
      this.refresh()
      this.btnModifyLib(-1)
    },
    viewLibrary (id, name, nBooks) {
      if (this.modifying === -1 && !this.opened) this.$router.push({ name: 'viewLibrary', params: { libID: id, name: name, numberOfBooks: nBooks } })
    }
  }
}
</script>

<style scoped>
.buttonCreate {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-right: 5px;
}

.buttonModify {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-right: 5px;
  margin-top: 10px;
}

.create {
  background-color: #E9FFE2;
  border: 1px solid #DBECD5;
}

.modify {
  cursor: default;
  background-color: #E9FFE2;
  border: 1px solid #E9FFE2;
  border-top: 1px solid #DBECD5;
}

.librariesList {
  text-align: justify;
  cursor: pointer;
  background-color: #E9FFE2;
  border: 1px solid #DBECD5;
  margin-top: 5px;
  margin-left: 30px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 10px;
}

.text {
  font: bold 14px/30px Arial;
}
</style>
