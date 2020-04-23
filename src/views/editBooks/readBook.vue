<template>
  <div>
    <LoadingModal v-if="loading"/>
    <div class="buttons">
      <div class="row d-flex justify-content-between">
        <b-button variant="light" @click="goBack()"><b-icon icon="chevron-left"></b-icon></b-button>
        <div class="col" style="max-width: 300px;">
          <h3 style="padding-top: 15px;">
            {{ book.title }}
            <b-button v-if="isBookOfLoggedUser()" variant="light" @click="goEdit()" :disabled="book.published===true"><b-icon icon="pencil"/></b-button>
          </h3>
        </div>
        <div class="col" style="padding-top: 20px;">
          <b-form-select v-model="currentSectionID" :options="sectionsData" style="max-width: 500px;" @change="loadSection(currentSectionID)"></b-form-select>
        </div>
      </div>
      <span style="color: red; padding-left: 10px;" v-if="isBookOfLoggedUser() && book.published===true">No se puede editar un libro si este se encuentra publicado</span>
    </div>
    <div class="readBook" v-if="sectionExists">
      <div v-for="(text, index) in sectionGadgets" :key="index">
        <span v-if="basicGadget(text)" v-html="text.htmlText"/>
        <ChangeSectionReading v-if="text.component === 'ChangeSection'"
          :htmlText="text.htmlText"
          :next="text.next"
          @change="loadSection"/>
        <RepeatSectionReading v-if="text.component === 'RepeatSection'"
          :htmlText="text.htmlText"
          :actual="currentSectionID"
          @change="loadSection"/>
        <DecisionMakingReading v-if="text.component === 'DecisionMaking'"
          :choices="text.choices"
          @chose="loadSection"/>
        <RiddleReading v-if="text.component === 'Riddle'"
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
          :popupText="text.popupText"/>
        <MemoryCardsReading v-if="text.component === 'MemoryCards'"
          :numberOfPairs="text.numberOfPairs"
          :maxNumberOfMoves="text.maxNumberOfMoves"
          :sectionNoMoreMoves="text.sectionNoMoreMoves"
          :sectionSolved="text.sectionSolved"
          :changeSectionWhenWrong="text.changeSectionWhenWrong"
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
      </div>
    </div>
    <div v-else>
      <h1>Vaya, parece que la sección a la que intentas acceder no existe :-(</h1>
    </div>
  </div>
</template>

<script>
import { librariesCollection, sectionsCollection } from '@/firebase.js'
import { store } from '../../store/index.js'
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
    CompleteCluesReading
  },
  props: {
    book: Object,
    bookID: String
  },
  data () {
    return {
      loading: false,
      sectionExists: true,
      searchNick: store.state.userNick.concat('_historial').toLowerCase(),
      currentSectionID: '',
      sectionGadgets: [],
      sectionsData: [],
      sectionName: ''
    }
  },
  mounted () {
    if (this.bookID !== undefined) this.addBookToLibrary()
    this.currentSectionID = this.book.sections[0]
    this.loadSection(this.book.sections[0])
    this.loadBook()
  },
  methods: {
    async loadBook () {
      this.loading = true
      this.sectionsData = []
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
      this.loading = true
      this.currentSectionID = sectionID
      this.sectionGadgets = []
      this.sectionName = ''
      await sectionsCollection.doc(sectionID).get().then(doc => {
        if (doc.exists) {
          this.sectionExists = true
          this.sectionGadgets = doc.data().gadgets
          this.sectionName = doc.data().name
        } else {
          this.sectionExists = false
        }
      })
      this.loading = false
    },
    addBookToLibrary: async function () {
      var a
      await librariesCollection.doc(this.searchNick).get().then(doc => {
        if (doc.exists) {
          a = doc.data().array_keys
        }
      })
      a.unshift(this.bookID)
      await librariesCollection.doc(this.searchNick).update({
        array_keys: a
      })
    },
    // Los que su html se pueda poner directamente se añaden aqui
    basicGadget (value) {
      return value.componentName === 'Título' || value.componentName === 'Texto normal' || value.componentName === 'Multimedia' || value.component === 'Hyperlink'
    },
    isBookOfLoggedUser () {
      return this.book.userID === store.state.userID
    },
    goEdit () {
      this.$router.replace({ name: 'editBook', params: { book: this.book, bookID: this.bookID } })
    },
    goBack () {
      this.$router.go(-1)
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
  text-align: justify;
  margin-top: 50px;
  margin: auto;
  width: 60%;
  border: 1px solid;
  padding: 20px;
}
</style>
