<template>
  <div class="border">
    <h6 class="title">Tarjetas de memoria</h6>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no llevará a ninguna sección al resolver el puzzle</span>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Número de parejas a desvelar: {{ numberOfPairs }}</span></b-col>
      <b-col>
        <b-form-input v-model="numberOfPairs" type="range" min="2" max="12" @change="save()"/>
      </b-col>
    </b-row>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Número de movimientos disponibles: {{ maxNumberOfMoves }}</span></b-col>
      <b-col>
        <b-form-input v-model="maxNumberOfMoves" type="range" :step="2" :min="numberOfPairs * 2" max="100" @change="save()"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="5"><span>Sección a la que quieres saltar si se resuelve el puzzle: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="sectionSolved" :options="sections"></b-form-select></b-col>
    </b-row><br/>
    <b-row v-if="changeSectionWhenWrong === true">
      <b-col cols="5"><span>Sección a la que quieres saltar si se falla la respuesta: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="sectionNoMoreMoves" :options="sections"></b-form-select></b-col>
      <b-button style="width: 20px; margin-right:50px;" class="my-1" variant="danger-dark" @click="noWrongSection()"><b-icon style="heigh:50px;width:50px;" variant="danger" icon="x"></b-icon></b-button>
    </b-row>
    <div v-else>
      <span @click="changeSectionWhenWrong = true, save()" style="color: darkblue; font-weight: bold; cursor: pointer;"> Agregar salto de seccion al quedarse sin movimientos</span>
      <span style="font-size: 13px;"> (En caso de no activar esta opción, si el lector se queda sin movimientos se quedará en la página que está)</span>
    </div>
    <b-button size="sm" style="width: 150px; heigth:7px; margin-top: 10px; float: right;"  variant="secondary" block @click="show = true, shufflePreview()">Previsualizar</b-button>

    <b-modal v-model="show" hide-footer hide-header centered>
      <div class="d-block text-left">
        <h5>Tarjetas de memoria</h5>
        <p>¡Intenta emparejar todas las tarjetas!</p>
      </div>
      <b-row style="margin-left: 15px;">
        <div v-for="(card, index) in cards" :key="index">
          <b-button v-if="card.flipped === false" :disabled="numberOfCardsFlipped === 2 || (numberOfMovesPreview === maxNumberOfMoves)" style="height: 75px; width: 75px; margin: 10px; margin-top: 0px;" @click="flipCardPreview(index)"></b-button>
          <b-button v-else :variant="card.image" style="height: 75px; width: 75px; margin: 10px; margin-top: 0px;"></b-button>
        </div>
      </b-row>
      <p v-if="numberOfMovesPreview === maxNumberOfMoves && this.pairsMissing > 0" style="color: red;">Te has quedado sin movimientos :(</p>
      <p v-else>Llevas {{ numberOfMovesPreview }} movimientos de {{ maxNumberOfMoves }} disponibles! Te quedan {{ maxNumberOfMoves - numberOfMovesPreview }}!! </p>
      <p v-if="solved === true" style="color: green;">¡Has resuelto el puzzle!</p>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="show = false">Ok</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'memoryCards',
  props: {
    actualSection: String,
    sectionsDataAux: Array,
    numberOfPairsAux: Number,
    maxNumberOfMovesAux: Number,
    sectionNoMoreMovesAux: String,
    sectionSolvedAux: String,
    changeSectionWhenWrongAux: Boolean,
    index: Number
  },
  data () {
    return {
      sections: [],
      valid: true,
      numberOfPairs: this.numberOfPairsAux,
      maxNumberOfMoves: this.maxNumberOfMovesAux,
      sectionNoMoreMoves: this.sectionNoMoreMovesAux,
      sectionSolved: this.sectionSolvedAux,
      changeSectionWhenWrong: this.changeSectionWhenWrongAux,

      show: false,
      numberOfMovesPreview: 0,
      pairsMissing: this.numberOfPairs,
      cardTypes: [{ image: 'primary' },
        { image: 'danger' },
        { image: 'success' },
        { image: 'warning' },
        { image: 'dark' },
        { image: 'info' },
        { image: 'light' },
        { image: 'outline-success' },
        { image: 'outline-warning' },
        { image: 'outline-danger' },
        { image: 'outline-primary' },
        { image: 'outline-dark' }],
      cards: [],
      numberOfCardsFlipped: 0,
      cardClickedBefore: '',
      solved: false
    }
  },
  watch: {
    sectionsDataAux: function () {
      this.refresh()
    },
    actualSection: function () {
      this.refresh()
    },
    numberOfPairsAux: function () {
      this.refresh()
    },
    numberOfPairs: function () {
      if (this.maxNumberOfMoves < this.numberOfPairs * 2) this.maxNumberOfMoves = this.numberOfPairs * 2
    },
    maxNumberOfMovesAux: function () {
      this.refresh()
    },
    sectionNoMoreMovesAux: function () {
      this.refresh()
    },
    sectionSolvedAux: function () {
      this.refresh()
    },
    changeSectionWhenWrongAux: function () {
      this.refresh()
    },
    index: function () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.sections = []
      this.valid = false
      this.numberOfPairs = this.numberOfPairsAux
      this.maxNumberOfMoves = this.maxNumberOfMovesAux
      this.sectionNoMoreMoves = this.sectionNoMoreMovesAux
      this.sectionSolved = this.sectionSolvedAux
      this.changeSectionWhenWrong = this.changeSectionWhenWrongAux

      this.deepClone()
      this.checkContent()

      var end = false
      for (var i = 0; i < this.sections.length && !end; ++i) {
        if (this.sections[i].value === this.actualSection) {
          if (i === 0 && this.sections[i].value === this.sectionSolved && this.sections.length > 1) {
            this.sectionSolved = this.sections[1].value
          }
          this.sections.splice(i, 1)
          end = true
        }
      }
      if (this.sections.length > 0) this.valid = true
      if (!this.valid) {
        this.sectionSolved = ''
        this.sectionNoMoreMoves = ''
      }
      this.save()
    },
    deepClone () {
      for (var i = 0; i < this.sectionsDataAux.length; ++i) {
        this.sections.push(this.sectionsDataAux[i])
      }
    },
    checkContent () {
      if ((this.sectionNoMoreMoves === '' || this.sectionNoMoreMoves === undefined) && this.sectionsDataAux.length > 1) this.sectionNoMoreMoves = this.sectionsDataAux[0].value
      else {
        var quit = false
        for (var i = 0; i < this.sections.length && !quit; ++i) {
          if (this.sectionNoMoreMoves === this.sections[i].value) quit = true
        }
        if (!quit && this.sectionsDataAux.length > 1) this.sectionNoMoreMoves = this.sectionsDataAux[0].value
        else if (!quit) this.sectionNoMoreMoves = ''
      }
      if ((this.sectionSolved === '' || this.sectionSolved === undefined) && this.sectionsDataAux.length > 1) this.sectionSolved = this.sectionsDataAux[0].value
      else {
        var quit2 = false
        for (var j = 0; j < this.sections.length && !quit2; ++j) {
          if (this.sectionSolved === this.sections[j].value) quit2 = true
        }
        if (!quit2 && this.sectionsDataAux.length > 1) this.sectionSolved = this.sectionsDataAux[0].value
        else if (!quit2) this.sectionSolved = ''
      }
    },
    save () {
      if (this.sectionNoMoreMoves === undefined) this.sectionNoMoreMoves = ''
      if (this.sectionSolved === undefined) this.sectionSolved = ''
      this.$emit('save', parseInt(this.numberOfPairs, 10), parseInt(this.maxNumberOfMoves, 10), this.sectionNoMoreMoves, this.sectionSolved, this.changeSectionWhenWrong, this.index)
    },
    noWrongSection () {
      this.changeSectionWhenWrong = false
      this.sectionNoMoreMoves = ''
      this.save()
    },
    shufflePreview () {
      this.pairsMissing = this.numberOfPairs
      this.solved = false
      this.numberOfMovesPreview = 0
      this.numberOfCardsFlipped = 0
      this.cards = []

      for (var i = 0; i < this.numberOfPairs * 2; ++i) this.cards.push({ image: '', flipped: Boolean })
      var value = 1
      var j = 0
      while (j < this.numberOfPairs * 2) {
        var index = Math.floor(Math.random() * (this.numberOfPairs * 2))
        if (this.cards[index].image === '') {
          this.cards[index].image = this.cardTypes[value - 1].image
          this.cards[index].flipped = false
          j++
          if (j % 2 === 0) value++
        }
      }
    },
    flipCardPreview (index) {
      this.numberOfCardsFlipped++
      this.cards[index].flipped = !this.cards[index].flipped
      this.numberOfMovesPreview++

      if (this.numberOfCardsFlipped === 1) this.cardClickedBefore = index
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].image === this.cards[this.cardClickedBefore].image)) {
        this.numberOfCardsFlipped = 0
        this.pairsMissing--
        if (this.pairsMissing === 0) this.solved = true
      }
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].image !== this.cards[this.cardClickedBefore].image)) {
        setTimeout(() => { this.refreshPreview(index) }, 1000)
      }
    },
    refreshPreview (index) {
      this.cards[index].flipped = false
      this.cards[this.cardClickedBefore].flipped = false
      this.numberOfCardsFlipped = 0
    }
  }
}
</script>

<style scoped>
.border {
  padding: 10px;
  padding-bottom: 54px;
}
.title {
  font-weight: bold;
}
</style>
