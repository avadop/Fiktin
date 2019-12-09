<template>
  <div class="CreateLibrary">
    <button v-if="!opened" class="buttonCreate" :disabled="modifying != -1" @click="btnCreateNewLib()">Crear nueva biblioteca</button>
    <CreateLibrary v-else class="create" :librariesNamesList="getLibrariesNameList()" @cancel="btnCreateNewLib" @create="createLibrary"/>
    <h3 v-if="librariesList.length===0">No hay librerias creadas</h3>
    <span v-else>
        <div class="librariesList" v-for="(library, index) in librariesList" :key="library.name">
          <span class="text">Nombre: {{ library.name }}</span>
          <br>
          <span v-if="library.description!==''">Descripción: {{ library.description }}</span>
          <span v-else>Sin descripción</span>
          <br>
          <span>Privacidad: </span>
          <span v-if="library.privacy==='public'">pública</span>
          <span v-else>privada</span>
          <br>
          <button v-if="modifying===-1 || modifying !==index" class="buttonModify" :disabled="opened || modifying != -1" @click="btnModifyLib(index)">Modificar</button>
          <ModifyLibrary v-else-if="modifying===index" class="modify" :disabled="opened || modifying != -1" :librariesNamesList="getLibrariesNameListModify(index)" :index="index" :nameAux="librariesList[index].name" :descriptionAux="librariesList[index].description" :privacyAux="librariesList[index].privacy" @cancel="btnModifyLib" @modify="modifyLibrary"/>
          <button v-if="modifying!==index" class="buttonModify" :disabled="opened || modifying != -1" @click="btnDeleteLib(index)">Eliminar</button>
        </div>
    </span>
  </div>
</template>

<script>
import CreateLibrary from '@/components/CreateLibrary.vue'
import ModifyLibrary from '@/components/ModifyLibrary.vue'

export default {
  name: 'libraries',
  components: {
    CreateLibrary,
    ModifyLibrary
  },
  data () {
    return {
      librariesList: [
        { name: 'prueba 1', description: '4', privacy: 'public' },
        { name: 'prueba 2', description: '', privacy: 'private' }
      ],
      opened: false,
      modifying: -1
    }
  },
  methods: {
    getLibrariesNameList () {
      let nameList = new Array(this.librariesList.length)
      for (let i = 0; i < this.librariesList.length; ++i) {
        nameList[i] = this.librariesList[i].name
      }
      return nameList
    },
    getLibrariesNameListModify (index) {
      let nameList = new Array(this.librariesList.length)
      for (let i = 0; i < this.librariesList.length; ++i) {
        if (this.librariesList[i].name !== this.librariesList[index].name) nameList[i] = this.librariesList[i].name
      }
      return nameList
    },
    btnCreateNewLib () {
      this.opened = !this.opened
    },
    btnModifyLib (index) {
      this.modifying = index
    },
    btnDeleteLib (index) {
      this.librariesList.splice(index, 1)
    },
    createLibrary (name, description, privacy) {
      this.librariesList.push({ name: name, description: description, privacy: privacy })
      this.btnCreateNewLib()
    },
    modifyLibrary (index, name, description, privacy) {
      this.librariesList[index].name = name
      this.librariesList[index].description = description
      this.librariesList[index].privacy = privacy
      this.btnModifyLib(-1)
    }
  }
}
</script>

<style scoped>
.buttonCreate {
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-right: 5px;
}

.buttonModify {
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
  background-color: #E9FFE2;
  border: 1px solid #E9FFE2;
  border-top: 1px solid #DBECD5;
}

.librariesList {
  text-align: justify;
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
