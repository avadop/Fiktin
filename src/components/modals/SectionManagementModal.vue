<template>
  <b-modal id="bv-modal-example" size="lg" title="Gestión de secciones" centered @hide="closeButton">
    <h6>Sección actual: {{ id }} - {{ name }}</h6>
    <br>
    <span>Nota: La sección 0 de la tabla indica la primera sección que se carga al abrir el libro</span>
    <table id="customers">
      <thead>
        <th class="headerIndex"/>
        <th class="headerID">ID</th>
        <th class="headerName">Nombre</th>
        <th class="headerButtons">Acciones</th>
      </thead>
      <tr v-for="(section, index) in sectionsData" :key="index">
        <th>{{ index }}</th>
        <td>{{ section.id }}</td>
        <td>
          <b-form-input v-if="section.name.length==0 || section.name.length>50" v-model="section.name" :state="false" size="sm" placeholder="Escribe algo"/>
          <b-form-input v-else v-model="section.name" size="sm" placeholder="Escribe algo"/>
        </td>
        <td>
          <b-button variant="outline-secondary" size="sm">
            <b-icon icon="chevron-up" class="marginLeftButtonSelected" @click="sectionUp(index)"/>
          </b-button>
          <b-button variant="outline-secondary" size="sm">
            <b-icon icon="chevron-down" class="marginLeftButtonSelected" @click="sectionDown(index)"/>
          </b-button>
          <b-button variant="outline-secondary" size="sm">
            <b-icon icon="layers" class="marginLeftButtonSelected" @click="sectionClone(index)"/>
          </b-button>
          <b-button variant="outline-danger" size="sm">
            <b-icon icon="trash-fill" class="marginLeftButtonSelected" @click="sectionDelete(index)"/>
          </b-button>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <b-button class="block" variant="outline-success" @click="newSection">Nueva sección</b-button>
        </td>
      </tr>
    </table>
    <template v-slot:modal-footer>
      <b-button class="size" size="mt-1" variant="outline-secondary" @click="closeButton">Cerrar</b-button>
    </template>
  </b-modal>
</template>

<script>
import { sectionsCollection } from '@/firebase.js'

export default {
  name: 'sectionManagementModal',
  props: {
    name: String,
    id: String,
    book_title: String,
    book_author_ID: String,
    sectionsList: Array
  },
  data () {
    return {
      sectionsData: []
    }
  },
  mounted () {
    this.$bvModal.show('bv-modal-example')
    this.refresh()
  },
  methods: {
    refresh: async function () {
      for (var i = 0; i < this.sectionsList.length; ++i) {
        await sectionsCollection.doc(this.sectionsList[i]).get().then(doc => {
          this.sectionsData.push({ id: doc.id, name: doc.data().name })
        })
      }
    },
    sectionUp (index) {
      if (index > 0) {
        var aux = this.sectionsData[index]
        this.$set(this.sectionsData, index, this.sectionsData[index - 1])
        this.$set(this.sectionsData, index - 1, aux)
      }
    },
    sectionDown (index) {
      if (index < this.sectionsData.length - 1) {
        var aux = this.sectionsData[index]
        this.$set(this.sectionsData, index, this.sectionsData[index + 1])
        this.$set(this.sectionsData, index + 1, aux)
      }
    },
    async sectionClone (index) {
      var a
      // Por si tarda más de la cuenta, ponemos una fila cargando
      this.sectionsData.splice(index + 1, 0, { id: 'Cargando...', name: 'Cargando...' })
      // Si clonamos la sección actual, primero la guardamos
      if (this.sectionsData[index].id === this.id) {
        this.$emit('saveActual')
      }
      // Descargamos todos los datos de la sección a clonar
      await sectionsCollection.doc(this.sectionsData[index].id).get().then(doc => {
        a = { book_author_ID: doc.data().book_author_ID,
          book_title: doc.data().book_title,
          gadgets: doc.data().gadgets,
          name: doc.data().name + '-copia' }
      })
      // Creamos una nueva sección con los datos recién descargados
      var b = await sectionsCollection.add({
        book_author_ID: a.book_author_ID,
        book_title: a.book_title,
        gadgets: a.gadgets,
        name: a.name.substring(0, 50)
      })
      // Quitamos la fila de cargando e insertamos los datos de la nueva sección
      this.sectionsData.splice(index + 1, 1)
      this.sectionsData.splice(index + 1, 0, { id: b.id, name: a.name.substring(0, 50) })
      // Actualizamos las secciones de la bd de libros
      var c = this.extractIDs()
      this.$emit('update', c)
    },
    async sectionDelete (index) {
      // No se pueden borrar secciones si es la única presente en el libro
      if (this.sectionsData.length > 1) {
        var c
        // Borramos la sección
        await sectionsCollection.doc(this.sectionsData[index].id).delete()
        // Si borramos la sección en la que nos encontramos, cargamos la del índice 0
        if (this.sectionsData[index].id === this.id) {
          this.sectionsData.splice(index, 1)
          c = this.extractIDs()
          this.$emit('update', c)
          this.$emit('load', this.sectionsData[0].id)
        } else {
          this.sectionsData.splice(index, 1)
          c = this.extractIDs()
          this.$emit('update', c)
        }
      } else {
        window.alert('No se puede borrar esta sección al no haber ninguna más')
      }
    },
    async newSection () {
      var a = await sectionsCollection.add({
        name: 'Nueva sección',
        book_author_ID: this.book_author_ID,
        book_title: this.book_title,
        gadgets: [{
          htmlText: '',
          component: 'Normal',
          componentName: 'Texto normal'
        }]
      })
      this.sectionsData.push({ id: a.id, name: 'Nueva sección' })
      var c = this.extractIDs()
      this.$emit('update', c)
    },
    async closeButton () {
      // Cada vez que se cierra el modal, actualizamos toa la información de las secciones
      var c = this.extractIDs()
      this.$emit('update', c)
      for (var i = 0; i < this.sectionsData.length; ++i) {
        await sectionsCollection.doc(this.sectionsData[i].id).update({
          name: this.sectionsData[i].name
        })
      }
      this.$emit('load', this.id)
      this.$emit('cancel')
    },
    extractIDs () {
      var a = []
      for (var i = 0; i < this.sectionsData.length; ++i) {
        a.push(this.sectionsData[i].id)
      }
      return a
    }
  }
}
</script>

<style scoped>
#customers {
  border-collapse: collapse;
  width: 100%;
}
#customers td, #customers th {
  border: 1px solid #ddd;
  padding: 8px;
}
#customers tr:hover {
  background-color: rgb(238, 248, 255);
}
.headerIndex {
  width: 5%;
}
.headerID {
  width: 25%;
}
.headerName {
  width: 35%;
}
.headerButtons {
  width: 25%;
}
.block {
  width: 98.5%;
}
.size {
  width: 200px;
  height: 40px;
}
</style>
