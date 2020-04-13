<template>
  <div>
    <LoadingModal v-if="loading"/>
    <div class="buttons">
      <button class="buttonBack" @click="goBack()">Salir sin guardar</button>
      <button class="buttonBackAndSave" @click="goBackAndSave()">Guardar y salir</button>
      <h3 class="title">{{ book.title }}</h3>
      <br>
      <b-row>
        <b-col cols="3"><h5>Sección: {{ sectionName }}</h5></b-col>
        <b-col cols="1"><b-button variant="outline-secondary" size="sm" @click="openManagementSectionModal()"><b-icon icon="gear"/></b-button>
        <SectionManagementModal v-if="showManagementSectionModal" :name="sectionName" :id="sectionID" :book_title="book.title" :book_author_ID="book.userID" :sectionsList="book.sections" @update="updateBookSections" @load="refresh" @saveActual="save" @cancel="openManagementSectionModal"/></b-col>
        <b-col cols="3"><b-form-select size="sm" v-model="nextSectionID" :options="sectionsData" @change="save(), refresh(nextSectionID)"></b-form-select></b-col>
      </b-row>
    </div>
    <div class="editBook">
      <div class="sidebar">
        <h4>Gadgets</h4>
        <div class="sidebarHeight">
          <span style="color: red;" v-if="data.length==0">No hay gadgets creados. Para editar el documento, agrega uno primero</span>
          <div v-for="(text, index) in data" :key="index">
            <div class="sidebarBlock" v-if="lastPress!==index" @click="lastElementPressed(index)">
              <span class="marginLeft">Tipo: {{ text.componentName }}</span>
              <div class="h5 lg, verticalLine">
                <b-icon icon="chevron-up" class="marginLeftButton" @click.stop @mouseup="itemUp(index)">Subir gadget</b-icon>
                <b-icon icon="chevron-down" class="marginLeftButton" @click.stop @mouseup="itemDown(index)">Bajar gadget</b-icon>
                <b-icon icon="layers" class="marginLeftButton" @click.stop @mouseup="itemClone(index)">Duplicar gadget</b-icon>
                <b-icon icon="trash-fill" class="marginLeftButton" @click.stop @mouseup="itemDelete(index)">Eliminar gaget</b-icon>
              </div>
            </div>
            <div class="sidebarBlockSelected" v-else @click="lastElementPressed(index)">
              <span class="marginLeft">Tipo: {{ text.componentName }}</span>
              <div class="h5 lg, verticalLine">
                <b-icon icon="chevron-up" class="marginLeftButtonSelected" @click.stop @mouseup="itemUp(index)">Subir gadget</b-icon>
                <b-icon icon="chevron-down" class="marginLeftButtonSelected" @click.stop @mouseup="itemDown(index)">Bajar gadget</b-icon>
                <b-icon icon="layers" class="marginLeftButtonSelected" @click.stop @mouseup="itemClone(index)">Duplicar gadget</b-icon>
                <b-icon icon="trash-fill" class="marginLeftButtonSelected" @click.stop @mouseup="itemDelete(index)">Eliminar gadget</b-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h3 mb-2, options">
        <div class="normalPanel">
          <span style="font-size: 20px;">Texto normal</span>
          <b-icon icon="fonts" class="addGadgetButton" @click="addNormal()">Añadir</b-icon>
          <div class="normalPanelOptions">
            <b-icon icon="type-bold" class="buttonNormal" v-if="boldActive!=1" @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
            <b-icon icon="type-bold" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
            <b-icon icon="type-italic" class="buttonNormal" v-if="italicActive!=1" @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
            <b-icon icon="type-italic" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
            <b-icon icon="type-underline" class="buttonNormal" v-if="underlineActive!=1" @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
            <b-icon icon="type-underline" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
            <b-icon icon="type-strikethrough" class="buttonNormalRightBorder" v-if="strikeThroughActive!=1" @mousedown="onLiveEditComponent($event, 'StrikeThrough')">strikeThrough</b-icon>
            <b-icon icon="type-strikethrough" class="buttonPressedRightBorder" v-else @mousedown="onLiveEditComponent($event, 'StrikeThrough')">strikeThrough</b-icon>
          </div>
        </div>
        <div class="headerPanel">
          <span style="font-size: 20px;">Título</span>
          <b-icon icon="plus" class="addGadgetButton" @click="addTitle()">Añadir</b-icon>
          <div class="headerPanelOptions">
            <b-icon icon="type-h1" class="buttonNormal" v-if="header1Active!=1" @mousedown="onLiveEditComponent($event, 'Header1')">Añadir título 1</b-icon>
            <b-icon icon="type-h1" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Header1')">Añadir título 1</b-icon>
            <b-icon icon="type-h2" class="buttonNormal" v-if="header2Active!=1" @mousedown="onLiveEditComponent($event, 'Header2')">Añadir título 2</b-icon>
            <b-icon icon="type-h2" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Header2')">Añadir título 2</b-icon>
            <b-icon icon="type-h3" class="buttonNormalRightBorder" v-if="header3Active!=1" @mousedown="onLiveEditComponent($event, 'Header3')">Añadir título 3</b-icon>
            <b-icon icon="type-h3" class="buttonPressedRightBorder" v-else @mousedown="onLiveEditComponent($event, 'Header3')">Añadir título 3</b-icon>
          </div>
        </div>

        <div class="multimediaPanel">
          <span style="font-size: 20px;">Multimedia</span>
          <b-icon icon="plus" class="addGadgetButton" @click="addFile()">Añadir</b-icon>
          <div class="multimediaPanelOptions">
            <b-icon icon="image-fill" class="addGadgetButton" @click="changeFileType('picture')">Añadir</b-icon>
            <b-icon icon="camera-video-fill" class="addGadgetButton" @click="changeFileType('video')">Añadir</b-icon>
          </div>
        </div>

        <div class="sections">
          <span style="font-size: 20px">Siguiente sección</span>
          <b-icon icon="box-arrow-right" class="addGadgetButton" @click="addSectionChange()">Añadir</b-icon>
          <div/>
          <span style="font-size: 20px">Repetir sección</span>
          <b-icon icon="arrow-repeat" class="addGadgetButton" @click="addSectionRepeat()">Añadir</b-icon>

        </div>
        <b-icon icon="cloud-upload" class="buttonNormalRightBorder" @mouseup="save()">Save</b-icon>
      </div>
      <!--Poniendo el contenteditable, keyup y click aquí, podemos controlar las flechas de una forma muy sencilla-->
      <div class="document" @keyup="checkStyles" @keydown.tab.prevent>
        <div class="editable" v-for="(text, index) in data" :key="index" @click="lastElementPressed(index), checkStyles()">
          <Normal v-if="text.component=='Normal'"
            :htmlTextAux="text.htmlText"
            :index="index"
            :boldUse="boldUse"
            :italicUse="italicUse"
            :underlineUse="underlineUse"
            :strikeThroughUse="strikeThroughUse"
            :lastPress="lastPress"
            @html="saveHTML"
            @delete="checkDelete"/>
          <Header1 v-if="text.component=='Header1'"
            :htmlTextAux="text.htmlText"
            :plainTextAux="text.plainText"
            :index="index"
            @html="savePlaneAndHTML"/>
          <Header2 v-if="text.component=='Header2'"
            :htmlTextAux="text.htmlText"
            :plainTextAux="text.plainText"
            :index="index"
            @html="savePlaneAndHTML"/>
          <Header3 v-if="text.component=='Header3'"
            :htmlTextAux="text.htmlText"
            :plainTextAux="text.plainText"
            :index="index"
            @html="savePlaneAndHTML"/>

          <PictureGadget v-if="text.component==='Picture'"
            :bookID="bookID"
            :htmlTextAux="text.htmlText"
            :index="index"
            :openModal="openModalPicture"
            :lastPressed="lastPress"
            @cancel-picture="cancelMultimedia"
            @html="saveHTMLMultimedia"/>
          <VideoGadget v-if="text.component==='Video'"
            :index="index"
            :htmlTextAux="text.htmlText"
            :bookID="bookID"
            :openModal="openModalVideo"
            :lastPressed="lastPress"
            @cancel-video="cancelMultimedia"
            @html="saveHTMLMultimedia"/>

          <ChangeSection v-if="text.component=='ChangeSection'"
            :actualSection="sectionID"
            :auxSectionsData="sectionsData"
            :selectedSection="text.next"
            :textAux="text.plainText"
            :index="index"
            @section="saveHTMLAndSection"/>
          <RepeatSection v-if="text.component=='RepeatSection'"
            :actualSection="sectionID"
            :sectionName="sectionName"
            :textAux="text.plainText"
            :index="index"
            @html="savePlaneAndHTML"/>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sectionsCollection, booksCollection } from '@/firebase.js'
import SectionManagementModal from '@/components/modals/SectionManagementModal.vue'
import LoadingModal from '@/components/modals/LoadingModal.vue'
import Normal from '@/components/gadgets/Normal.vue'
import Header1 from '@/components/gadgets/Header1.vue'
import Header2 from '@/components/gadgets/Header2.vue'
import Header3 from '@/components/gadgets/Header3.vue'

import PictureGadget from '@/components/gadgets/PictureGadget.vue'
import VideoGadget from '@/components/gadgets/VideoGadget.vue'

import ChangeSection from '@/components/gadgets/ChangeSection.vue'
import RepeatSection from '@/components/gadgets/RepeatSection.vue'

export default {
  name: 'editBook',
  components: {
    SectionManagementModal,
    LoadingModal,
    Normal,
    Header1,
    Header2,
    Header3,

    PictureGadget,
    VideoGadget,

    ChangeSection,
    RepeatSection

  },
  props: {
    book: Object,
    bookID: String
  },
  data () {
    return {
      sectionName: '', // Nombre de la sección
      sectionID: '', // ID de la sección actual
      nextSectionID: this.book.sections[0], // ID de la sección que deseamos cargar
      sectionsData: [],
      loading: false,
      showManagementSectionModal: false,
      boldActive: 0,
      boldUse: false,
      italicActive: 0,
      italicUse: false,
      underlineActive: 0,
      underlineUse: false,
      strikeThroughActive: 0,
      strikeThroughUse: false,
      header1Active: 0,
      header2Active: 0,
      header3Active: 0,
      lastPress: -1,
      data: [],

      picture: false,
      video: false,
      openModalPicture: false,
      openModalVideo: false
    }
  },
  mounted () {
    this.refresh(this.book.sections[0])
  },
  methods: {
    refresh: async function (sectionID) {
      this.loading = true
      this.lastPress = -1
      this.sectionsData = []
      this.data = []
      for (var i = 0; i < this.book.sections.length; ++i) {
        await sectionsCollection.doc(this.book.sections[i]).get().then(doc => {
          this.sectionsData.push({ value: doc.id, text: doc.data().name })
        })
      }
      await sectionsCollection.doc(sectionID).get().then(doc => {
        this.sectionName = doc.data().name
        this.sectionID = doc.id
        this.nextSectionID = doc.id
        this.data = this.data.concat(doc.data().gadgets)
      })
      this.loading = false
    },
    itemUp (index) {
      if (index > 0) {
        var aux = this.data[index]
        this.data.splice(index, 1, this.data[index - 1])
        this.data.splice(index - 1, 1, aux)
      }
    },
    itemDown (index) {
      if (index < this.data.length - 1) {
        var aux = this.data[index]
        this.data.splice(index, 1, this.data[index + 1])
        this.data.splice(index + 1, 1, aux)
      }
    },
    itemDelete (index) {
      this.data.splice(index, 1)
      if (this.data.length === 0) this.lastPress = -1
    },
    itemClone (index) {
      // Debido a problemas de clonaciones, es necesario poner los textos manualmente
      if (this.data[index].component === 'Normal') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, component: 'Normal', componentName: 'Texto normal' })
      else if (this.data[index].component === 'Header1') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, component: 'Header1', componentName: 'Título' })
      else if (this.data[index].component === 'Header2') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, component: 'Header2', componentName: 'Título' })
      else if (this.data[index].component === 'Header3') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, component: 'Header3', componentName: 'Título' })

      else if (this.data[index].component === 'Picture') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, component: 'Picture', componentName: 'Multimedia' })
      else if (this.data[index].component === 'Video') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, component: 'Video', componentName: 'Multimedia' })

      else if (this.data[index].component === 'ChangeSection') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, next: this.data[index].next, component: 'ChangeSection', componentName: 'cambio de sección' })
      else if (this.data[index].component === 'RepeatSection') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, component: 'RepeatSection', componentName: 'repetición de sección' })
    },
    async updateBookSections (newSections) {
      await booksCollection.doc(this.book.ID).update({
        sections: newSections
      })
      this.book.sections = newSections
    },
    addNormal () {
      this.data.splice(this.lastPress + 1, 0, { htmlText: '', component: 'Normal', componentName: 'Texto normal' })
    },
    addTitle () {
      this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<h1></h1>', component: 'Header1', componentName: 'Título' })
    },
    addFile () {
      this.data.splice(this.lastPress + 1, 0, { htmlText: '', component: 'Multimedia', componentName: 'Multimedia' })
    },
    addSectionChange () {
      if (this.sectionsData.length > 1) {
        this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<span></span>', next: this.sectionsData[0].value, component: 'ChangeSection', componentName: 'cambio de sección' })
      } else window.alert('Para añadir un cambio de sección, debes tener más de una sección creada')
    },
    addSectionRepeat () {
      this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<span></span>', component: 'RepeatSection', componentName: 'repetición de sección' })
    },
    checkStyles () {
      // Normal
      if (this.data[this.lastPress].component === 'Normal') {
        // Negrita
        if (document.queryCommandState('Bold')) this.changeButtons('Bold', 1)
        else this.changeButtons('Bold', -1)
        // Cursiva
        if (document.queryCommandState('Italic')) this.changeButtons('Italic', 1)
        else this.changeButtons('Italic', -1)
        // Subrayado
        if (document.queryCommandState('Underline')) this.changeButtons('Underline', 1)
        else this.changeButtons('Underline', -1)
        // Tachado
        if (document.queryCommandState('StrikeThrough')) this.changeButtons('StrikeThrough', 1)
        else this.changeButtons('StrikeThrough', -1)
      }
      // Título 1
      if (this.data[this.lastPress].component === 'Header1') this.changeButtons('Header1', 1)
      else this.changeButtons('Header1', 0)
      // Título 2
      if (this.data[this.lastPress].component === 'Header2') this.changeButtons('Header2', 1)
      else this.changeButtons('Header2', 0)
      // Título 3
      if (this.data[this.lastPress].component === 'Header3') this.changeButtons('Header3', 1)
      else this.changeButtons('Header3', 0)
    },
    checkDelete (index) {
      this.data.splice(index, 1)
    },
    lastElementPressed (index) {
      this.lastPress = index
    },
    onLiveEditComponent (evt, component) {
      evt.preventDefault() // Prevenimos perder el foco del cursor SOLO para estos botones (save no está entre ellos para que funcione todo correctamente)
      if (this.lastPress === -1) this.lastPress = 0
      var a = this.data[this.lastPress].component
      if (a === 'Normal') {
        if (component === 'Bold') {
          if (this.boldActive <= 0) {
            this.boldActive = 1
            this.boldUse = true
          } else {
            this.boldActive = 0
            this.boldUse = false
          }
        }
        if (component === 'Italic') {
          if (this.italicActive <= 0) {
            this.italicActive = 1
            this.italicUse = true
          } else {
            this.italicActive = 0
            this.italicUse = false
          }
        }
        if (component === 'Underline') {
          if (this.underlineActive <= 0) {
            this.underlineActive = 1
            this.underlineUse = true
          } else {
            this.underlineActive = 0
            this.underlineUse = false
          }
        }
        if (component === 'StrikeThrough') {
          if (this.strikeThroughActive <= 0) {
            this.strikeThroughActive = 1
            this.strikeThroughUse = true
          } else {
            this.strikeThroughActive = 0
            this.strikeThroughUse = false
          }
        }
      } else if (a === 'Header1' || a === 'Header2' || a === 'Header3') {
        // Al pulsar sobre un cambio de título se pierde el foco del cursor debido a que cambiamos el renderizado, por modificar el tipo de componente
        if (component === 'Header1') {
          this.data[this.lastPress].component = 'Header1'
          this.header1Active = 1
          this.header2Active = 0
          this.header3Active = 0
        } else if (component === 'Header2') {
          this.data[this.lastPress].component = 'Header2'
          this.header1Active = 0
          this.header2Active = 1
          this.header3Active = 0
        } else if (component === 'Header3') {
          this.data[this.lastPress].component = 'Header3'
          this.header1Active = 0
          this.header2Active = 0
          this.header3Active = 1
        }
      }
    },
    changeButtons (btn, val) {
      if (btn === 'Bold') {
        if (val > 0 && this.boldActive !== val && this.boldUse === false) {
          this.boldActive = val
          this.boldUse = true
        } else if (val < 0 && this.boldActive !== val && this.boldUse === true) {
          this.boldUse = false
          this.boldActive = val
        }
      }
      if (btn === 'Italic') {
        if (val > 0 && this.italicActive !== val && this.italicUse === false) {
          this.italicActive = val
          this.italicUse = true
        } else if (val < 0 && this.italicActive !== val && this.italicUse === true) {
          this.italicUse = false
          this.italicActive = val
        }
      }
      if (btn === 'Underline') {
        if (val > 0 && this.underlineActive !== val && this.underlineUse === false) {
          this.underlineActive = val
          this.underlineUse = true
        } else if (val < 0 && this.underlineActive !== val && this.underlineUse === true) {
          this.underlineUse = false
          this.underlineActive = val
        }
      }
      if (btn === 'StrikeThrough') {
        if (val > 0 && this.strikeThroughActive !== val && this.strikeThroughUse === false) {
          this.strikeThroughActive = val
          this.strikeThroughUse = true
        } else if (val < 0 && this.strikeThroughActive !== val && this.strikeThroughUse === true) {
          this.strikeThroughUse = false
          this.strikeThroughActive = val
        }
      }
      if (btn === 'Header1') this.header1Active = val
      if (btn === 'Header2') this.header2Active = val
      if (btn === 'Header3') this.header3Active = val
    },
    changeFileType (value) {
      if (value === 'picture') {
        this.picture = true
        this.video = false
        this.openModalPicture = true
      } else if (value === 'video') {
        this.video = true
        this.picture = false
        this.openModalVideo = true
      }
      this.clickFileType()
    },
    clickFileType () {
      if (this.data[this.lastPress].componentName === 'Multimedia') {
        if (this.picture === true) {
          this.data[this.lastPress].component = 'Picture'
        } else if (this.video === true) {
          this.data[this.lastPress].component = 'Video'
        }
      }
    },
    cancelMultimedia () {
      this.video = false
      this.image = false
      this.openModalVideo = false
      this.openModalPicture = false
    },
    openManagementSectionModal () {
      this.showManagementSectionModal = !this.showManagementSectionModal
    },
    async save () {
      if (this.sectionName !== '') {
        sectionsCollection.doc(this.sectionID).update({
          gadgets: this.data
        })
      } else {
        window.alert('Para guardar una sección, debes darla un nombre primero')
      }
    },
    saveHTMLMultimedia (htmlText, index) {
      this.data[index].htmlText = htmlText
      this.image = false
      this.video = false
      this.openModalVideo = false
      this.openModalPicture = false
    },
    saveHTML (htmlText, index) {
      this.data[index].htmlText = htmlText
    },
    savePlaneAndHTML (plainText, htmlText, index) {
      this.data[index].plainText = plainText
      this.data[index].htmlText = htmlText
    },
    saveHTMLAndSection (htmlText, plainText, section, index) {
      this.data[index].htmlText = htmlText
      this.data[index].plainText = plainText
      this.data[index].next = section
    },
    goBack () {
      this.$router.replace({ name: 'readBook', params: { book: this.book } })
    },
    goBackAndSave () {
      this.save()
      this.goBack()
    }
  }
}
</script>

<style scoped>
/* Botones de la aplicación y no del editor de texto */
.buttons {
  text-align: justify;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
}
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.buttonBackAndSave {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-left: 5px;
}
.title {
  vertical-align: top;
  margin-left: 20px;
  display: inline-block;
}
/* Características principales de la vista */
.editBook {
  text-align: justify;
  margin-left: 30px;
  padding-bottom: 30px;
  background-color: rgb(226, 250, 227);
}
/* Barra lateral izquierda */
.sidebar {
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  width: 250px;
  height: 61%;
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(129, 129, 129);
  position: fixed;
}
.sidebarHeight {
  height: 90%;
  padding-top: 5px;
  overflow-y: auto;
}
.sidebarBlock {
  border: 1px solid rgb(129, 129, 129);
  margin-bottom: 5px;
  cursor: pointer;
}
.sidebarBlockSelected {
  border: 1px solid rgb(87, 87, 87);
  background-color: lightgray;
  margin-bottom: 5px;
  cursor: pointer;
}
.verticalLine {
  border-top: 1px solid gray;
  text-align: justify;
  margin-bottom: 0px;
}
.marginLeft {
  margin-left: 5px;
}
.marginLeftButton {
  margin-left: 5px;
  padding: 1px;
}
.marginLeftButton:hover {
  background-color: rgb(205, 207, 218);
}
.marginLeftButtonSelected {
  margin-left: 5px;
  padding: 1px;
}
.marginLeftButtonSelected:hover {
  background-color: rgb(184, 187, 197);
}
/* Componentes editables del editor */
.editable {
  outline: 0px solid transparent;
  cursor: text;
  margin-bottom: 15px;
}
/* Cinta de opciones del editor */
.normalPanel {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border-right: 1px solid darkgray;
  border-left: 1px solid darkgray;
}
.normalPanelOptions {
  margin-top: 5px;
  justify-content: center;
  display: flex;
}
.headerPanel {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border-right: 1px solid darkgray;
}
.headerPanelOptions {
  margin-top: 5px;
  justify-content: center;
  display: flex;
}
.multimediaPanel {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border-right: 1px solid darkgray;
}
.multimediaPanelOptions {
  margin-top: 5px;
  display: flex;
}
.sections {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border-right: 1px solid darkgray;
}
.addGadgetButton {
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(189, 189, 189);
  padding: 2px;
  margin-left: 25px;
}
.addGadgetButton:hover {
  background-color: rgb(213, 215, 228);
}
.options {
  margin-left: 280px;
  padding-top: 20px;
}
.buttonNormal {
  background-color: rgb(227, 229, 241);
  border-top: 1px solid rgb(189, 189, 189);
  border-bottom: 1px solid rgb(189, 189, 189);
  border-left: 1px solid rgb(189, 189, 189);
  padding: 2px;
}
.buttonNormal:hover {
  background-color: rgb(213, 215, 228);
}
.buttonPressed {
  background-color: rgb(183, 188, 209);
  border: 1px solid rgb(148, 148, 148);
  padding: 2px;
}
.buttonPressed:hover {
  background-color: rgb(194, 196, 206);
}
.buttonNormalRightBorder {
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(189, 189, 189);
  padding: 2px;
}
.buttonNormalRightBorder:hover {
  background-color: rgb(213, 215, 228);
}
.buttonPressedRightBorder {
  background-color: rgb(183, 188, 209);
  border: 1px solid rgb(148, 148, 148);
  padding: 2px;
}
.buttonPressedRightBorder:hover {
  background-color: rgb(194, 196, 206);
}
/* Documento de texto */
.document {
  width: 210mm;
  height: 297mm;
  padding: 20mm;
  margin-left: 280px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px rgb(168, 168, 168) solid;
  background: white;
  overflow-y: auto;
}
</style>
