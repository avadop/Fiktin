<template>
  <div>
    <LoadingModal v-if="loading"/>
    <div class="buttons">
      <div class="row d-flex justify-content-start">
        <h3 style="padding-top: 15px; text-align: left;">
          <b-button style="font-size: 16px;" variant="light" v-b-tooltip.hover title="Volver" @click="goBack()"><b-icon icon="chevron-left"></b-icon></b-button>
          {{ book.title }}
          <b-button style="font-size: 16px;" v-if="isBookOfLoggedUser() && isNotPreview()" variant="light" v-b-tooltip.hover title="Editar libro" @click="goEdit()" :disabled="book.published===true"><b-icon icon="pencil"/></b-button>
          <b-button style="font-size: 16px;" v-if="isBookOfLoggedUser() && isNotPreview()" variant="light" v-b-tooltip.hover title="Publicar" @click="togglePublic(), showInfoModal()"><b-icon v-if="book.published" icon="eye"/><b-icon v-else icon="eye-slash"/></b-button>
        </h3>
      </div>
      <span style="color: red; padding-left: 10px;" v-if="isBookOfLoggedUser() && book.published===true">No se puede editar un libro si este se encuentra publicado</span>
    </div>
    <b-form-select class="section" v-model="currentSectionID" :options="sectionsData" style="max-width: 500px;" @change="loadSection(currentSectionID)"></b-form-select>
    <div v-if="emptyBook() && sectionExists">
      <h4>Sección vacía</h4>
    </div>
    <div class="readBook" v-else-if="!emptyBook() && sectionExists">
      <div v-for="(text, index) in sectionGadgets" :key="index">
        <span v-if="basicGadget(text)" style="word-wrap: break-word;" v-html="text.htmlText"/>
        <ChangeSectionReading v-if="text.component === 'ChangeSection' && book.sections.length > 1"
          :htmlText="text.htmlText"
          :next="text.next"
          @change="loadSection"/>
        <RepeatSectionReading v-if="text.component === 'RepeatSection'"
          :htmlText="text.htmlText"
          :actual="currentSectionID"
          @change="loadSection"/>
        <DecisionMakingReading v-if="text.component === 'DecisionMaking' && book.sections.length > 1"
          :choices="text.choices"
          @chose="loadSection"/>
        <RiddleReading v-if="text.component === 'Riddle' && book.sections.length > 1"
          :numberOfTriesAux="text.numberOfTries"
          :riddleText="text.riddleText"
          :answerText="text.answerText"
          :wrongSection="text.wrongSection"
          :rightSection="text.rightSection"
          @answered="loadSection"/>
        <RandomNumberReading v-if="text.component === 'RandomNumber'"
          :lowerLimit="text.lowerLimit"
          :upperLimit="text.upperLimit"
          :conditions="text.conditions"
          @change="loadSection"/>
        <SequenceReading v-if="text.component === 'Sequence'"
          :numberOfTriesAux="text.numberOfTries"
          :sequence="text.sequence"
          :solution="text.solution"
          :rightSection="text.rightSection"
          :wrongSection="text.wrongSection"
          :changeSectionWhenWrong="text.changeSectionWhenWrong"
          @answered="loadSection"/>
        <ExpandableTextReading v-if="text.component === 'ExpandableText'"
          :mainText="text.mainText"
          :expandedText="text.expandedText"/>
        <PopupTextReading v-if="text.component === 'PopupText'"
          :mainText="text.mainText"
          :popupText="text.popupText"
          :htmlText="text.htmlText"/>
        <MemoryCardsReading v-if="text.component === 'MemoryCards'"
          :numberOfPairs="text.numberOfPairs"
          :maxNumberOfMoves="text.maxNumberOfMoves"
          :sectionNoMoreMoves="text.sectionNoMoreMoves"
          :sectionSolved="text.sectionSolved"
          :changeSectionWhenWrong="text.changeSectionWhenWrong"
          :customized="text.customized"
          :typeChosen="text.typeChosen"
          :customWords="text.customWords"
          :customColors="text.customColors"
          @answered="loadSection"/>
        <SpoilerReading v-if="text.component === 'Spoiler'"
          :htmlTextAux="text.htmlText"/>
        <CompleteCluesReading v-if="text.component === 'CompleteClues'"
          :clues="text.clues"
          :answers="text.answers"
          :changeSectionWhenWrong="text.changeSectionWhenWrong"
          :onGuess="text.onGuess"
          :onWrong="text.onWrong"
          @answered="loadSection"/>
        <CustomBoxesReading style="min-height: 24px;" v-if="text.component === 'CustomBox' && text.name != ''"
          :name="text.name"
          :mode="text.mode"
          :type="text.type"
          :value="text.value"
          :defaultValue="text.defaultValue"
          :title="text.title"
          :prevText="text.prevText"
          :nextText="text.nextText"
          :customBoxes="customBoxes"
          @saveWrite="saveCustomBox"/>
      </div>
    </div>
    <div v-else>
      <h1>Vaya, parece que la sección a la que intentas acceder no existe :-(</h1>
    </div>

    <b-modal v-model="showInfoPublic" hide-header hide-footer centered no-close-on-backdrop>
      <p>Al publicar el libro este se vuelve visible para todo el mundo. Esta opción se puede cambiar cuando se quiera.</p>
      <div class="d-flex justify-content-center">
        <b-button style="font-size: 16px; width: 150px;" size="sm" variant="success" @click="showInfoPublic = false">Aceptar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { librariesCollection, sectionsCollection, booksCollection } from '@/firebase.js'
import { store } from '@/store/index.js'
import LoadingModal from '@/components/modals/LoadingModal.vue'
import ChangeSectionReading from '@/components/readingGadgets/ChangeSectionReading.vue'
import RepeatSectionReading from '@/components/readingGadgets/RepeatSectionReading.vue'
import DecisionMakingReading from '@/components/readingGadgets/DecisionMakingReading.vue'
import RiddleReading from '@/components/readingGadgets/RiddleReading.vue'
import RandomNumberReading from '@/components/readingGadgets/RandomNumberReading.vue'
import ExpandableTextReading from '@/components/readingGadgets/ExpandableTextReading.vue'
import PopupTextReading from '@/components/readingGadgets/PopupTextReading.vue'
import SequenceReading from '@/components/readingGadgets/SequenceReading.vue'
import MemoryCardsReading from '@/components/readingGadgets/MemoryCardsReading.vue'
import SpoilerReading from '@/components/readingGadgets/SpoilerReading.vue'
import CompleteCluesReading from '@/components/readingGadgets/CompleteCluesReading.vue'
import CustomBoxesReading from '@/components/readingGadgets/CustomBoxesReading.vue'

export default {
  name: 'readBook',
  components: {
    LoadingModal,
    ChangeSectionReading,
    RepeatSectionReading,
    DecisionMakingReading,
    RiddleReading,
    RandomNumberReading,
    ExpandableTextReading,
    PopupTextReading,
    SequenceReading,
    MemoryCardsReading,
    SpoilerReading,
    CompleteCluesReading,
    CustomBoxesReading
  },
  data () {
    return {
      loading: false,
      sectionExists: true,
      searchNick: store.state.userNick.concat('_historial').toLowerCase(),
      currentSectionID: '',
      sectionGadgets: [],
      sectionsData: [],
      sectionName: '',
      book: store.state.openedBook,
      bookID: store.state.openBookID,
      customBoxes: [],
      showInfoPublic: false
    }
  },
  mounted () {
    if (this.bookID !== undefined) this.addBookToLibrary()
    this.loadSection(store.state.sectionID)
    this.loadBook()
  },
  methods: {
    async loadBook () {
      this.loading = true
      this.sectionsData = []
      this.customBoxes = []
      await booksCollection.doc(this.bookID).get().then(doc => {
        this.customBoxes = doc.data().customBoxes
        this.book.sections = doc.data().sections
      })
      for (var i = 0; i < this.book.sections.length; ++i) {
        await sectionsCollection.doc(this.book.sections[i]).get().then(doc => {
          if (doc.exists) {
            this.sectionExists = true
            this.sectionsData.push({ value: doc.id, text: doc.data().name })
          } else {
            this.sectionExists = false
          }
        })
      }
      this.loading = false
    },
    async loadSection (sectionID) {
      if (sectionID !== '') {
        this.loading = true
        this.currentSectionID = sectionID
        this.sectionGadgets = []
        this.sectionName = ''
        await sectionsCollection.doc(sectionID).get().then(doc => {
          if (doc.exists) {
            this.sectionExists = true
            this.sectionGadgets = doc.data().gadgets
            this.sectionName = doc.data().name
            store.commit('changeSection', sectionID)
          } else {
            this.sectionExists = false
          }
        })
        this.loading = false
      }
    },
    addBookToLibrary: async function () {
      var a
      if (this.bookID !== '') {
        await librariesCollection.doc(this.searchNick).get().then(doc => {
          if (doc.exists) {
            a = doc.data().array_keys
          }
        })
        a.unshift(this.bookID)
        if (a.length > 20) a.splice(20, a.length - 20)
        await librariesCollection.doc(this.searchNick).update({
          array_keys: a
        })
      }
    },
    // Los que su html se pueda poner directamente se añaden aqui
    basicGadget (value) {
      return value.componentName === 'Título' || value.componentName === 'Texto normal' || value.component === 'Picture' || value.component === 'Hyperlink' || value.component === 'Video'
    },
    saveCustomBox (value, index) {
      var aux = this.customBoxes[index]
      aux.value = value
      this.$set(this.customBoxes, index, aux)
    },
    isBookOfLoggedUser () {
      return this.book.userID === store.state.userID
    },
    goEdit () {
      this.$router.replace({ name: 'editBook' })
    },
    async togglePublic () {
      this.book.published = !this.book.published
      await booksCollection.doc(this.bookID).update({
        published: this.book.published
      })
    },
    goBack () {
      if (store.state.sectionPreview === false) store.commit('closeBook')
      else store.commit('switchSectionPreview', false)
      this.$router.go(-1)
    },
    isNotPreview () {
      return store.state.sectionPreview === false
    },
    emptyBook () {
      if (this.sectionGadgets.length === 0) {
        return true
      }
      var emptyGadgts = ['Normal', 'Header1', 'Header2', 'Header3', 'Picture', 'Video', 'ChangeSection', 'DecisionMaking', 'Riddle']
      for (let gadget of this.sectionGadgets) {
        if (emptyGadgts.includes(gadget.component)) {
          if ((gadget.component === 'Header1' || gadget.component === 'Header2' || gadget.component === 'Header3') && gadget.plainText !== '') {
            return false
          } else if ((gadget.component === 'Normal' || gadget.component === 'Picture' || gadget.component === 'Video') && gadget.htmlText !== '') {
            return false
          } else if (gadget.component === 'CustomBox' && gadget.name !== '') {
            return false
          } else if ((gadget.component === 'ChangeSection' || gadget.component === 'DecisionMaking' || gadget.component === 'Riddle') && this.book.sections.length > 1) {
            return false
          }
        } else {
          return false
        }
      }
      return true
    },
    showInfoModal () {
      if (this.book.published === true) this.showInfoPublic = true
    }
  }
}
</script>

<style scoped>
.row {
  margin-right: 0px!important;
  margin-left: 0px!important;
}
.buttons {
  text-align: justify;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
}
.readBook {
  text-align: left;
  margin-top: 70px;
  margin: auto;
  margin-bottom: 50px;
  width: 210mm;
  /*width: 60%;*/
  border: 1px solid;
  padding: 20px;
}
.section {
  /*text-align: left;*/
  /*margin-top: 70px;*/
  margin: auto;
  margin-bottom: 10px;/*
  width: 210mm;
  padding: 20px;*/
}
</style>
