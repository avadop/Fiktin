<template>
  <div>
    <LoadingModal v-if="loading"/>
    <div class="buttons">
      <button class="buttonBack" @click="goBack()">Atrás</button>
      <button class="buttonEdit" v-if="isBookOfLoggedUser() && book.published===false" @click="goEdit()">Editar</button>
      <button class="buttonEditDisabled" v-else-if="isBookOfLoggedUser()" :disabled="book.published===true">Editar</button>
      <span style="color: red; padding-left: 10px;" v-if="isBookOfLoggedUser() && book.published===true">No se puede editar un libro si este se encuentra publicado</span>
      <b-row>
        <b-col cols="3"><h5>Sección: {{ sectionName }}</h5></b-col>
        <b-col cols="3"><b-form-select size="sm" v-model="currentSectionID" :options="sectionsData" @change="loadSection(currentSectionID)"></b-form-select></b-col>
      </b-row>
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
        <ExpandableTextReading v-if="text.component === 'ExpandableText'"
          :mainText="text.mainText"
          :expandedText="text.expandedText"/>
        <PopupTextReading v-if="text.component === 'PopupText'"
          :mainText="text.mainText"
          :popupText="text.popupText"/>
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
    PopupTextReading
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
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.buttonEdit {
  cursor: pointer;
  margin-left: 5px;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.buttonEditDisabled {
  margin-left: 5px;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
</style>
