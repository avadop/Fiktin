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
        <b-form-input v-model="maxNumberOfMoves" type="range" :step="2" :min="numberOfPairs * 2 + numberOfPairs + (numberOfPairs % 2)" max="200" @change="save()"/>
      </b-col>
    </b-row>
    <div v-if="customized === true" style="padding-top: 5px; padding-bottom: 80px;">
      <span style="padding-top: 15px;padding-right: 12px;">Elije el tipo de customizacion que deseas realizar</span>
      <b-form-select size = "sm" style="width: 200px;" v-model="typeChosen" :options="customizationTypes" @change="save()"></b-form-select>
      <div v-if="typeChosen === 'words'">
        <div v-for="(n, index) in numberOfPairs" :key="index" >
          <b-row style="margin-left:2px;"><span style="padding-top: 15px;">Pareja {{ n }}</span>
          <b-form-input v-model="customWords[index*2]" style="width:230px; margin-left: 20px; margin-top: 10px;" placeholder="Texto 1" @change="save()"></b-form-input>
          <b-form-input v-model="customWords[index*2+1]" style="width:230px; margin-left: 20px; margin-top: 10px;" placeholder="Texto 2" @change="save()"></b-form-input></b-row>
        </div>
      </div>
      <div v-if="typeChosen === 'color'">
        <div v-for="(n, index) in numberOfPairs" :key="index" >
          <b-row style="margin-left:2px;"><span style="padding-top: 15px;">Pareja {{ n }}</span>
          <b-form-input v-if="customColors[index] === undefined" v-model="customColors[index]" type="color" style="width: 57%; margin-left: 20px; margin-top: 10px;" @change="save()"></b-form-input>
          <b-form-input v-else v-model="customColors[index]" type="color" style="width: 78%; margin-left: 20px; margin-top: 10px;" @change="save()"></b-form-input>
          <span v-if="customColors[index] === undefined" style="color:red; padding-left: 8px; padding-top: 15px;">Elige algún color</span></b-row>
        </div>
      </div>
      <b-button size="sm" style=" heigth:7px; margin-top: 10px; float: right;"  variant="outline-secondary" block @click="cardsNotCustomized()">Cancelar</b-button>
    </div>
    <div v-else>
      <span @click="customized = true, save()" style="color: darkgreen; font-weight: bold; cursor: pointer;"> Customizar tarjetas</span>
      <span style="font-size: 13px; padding-bottom: 15px;"> (En caso de no activar esta opción, las tarjetas tendrán sus valores por defecto)</span>
    </div>

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
          <b-button v-else class="memory-card" :style="card.color"></b-button>
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
    index: Number,
    customizedAux: Boolean,
    typeChosenAux: String,
    customWordsAux: Array,
    customColorsAux: Array
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
      customized: this.customizedAux,
      customizationTypes: [{ value: 'color', text: 'Colores' }, { value: 'words', text: 'Palabras' }],
      typeChosen: this.typeChosenAux,
      customWords: this.customWordsAux,
      customColors: this.customColorsAux,

      show: false,
      numberOfMovesPreview: 0,
      pairsMissing: this.numberOfPairs,
      cardTypes: [{ color: '#4CAF50' }, // verde
        { color: '#008CBA' }, // azul
        { color: '#FF9713' }, // naranja
        { color: '#EE2A1C' }, // rojo
        { color: '#A97FCB' }, // lila
        { color: '#F12CDF' }, // fuxia
        { color: '#18FCC5' }, // aguamarina
        { color: '#5E22F1' }, // purpura
        { color: '#F0A899' }, // naranjita
        { color: '#074F1D' }, // verde oscuro
        { color: '#5F380A' }, // marron
        { color: '#DEF122' } // verde lima
      ],
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
      if (this.maxNumberOfMoves < this.numberOfPairs * 2) this.maxNumberOfMoves = this.numberOfPairs * 2 + this.numberOfPairs + (this.numberOfPairs % 2)
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
    customizedAux: function () {
      this.refresh()
    },
    typeChosenAux: function () {
      this.refresh()
    },
    customWordsAux: function () {
      this.refresh()
    },
    customColorsAux: function () {
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
      this.customized = this.customizedAux
      this.typeChosen = this.typeChosenAux
      this.customWords = this.customWordsAux
      this.customColors = this.customColorsAux

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
      this.$emit('save', parseInt(this.numberOfPairs, 10), parseInt(this.maxNumberOfMoves, 10), this.sectionNoMoreMoves, this.sectionSolved, this.changeSectionWhenWrong, this.customized, this.typeChosen, this.customWords, this.customColors, this.index)
    },
    noWrongSection () {
      this.changeSectionWhenWrong = false
      this.sectionNoMoreMoves = ''
      this.save()
    },
    cardsNotCustomized () {
      this.customized = false
      this.typeChosen = ''
      this.customWords = []
      this.customColors = []
      this.save()
    },
    shufflePreview () {
      this.pairsMissing = this.numberOfPairs
      this.solved = false
      this.numberOfMovesPreview = 0
      this.numberOfCardsFlipped = 0
      this.cards = []

      for (var i = 0; i < this.numberOfPairs * 2; ++i) this.cards.push({ color: '', flipped: Boolean })
      var value = 1
      var j = 0
      while (j < this.numberOfPairs * 2) {
        var index = Math.floor(Math.random() * (this.numberOfPairs * 2))
        if (this.cards[index].color === '') {
          this.cards[index].color = 'background-color: ' + this.cardTypes[value - 1].color + ';'
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
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].color === this.cards[this.cardClickedBefore].color)) {
        this.numberOfCardsFlipped = 0
        this.pairsMissing--
        if (this.pairsMissing === 0) this.solved = true
      }
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].color !== this.cards[this.cardClickedBefore].color)) {
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

<style>
.memory-card {
  height: 75px;
  width: 75px;
  margin: 10px;
  margin-top: 0px;
  border: none;
}
</style>
