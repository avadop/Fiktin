<template>
  <b-modal id="bv-modal-example" size="lg" title="Gestión de secciones" centered scrollable @hide="closeButton" no-close-on-backdrop>
    <div v-if="!loading && !closing">
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
            <b-form-input v-if="section.name.length==0 || section.name.length>50" v-model="section.name" :state="false" @change="changes=true" size="sm" placeholder="Escribe algo"/>
            <b-form-input v-else v-model="section.name" @change="changes=true" size="sm" placeholder="Escribe algo"/>
          </td>
          <td>
            <!--Botón de subir-->
            <b-button variant="outline-secondary" style="font-size: 14px;" size="sm" v-if="index!==0&&!busy" @click="sectionUp(index)">
              <b-icon icon="chevron-up" class="marginLeftButtonSelected"/>
            </b-button>
            <b-button variant="outline-secondary" style="font-size: 14px;" size="sm" v-else-if="index==0||busy" disabled @click="sectionUp(index)">
              <b-icon icon="chevron-up" class="marginLeftButtonSelected"/>
            </b-button>
            <!--Botón de bajar-->
            <b-button variant="outline-secondary" style="font-size: 14px;" size="sm" v-if="index!==sectionsData.length-1&&!busy" @click="sectionDown(index)">
              <b-icon icon="chevron-down" class="marginLeftButtonSelected"/>
            </b-button>
            <b-button variant="outline-secondary" style="font-size: 14px;" size="sm" v-else-if="index==sectionsData.length-1||busy" disabled @click="sectionDown(index)">
              <b-icon icon="chevron-down" class="marginLeftButtonSelected"/>
            </b-button>
            <!--Botón de clonar-->
            <b-button variant="outline-secondary" style="font-size: 14px;" size="sm" v-if="!busy" @click="sectionClone(index)">
              <b-icon icon="layers" class="marginLeftButtonSelected"/>
            </b-button>
            <b-button variant="outline-secondary" style="font-size: 14px;" size="sm" v-else-if="busy" disabled @click="sectionClone(index)">
              <b-icon icon="layers" class="marginLeftButtonSelected"/>
            </b-button>
            <!--Botón de eliminar-->
            <b-button variant="outline-danger" style="font-size: 14px;" size="sm" v-if="sectionsData.length>1&&!busy" @click="sectionDelete(index)">
              <b-icon icon="trash-fill" class="marginLeftButtonSelected"/>
            </b-button>
            <b-button variant="outline-danger" style="font-size: 14px;" size="sm" v-else-if="sectionsData.length==1||busy" disabled @click="sectionDelete(index)">
              <b-icon icon="trash-fill" class="marginLeftButtonSelected"/>
            </b-button>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <b-button style="font-size: 16px;" class="block" variant="outline-success" v-if="!busy" @click="newSection">Nueva sección</b-button>
            <b-button style="font-size: 16px;" class="block" variant="outline-success" v-else-if="busy" disabled @click="newSection">Nueva sección</b-button>
          </td>
        </tr>
      </table>
      <span v-if="changes&&!busy">Los cambios se guardarán al cerrar la ventana</span>
    </div>
    <div style="text-align:center;" v-else-if="loading && !closing">
      <h1>Cargando datos de las secciones</h1>
      <b-spinner label="Spinning"/>
    </div>
    <div style="text-align:center;" v-else>
      <h1>Cerrando</h1>
      <b-spinner label="Spinning"/>
    </div>
    <template v-slot:modal-footer>
      <b-button style="font-size: 16spx;" class="size" size="mt-1" variant="outline-secondary" @click="hide">Guardar y cerrar</b-button>
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
      sectionsData: [],
      busy: false,
      loading: false,
      closing: false,
      changes: false
    }
  },
  mounted () {
    this.$bvModal.show('bv-modal-example')
    this.refresh()
  },
  methods: {
    refresh: async function () {
      this.loading = true
      for (var i = 0; i < this.sectionsList.length; ++i) {
        await sectionsCollection.doc(this.sectionsList[i]).get().then(doc => {
          this.sectionsData.push({ id: doc.id, name: doc.data().name })
        })
      }
      this.loading = false
    },
    sectionUp (index) {
      this.busy = true
      this.changes = true
      if (index > 0) {
        var aux = this.sectionsData[index]
        this.$set(this.sectionsData, index, this.sectionsData[index - 1])
        this.$set(this.sectionsData, index - 1, aux)
      }
      this.busy = false
    },
    sectionDown (index) {
      this.busy = true
      this.changes = true
      if (index < this.sectionsData.length - 1) {
        var aux = this.sectionsData[index]
        this.$set(this.sectionsData, index, this.sectionsData[index + 1])
        this.$set(this.sectionsData, index + 1, aux)
      }
      this.busy = false
    },
    async sectionClone (index) {
      var a
      this.busy = true
      this.changes = true
      // Por si tarda más de la cuenta, ponemos una fila cargando
      this.sectionsData.splice(index + 1, 0, { id: 'Cargando...', name: 'Cargando...' })
      // Si clonamos la sección actual, primero la guardamos
      if (this.sectionsData[index].id === this.id) {
        await this.$emit('saveActual')
      }
      // Descargamos todos los datos de la sección a clonar
      await sectionsCollection.doc(this.sectionsData[index].id).get().then(doc => {
        a = { book_author_ID: doc.data().book_author_ID,
          book_title: doc.data().book_title,
          gadgets: doc.data().gadgets,
          name: doc.data().name + '-copia' }
      })
      // Si hay casillas personalizadas, las ponemos TODAS en modo lectura
      a.gadgets = this.findCustomBoxes(a.gadgets)
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
      await this.$emit('update', c)
      this.busy = false
    },
    async sectionDelete (index) {
      this.busy = true
      this.changes = true
      // No se pueden borrar secciones si es la única presente en el libro
      if (this.sectionsData.length > 1) {
        var c
        var a
        // Borramos los índices de escritura de las custom boxes
        // Para ello, descargamos los gadgets de la sección a borrar
        await sectionsCollection.doc(this.sectionsData[index].id).get().then(doc => {
          a = doc.data().gadgets
        })
        this.$emit('deleteCustomBoxes', a)
        // Borramos la sección
        await sectionsCollection.doc(this.sectionsData[index].id).delete()
        // Si borramos la sección en la que nos encontramos, cargamos la del índice 0
        if (this.sectionsData[index].id === this.id) {
          this.sectionsData.splice(index, 1)
          c = this.extractIDs()
          await this.$emit('update', c)
          await this.$emit('load', this.sectionsData[0].id)
        } else {
          this.sectionsData.splice(index, 1)
          c = this.extractIDs()
          await this.$emit('update', c)
        }
      } else {
        window.alert('No se puede borrar esta sección al no haber ninguna más')
      }
      this.busy = false
    },
    async newSection () {
      this.busy = true
      this.changes = true
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
      await this.$emit('update', c)
      this.busy = false
    },
    async closeButton () {
      if (this.checkNames()) {
        // Cada vez que se cierra el modal, actualizamos toda la información de las secciones solo si ha habido cambios en él
        if (this.changes) {
          this.closing = true
          var c = this.extractIDs()
          await this.$emit('update', c)
          for (var i = 0; i < this.sectionsData.length; ++i) {
            await sectionsCollection.doc(this.sectionsData[i].id).get().then(doc => {
              if (doc.exists) {
                sectionsCollection.doc(this.sectionsData[i].id).update({
                  name: this.sectionsData[i].name
                })
              }
            })
          }
          await this.$emit('load', this.id)
        }
        await this.$emit('cancel')
      } else window.alert('Debes dar un nombre válido a todas las secciones (nombres vacíos o solo con espacios no son válidos)')
    },
    extractIDs () {
      var a = []
      for (var i = 0; i < this.sectionsData.length; ++i) {
        a.push(this.sectionsData[i].id)
      }
      return a
    },
    checkNames () {
      var a = true
      for (var i = 0; i < this.sectionsData.length && a; ++i) {
        if (this.sectionsData[i].name.trim() === '') a = false
      }
      return a
    },
    findCustomBoxes (aux) {
      for (var i = 0; i < aux.length; ++i) {
        if (aux[i].component === 'CustomBox' && aux[i].mode === 'write') {
          aux[i].mode = 'read'
          aux[i].value = ''
          aux[i].prevText = ''
          aux[i].nextText = ''
        }
      }
      return aux
    },
    hide () {
      this.$bvModal.hide('bv-modal-example')
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
