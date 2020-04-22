<template>
  <div>
    <LoadingModal v-if="loading"/>
    <div class="buttons">
      <div class="row d-flex justify-content-end">
        <b-button v-b-tooltip.hover title="Salir sin guardar" variant="light" @click="goBack()"><b-icon icon="chevron-left"></b-icon></b-button>
        <div class="col">
          <h3 class="mr-auto">{{ book.title }}</h3>
        </div>
        <div class="col">
          <b-form-select v-model="nextSectionID" :options="sectionsData" @change="save(), refresh(nextSectionID)"></b-form-select>
        </div>
        <div class="col">
          <b-button variant="outline-secondary" size="sm" @click="openManagementSectionModal()"><b-icon icon="gear"/></b-button>
        </div>
        <SectionManagementModal v-if="showManagementSectionModal" :name="sectionName" :id="sectionID" :book_title="book.title" :book_author_ID="book.userID" :sectionsList="book.sections" @update="updateBookSections" @load="refresh" @saveActual="save" @cancel="openManagementSectionModal"/>
        <b-button variant="outline-dark" v-b-tooltip.hover title="Descargar"><b-icon icon="cloud-download" @mouseup="save()"></b-icon></b-button>
        <b-button variant="outline-dark" v-b-tooltip.hover title="Guardar" @click="save()"><b-icon icon="cloud-upload"></b-icon></b-button>
        <b-button variant="dark" @click="goBackAndSave()">Guardar y salir</b-button>
      </div>
    </div>
    <div class="row flex-xl-nowrap2">
      <div class="bd-sidebar border-bottom-0 col-md-3 col-xl-2 col-12">
        <h4>Gadgets</h4>
        <hr>
        <div>
          <span style="color: red;" v-if="data.length==0">No hay gadgets creados. Para editar el documento, agrega uno primero</span>
          <div v-for="(text, index) in data" :key="index">
            <div class="sidebarBlock" v-if="lastPress!==index" @click="lastElementPressed(index)">
              <span>{{ text.componentName }}</span>
              <div class="h5 lg, verticalLine">
                <b-icon icon="chevron-up" class="marginLeftButton" @click.stop @mouseup="itemUp(index)">Subir gadget</b-icon>
                <b-icon icon="chevron-down" class="marginLeftButton" @click.stop @mouseup="itemDown(index)">Bajar gadget</b-icon>
                <b-icon icon="layers" class="marginLeftButton" @click.stop @mouseup="itemClone(index)">Duplicar gadget</b-icon>
                <b-icon icon="trash-fill" class="marginLeftButton" @click.stop @mouseup="itemDelete(index)">Eliminar gaget</b-icon>
              </div>
            </div>
            <div class="sidebarBlockSelected" v-else @click="lastElementPressed(index)">
              <span>{{ text.componentName }}</span>
              <div class="h5 lg, verticalLine">
                <b-icon icon="chevron-up" class="marginLeftButtonSelected" @click.stop @mouseup="itemUp(index)">Subir gadget</b-icon>
                <b-icon icon="chevron-down" class="marginLeftButtonSelected" @click.stop @mouseup="itemDown(index)">Bajar gadget</b-icon>
                <b-icon icon="layers" class="marginLeftButtonSelected" @click.stop @mouseup="itemClone(index)">Duplicar gadget</b-icon>
                <b-icon icon="trash-fill" class="marginLeftButtonSelected" @click.stop @mouseup="itemDelete(index)">Eliminar gadget</b-icon>
              </div>
            </div>
          </div>
          <hr>
        </div>
      </div>
      <div class="bd-content col-md-9 col-xl-8 col-12 pl-md-5">
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

            <ExpandableText v-if="text.component=='ExpandableText'"
              :index="index"
              :mainTextAux="text.mainText"
              :expandedTextAux="text.expandedText"
              :lastPressed="lastPress"
              @html="saveExpandableText"/>
            <PopupText v-if="text.component=='PopupText'"
              :index="index"
              :mainTextAux="text.mainText"
              :popupTextAux="text.popupText"
              :lastPressed="lastPress"
              @html="savePopupText"/>
            <Hyperlink v-if="text.component=='Hyperlink'"
              :index="index"
              :mainTextAux="text.mainText"
              :hyperlinkTextAux="text.hyperlinkText"
              :lastPressed="lastPress"
              @html="saveHyperlink"/>

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
              @section="saveHTMLAndSection"
              @save="save"/>
            <RepeatSection v-if="text.component=='RepeatSection'"
              :actualSection="sectionID"
              :sectionName="sectionName"
              :textAux="text.plainText"
              :index="index"
              @html="savePlaneAndHTML"/>
            <DecisionMaking v-if="text.component=='DecisionMaking'"
              :actualSection="sectionID"
              :auxSectionsData="sectionsData"
              :auxDecisions="text.choices"
              :auxNumberOfOptions="text.numberOfOptions"
              :index="index"
              @section="saveChoices"/>

            <Riddle v-if="text.component=='Riddle'"
              :actualSection="sectionID"
              :auxSectionsData="sectionsData"
              :wrongSectionAux="text.wrongSection"
              :rightSectionAux="text.rightSection"
              :riddleTextAux="text.riddleText"
              :answerTextAux="text.answerText"
              :numberOfTriesAux="text.numberOfTries"
              :changeSectionWhenWrongAux="text.changeSectionWhenWrong"
              :index="index"
              @section="saveHTMLRiddle"/>
            <Sequence v-if="text.component=='Sequence'"
              :actualSection="sectionID"
              :auxSectionsData="sectionsData"
              :auxSequence="text.sequence"
              :auxSolution="text.solution"
              :auxChangeSectionWhenWrong="text.changeSectionWhenWrong"
              :auxWrongSection="text.wrongSection"
              :auxRightSection="text.rightSection"
              :auxNumberOfTries="text.numberOfTries"
              :index="index"
              @section="saveSequence"/>
            <RandomNumber v-if="text.component=='RandomNumber'"
              :actualSection="sectionID"
              :auxSectionsData="sectionsData"
              :auxConditions="text.conditions"
              :auxNumberOfConditions="text.numberOfConditions"
              :auxLowerLimit="text.lowerLimit"
              :auxUpperLimit="text.upperLimit"
              :index="index"
              @random="saveRandomNumbers"/>
            <MemoryCards v-if="text.component === 'MemoryCards'"
              :actualSection="sectionID"
              :sectionsDataAux="sectionsData"
              :numberOfPairsAux="text.numberOfPairs"
              :maxNumberOfMovesAux="text.maxNumberOfMoves"
              :sectionNoMoreMovesAux="text.sectionNoMoreMoves"
              :sectionSolvedAux="text.sectionSolved"
              :changeSectionWhenWrongAux="text.changeSectionWhenWrong"
              :index="index"
              @save="saveMemoryCards"/>
          </div>
        </div>
      </div>
      <div class="bd-toc col-xl-2 d-none d-xl-block">
        <h4>Añadir gadgets</h4>
        <hr>
        <span class="clickable" @click="addNormal()"><b-icon icon="fonts"/> Texto normal </span>
        <h5>
          <b-icon icon="type-bold" class="buttonNormal" v-if="boldActive!=1" @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
          <b-icon icon="type-bold" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
          <b-icon icon="type-italic" class="buttonNormal" v-if="italicActive!=1" @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
          <b-icon icon="type-italic" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
          <b-icon icon="type-underline" class="buttonNormal" v-if="underlineActive!=1" @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
          <b-icon icon="type-underline" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
          <b-icon icon="type-strikethrough" class="buttonNormalRightBorder" v-if="strikeThroughActive!=1" @mousedown="onLiveEditComponent($event, 'StrikeThrough')">strikeThrough</b-icon>
          <b-icon icon="type-strikethrough" class="buttonPressedRightBorder" v-else @mousedown="onLiveEditComponent($event, 'StrikeThrough')">strikeThrough</b-icon>
        </h5>
        <hr>

        <span class="clickable" @click="addTitle()"><b-icon icon="plus"/> Título </span>
        <h5>
          <b-icon icon="type-h1" class="buttonNormal" v-if="header1Active!=1" @mousedown="onLiveEditComponent($event, 'Header1')">Añadir título 1</b-icon>
          <b-icon icon="type-h1" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Header1')">Añadir título 1</b-icon>
          <b-icon icon="type-h2" class="buttonNormal" v-if="header2Active!=1" @mousedown="onLiveEditComponent($event, 'Header2')">Añadir título 2</b-icon>
          <b-icon icon="type-h2" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Header2')">Añadir título 2</b-icon>
          <b-icon icon="type-h3" class="buttonNormalRightBorder" v-if="header3Active!=1" @mousedown="onLiveEditComponent($event, 'Header3')">Añadir título 3</b-icon>
          <b-icon icon="type-h3" class="buttonPressedRightBorder" v-else @mousedown="onLiveEditComponent($event, 'Header3')">Añadir título 3</b-icon>
        </h5>
        <hr>

        <span class="clickable" @click="addFile()"><b-icon icon="plus"/> Multimedia </span>
        <h5>
          <b-icon icon="image-fill" class="buttonNormal" @click="changeFileType('picture')">Añadir</b-icon>
          <b-icon icon="camera-video-fill" class="buttonNormal" @click="changeFileType('video')">Añadir</b-icon>
        </h5>
        <hr>

        <span class="clickable" @click="addExandableText()"><b-icon icon="plus"/> Texto expandible</span>
        <div/>
        <span class="clickable" @click="addPopupText()"><b-icon icon="plus"/> Texto emergente</span>
        <div/>
        <span class="clickable" @click="addHyperlink()"><b-icon icon="link"/> Hipervínculo</span>
        <hr>

        <span class="clickable" @click="addSectionChange()"><b-icon icon="box-arrow-right"/> Siguiente sección</span>
        <div/>
        <span class="clickable" @click="addSectionRepeat()"><b-icon icon="arrow-repeat"/> Repetir sección</span>
        <div/>
        <span class="clickable" @click="addDecisionMaking()"><b-icon icon="list-task"/> Decisiones</span>
        <hr>

        <span class="clickable" @click="addRiddle()"><b-icon icon="question"/> Adivinanzas</span>
        <div/>
        <span class="clickable" @click="addSequence()"><b-icon icon="three-dots"/> Secuencia</span>
        <div/>
        <span class="clickable" @click="addMemoryCards()"><b-icon icon="grid-fill"/> Tarjetas de memoria</span>
        <hr>

        <span class="clickable" @click="addRandomNumber()"><b-icon icon="hash"/> Número aleatorio</span>
        <hr>
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

import ExpandableText from '@/components/gadgets/ExpandableText.vue'
import PopupText from '@/components/gadgets/PopupText.vue'
import Hyperlink from '@/components/gadgets/Hyperlink.vue'

import PictureGadget from '@/components/gadgets/PictureGadget.vue'
import VideoGadget from '@/components/gadgets/VideoGadget.vue'

import ChangeSection from '@/components/gadgets/ChangeSection.vue'
import RepeatSection from '@/components/gadgets/RepeatSection.vue'
import DecisionMaking from '@/components/gadgets/DecisionMaking.vue'
import Riddle from '@/components/gadgets/Riddle.vue'
import Sequence from '@/components/gadgets/Sequence.vue'
import RandomNumber from '@/components/gadgets/RandomNumber.vue'
import MemoryCards from '@/components/gadgets/MemoryCards.vue'

export default {
  name: 'editBook',
  components: {
    SectionManagementModal,
    LoadingModal,
    Normal,
    Header1,
    Header2,
    Header3,

    ExpandableText,
    PopupText,
    Hyperlink,

    PictureGadget,
    VideoGadget,

    ChangeSection,
    RepeatSection,
    DecisionMaking,
    Riddle,
    Sequence,
    RandomNumber,
    MemoryCards

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
          if (doc.exists) {
            this.sectionsData.push({ value: doc.id, text: doc.data().name })
          }
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

      else if (this.data[index].component === 'ExpandableText') this.data.splice(index + 1, 0, { mainText: this.data[index].mainText, expandedText: this.data[index].expandedText, component: 'ExpandableText', componentName: 'Texto expandible' })
      else if (this.data[index].component === 'PopupText') this.data.splice(index + 1, 0, { mainText: this.data[index].mainText, popupText: this.data[index].popupText, component: 'PopupText', componentName: 'Texto emergente' })
      else if (this.data[index].component === 'Hyperlink') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, mainText: this.data[index].mainText, hyperlinkText: this.data[index].hyperlinkText, component: 'Hyperlink', componentName: 'Hipervínculo' })

      else if (this.data[index].component === 'Picture') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, component: 'Picture', componentName: 'Multimedia' })
      else if (this.data[index].component === 'Video') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, component: 'Video', componentName: 'Multimedia' })

      else if (this.data[index].component === 'ChangeSection') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, next: this.data[index].next, component: 'ChangeSection', componentName: 'Cambio de sección' })
      else if (this.data[index].component === 'RepeatSection') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, component: 'RepeatSection', componentName: 'Repetición de sección' })
      else if (this.data[index].component === 'DecisionMaking') {
        var a = []
        for (var i = 0; i < this.data[index].choices.length; ++i) {
          // Es necesario hacer un clonado completo para evitar que se copie la dirección en memoria del array
          // Esto provoca que cada gagdet sea independiente. Sin esto, al modificar la copia, se modificarían tanto el resto de copias como el original
          a.push({ plainText: this.data[index].choices[i].plainText, htmlText: this.data[index].choices[i].htmlText, choice: this.data[index].choices[i].choice, action: this.data[index].choices[i].action })
        }
        this.data.splice(index + 1, 0, { choices: a, numberOfOptions: this.data[index].numberOfOptions, component: 'DecisionMaking', componentName: 'Toma de decisiones' })
      } else if (this.data[index].component === 'Riddle') {
        this.data.splice(index + 1, 0, { changeSectionWhenWrong: this.data[index].changeSectionWhenWrong,
          riddleText: this.data[index].riddleText,
          answerText: this.data[index].answerText,
          rightSection: this.data[index].rightSection,
          wrongSection: this.data[index].wrongSection,
          numberOfTries: this.data[index].numberOfTries,
          component: 'Riddle',
          componentName: 'Adivinanza' })
      } else if (this.data[index].component === 'RandomNumber') {
        var b = []
        for (var j = 0; j < this.data[index].conditions.length; ++j) {
          b.push({ condition: this.data[index].conditions[j].condition, number: this.data[index].conditions[j].number, section: this.data[index].conditions[j].section })
        }
        this.data.splice(index + 1, 0, { lowerLimit: this.data[index].lowerLimit, upperLimit: this.data[index].upperLimit, numberOfConditions: this.data[index].numberOfConditions, conditions: b, component: 'RandomNumber', componentName: 'Número aleatorio' })
      } else if (this.data[index].component === 'Sequence') {
        var c = [] // Secuencia
        var d = [] // Soluciones
        var k
        for (k = 0; k < this.data[index].sequence.length; ++k) {
          c.push({ text: this.data[index].sequence[k].text })
        }
        for (k = 0; k < this.data[index].solution.length; ++k) {
          d.push({ text: this.data[index].solution[k].text })
        }
        this.data.splice(index + 1, 0, { numberOfTries: this.data[index].numberOfTries, sequence: c, solution: d, changeSectionWhenWrong: this.data[index].changeSectionWhenWrong, wrongSection: this.data[index].wrongSection, rightSection: this.data[index].rightSection, component: 'Sequence', componentName: 'Secuencia' })
      } else if (this.data[index].component === 'MemoryCards') {
        this.data.splice(this.lastPress + 1, 0, { numberOfPairs: this.data[index].numberOfPairs,
          maxNumberOfMoves: this.data[index].maxNumberOfMoves,
          sectionNoMoreMoves: this.data[index].sectionNoMoreMoves,
          sectionSolved: this.data[index].sectionSolved,
          changeSectionWhenWrong: this.data[index].changeSectionWhenWrong,
          component: 'MemoryCards',
          componentName: 'Tarjetas de memoria' })
      }
    },
    async updateBookSections (newSections) {
      this.book.sections = newSections
      await booksCollection.doc(this.book.ID).update({
        sections: newSections
      })
    },
    addNormal () {
      this.data.splice(this.lastPress + 1, 0, { htmlText: '', component: 'Normal', componentName: 'Texto normal' })
    },
    addTitle () {
      this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<h1></h1>', component: 'Header1', componentName: 'Título' })
    },
    addExandableText () {
      this.data.splice(this.lastPress + 1, 0, { mainText: '', expandedText: '', component: 'ExpandableText', componentName: 'Texto expandible' })
    },
    addPopupText () {
      this.data.splice(this.lastPress + 1, 0, { mainText: '', popupText: '', component: 'PopupText', componentName: 'Texto emergente' })
    },
    addHyperlink () {
      this.data.splice(this.lastPress + 1, 0, { mainText: '', htmlText: '', hyperlinkText: '', component: 'Hyperlink', componentName: 'Hipervínculo' })
    },
    addFile () {
      this.data.splice(this.lastPress + 1, 0, { htmlText: '', component: 'Multimedia', componentName: 'Multimedia' })
    },
    addSectionChange () {
      if (this.sectionsData.length > 1) {
        this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<span></span>', next: this.sectionsData[0].value, component: 'ChangeSection', componentName: 'Cambio de sección' })
      } else window.alert('Para añadir un cambio de sección debes tener más de una sección creada')
    },
    addSectionRepeat () {
      this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<span></span>', component: 'RepeatSection', componentName: 'Repetición de sección' })
    },
    addDecisionMaking () {
      if (this.sectionsData.length > 1) {
        this.data.splice(this.lastPress + 1, 0, {
          choices: [{ plainText: '', htmlText: '<span></span>', choice: 'Section', action: this.sectionsData[0].value }, { plainText: '', htmlText: '<span></span>', choice: 'Section', action: this.sectionsData[0].value }],
          numberOfOptions: 2,
          component: 'DecisionMaking',
          componentName: 'Toma de decisiones'
        })
      } else window.alert('Para añadir una toma de decisiones debes tener más de una sección creada')
    },
    addRiddle () {
      if (this.sectionsData.length > 1) {
        this.data.splice(this.lastPress + 1, 0, { changeSectionWhenWrong: false,
          riddleText: '',
          answerText: '',
          rightSection: this.sectionsData[0].value,
          wrongSection: '',
          numberOfTries: '1',
          component: 'Riddle',
          componentName: 'Adivinanza' })
      } else window.alert('Para añadir una adivinanza debes tener más de una sección creada')
    },
    addSequence () {
      if (this.sectionsData.length > 1) {
        this.data.splice(this.lastPress + 1, 0, { numberOfTries: 1, sequence: [{ text: '' }], solution: [{ text: '' }], changeSectionWhenWrong: false, wrongSection: '', rightSection: this.sectionsData[0].value, component: 'Sequence', componentName: 'Secuencia' })
      } else window.alert('Para añadir una secuencia debes tener más de una sección creada')
    },
    addRandomNumber () {
      this.data.splice(this.lastPress + 1, 0, { lowerLimit: 0, upperLimit: 10, conditions: [], numberOfConditions: 0, component: 'RandomNumber', componentName: 'Número aleatorio' })
    },
    addMemoryCards () {
      this.data.splice(this.lastPress + 1, 0, { numberOfPairs: 2, maxNumberOfMoves: 6, sectionNoMoreMoves: '', sectionSolved: '', changeSectionWhenWrong: false, component: 'MemoryCards', componentName: 'Tarjetas de memoria' })
    },
    checkStyles () {
      // En caso de acceder sin ningún componente (medida de seguridad. La ejecución no debería entrar aquí)
      if (this.lastPress === -1) this.lastPress = 0
      else if (this.data[this.lastPress].component === undefined) return
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
      // Multimedia
      if (this.data[this.lastPress].componentName === 'Multimedia') {
        if (this.picture === true) {
          this.data[this.lastPress].component = 'Picture'
        } else if (this.video === true) {
          this.data[this.lastPress].component = 'Video'
        }
      }
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
      this.checkStyles()
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
        await sectionsCollection.doc(this.sectionID).update({
          gadgets: this.data
        })
      } else {
        window.alert('Para guardar una sección, debes darla un nombre primero')
      }
    },
    saveExpandableText (mainText, expandedText, index) {
      this.data[index].mainText = mainText
      this.data[index].expandedText = expandedText
    },
    savePopupText (mainText, popupText, index) {
      this.data[index].mainText = mainText
      this.data[index].popupText = popupText
    },
    saveHyperlink (htmlText, mainText, hyperlinkText, index) {
      this.data[index].htmlText = htmlText
      this.data[index].mainText = mainText
      this.data[index].hyperlinkText = hyperlinkText
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
    saveChoices (decisions, numberOfOptions, index) {
      this.data[index].choices = decisions
      this.data[index].numberOfOptions = numberOfOptions
    },
    saveHTMLRiddle (changeSectionWhenWrong, riddleText, answerText, rightSection, wrongSection, numberOfTries, index) {
      this.data[index].riddleText = riddleText
      this.data[index].answerText = answerText
      this.data[index].changeSectionWhenWrong = changeSectionWhenWrong
      this.data[index].rightSection = rightSection
      this.data[index].wrongSection = wrongSection
      this.data[index].numberOfTries = numberOfTries
    },
    saveSequence (sequence, solution, changeSectionWhenWrong, wrongSection, rightSection, numberOfTries, index) {
      this.data[index].sequence = sequence
      this.data[index].solution = solution
      this.data[index].changeSectionWhenWrong = changeSectionWhenWrong
      this.data[index].wrongSection = wrongSection
      this.data[index].rightSection = rightSection
      this.data[index].numberOfTries = numberOfTries
    },
    saveRandomNumbers (conditions, numberOfConditions, lowerLimit, upperLimit, index) {
      this.data[index].conditions = conditions
      this.data[index].numberOfConditions = numberOfConditions
      this.data[index].lowerLimit = lowerLimit
      this.data[index].upperLimit = upperLimit
    },
    saveMemoryCards (numberOfPairs, maxNumberOfMoves, sectionNoMoreMoves, sectionSolved, changeSectionWhenWrong, index) {
      this.data[index].numberOfPairs = numberOfPairs
      this.data[index].maxNumberOfMoves = maxNumberOfMoves
      this.data[index].sectionNoMoreMoves = sectionNoMoreMoves
      this.data[index].sectionSolved = sectionSolved
      this.data[index].changeSectionWhenWrong = changeSectionWhenWrong
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
.row {
  margin-right: 0px!important;
  margin-left: 0px!important;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
/* Botones de la aplicación y no del editor de texto */
.buttons {
  text-align: justify;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
}
/* Barra lateral izquierda */
.sidebarBlock {
  text-align: justify;
  padding-left: 5px;
  border: 1px solid rgb(129, 129, 129);
  margin-bottom: 5px;
  cursor: pointer;
}
.sidebarBlockSelected {
  text-align: justify;
  padding-left: 5px;
  border: 1px solid rgb(87, 87, 87);
  box-shadow: 1px 1px 2px #000000;
  background-color: #eee;
  margin-bottom: 5px;
  cursor: pointer;
}
.verticalLine {
  border-top: 1px solid gray;
  text-align: justify;
  margin-bottom: 0px;
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
  border: 1px rgb(168, 168, 168) solid;
  background: white;
  overflow-y: auto;
  text-align: left;
  height: calc(100vh - 4rem);
}
/* Right sidebar*/
.bd-toc {
  border-left: 1px solid rgba(0,0,0,.1);
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem);
  overflow-y: auto;
  order: 2;
  padding-bottom: 1.5rem;
  font-size: .875rem;
  text-align: left;
}
.d-xl-block {
  display: block !important;
}
.col-xl-2 {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
* {
  box-sizing: border-box;
}
/* left sidebar*/
.bd-sidebar {
  border-right: 1px solid rgba(0,0,0,.1);
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem);
  overflow-y: auto;
  order: 0;
  padding-bottom: 1.5rem;
}
.border-bottom-0 {
  border-bottom: 0 !important;
}
.col-xl-2 {
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
}
</style>
