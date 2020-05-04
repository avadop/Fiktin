<template>
  <b-card>
    <h6 class="title">Tarjetas de memoria</h6>
    <br>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no llevará a ninguna sección al resolver el puzzle</span>

    <!-- Cambio de sección -->
    <b-row>
      <b-col cols="5"><span>Cambio de sección al acertar: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="sectionSolved" :options="sections"></b-form-select></b-col>
    </b-row>
    <b-row class="right" style="padding-left: 10px">
      <b-col cols="5">
        <b-button variant="outline-dark" size="sm" v-if="!changeSectionWhenWrong" @click="changeSectionWhenWrong = true, save()">Cambiar de sección al fallar</b-button>
        <b-button variant="outline-dark" size="sm" v-else @click="noWrongSection()">Continuar lectura al fallar</b-button>
      </b-col>
      <b-col v-if="changeSectionWhenWrong" style="padding-top: 5px;"><b-form-select size="sm" @change="save()" v-model="sectionNoMoreMoves" :options="sections"></b-form-select></b-col>
    </b-row>
    <hr>
    <!-- num parejas -->
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Nº de parejas: {{ numberOfPairs }}</span></b-col>
      <b-col>
        <b-form-input v-model="numberOfPairs" type="range" min="2" max="12" @change="save()"/>
      </b-col>
    </b-row>
    <!-- num movimientos -->
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Nº de movimientos: {{ maxNumberOfMoves }}</span></b-col>
      <b-col>
        <b-form-input v-model="maxNumberOfMoves" type="range" :step="2" :min="numberOfPairs * 2 + numberOfPairs + (numberOfPairs % 2)" max="200" @change="save()"/>
      </b-col>
    </b-row>
    <hr>
    <!-- personalización -->
    <b-row class="right" style="padding-left: 10px">
      <b-col v-if="customized === true" style="padding-top: 10px">
        <span>Tipo de customización</span>
      </b-col>
      <b-col v-if="customized === true" style="padding-top: 5px">
        <b-form-select size = "sm" style="width: 200px;" v-model="typeChosen" :options="customizationTypes" @change="save()"></b-form-select>
      </b-col>
      <b-col cols="4" v-if="!customized">
        <b-button variant="outline-dark" size="sm" @click="customized = true, save()">Customizar tarjetas</b-button>
      </b-col>
      <b-col cols="3" v-else>
        <b-button variant="outline-dark" size="sm" @click="cardsNotCustomized()">Cancelar</b-button>
      </b-col>
    </b-row>
    <div v-if="customized === true" style="padding-top: 5px;">
      <div v-if="typeChosen === 'words'">
        <div v-for="(n, index) in numberOfPairs" :key="index" >
          <b-row style="margin-left:2px;"><span style="padding-top: 15px;">Pareja {{ n }}</span>
          <b-form-input v-model="customWords[index*2]" style="width:230px; margin-left: 20px; margin-top: 10px;" :formatter="limit" placeholder="Tarjeta 1" @change="save()"></b-form-input>
          <b-form-input v-model="customWords[index*2+1]" style="width:230px; margin-left: 20px; margin-top: 10px;" :formatter="limit" placeholder="Tarjeta 2" @change="save()"></b-form-input></b-row>
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
    </div>

    <b-button size="sm" style="width: 150px; heigth:7px; margin-top: 10px; float: right;"  variant="secondary" block @click="show = true, shufflePreview()">Previsualizar</b-button>

    <b-modal v-model="show" hide-footer hide-header centered>
      <div class="d-block text-left">
        <h5>Tarjetas de memoria</h5>
        <p>¡Intenta emparejar todas las tarjetas!</p>
      </div>
      <b-row v-if="customized === true && typeChosen === 'words'" style="margin-left: 15px;">
        <div v-for="(cardText, indexText) in cards" :key="indexText">
          <b-button v-if="cardText.flipped === false" class="card-text" style="margin-bottom: 10px;"  :disabled="numberOfCardsFlipped === 2 || (numberOfMovesPreview === maxNumberOfMoves)" @click="flipCardPreview(indexText)"></b-button>
          <b-button v-else variant="info" class="memory-card-text" style="margin-bottom: 10px; font-weight: bold; font-size: 20px;">{{ cardText.text }}</b-button>
        </div>
     </b-row>
      <b-row v-else style="margin-left: 15px;">
        <div v-for="(card, index) in cards" :key="index">
          <b-button v-if="card.flipped === false" :disabled="numberOfCardsFlipped === 2 || (numberOfMovesPreview === maxNumberOfMoves)" style="height: 75px; width: 75px; margin: 10px; margin-top: 0px;" @click="flipCardPreview(index)"></b-button>
          <b-button v-else class="memory-card-color" :style="card.color"></b-button>
        </div>
      </b-row>
      <p v-if="numberOfMovesPreview === maxNumberOfMoves && this.pairsMissing > 0" style="color: red;">Te has quedado sin movimientos :(</p>
      <p v-else>Llevas {{ numberOfMovesPreview }} movimientos de {{ maxNumberOfMoves }} disponibles! Te quedan {{ maxNumberOfMoves - numberOfMovesPreview }}!! </p>
      <p v-if="solved === true" style="color: green;">¡Has resuelto el puzzle!</p>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="show = false">Ok</b-button>
      </div>
    </b-modal>
  </b-card>
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
      this.save()
    },
    shufflePreview () {
      this.pairsMissing = this.numberOfPairs
      this.solved = false
      this.numberOfMovesPreview = 0
      this.numberOfCardsFlipped = 0
      this.cards = []

      for (var i = 0; i < this.numberOfPairs * 2; ++i) this.cards.push({ color: '', flipped: Boolean, text: '', value: 0 })
      var value = 1
      var j = 0
      while (j < this.numberOfPairs * 2) {
        var index = Math.floor(Math.random() * (this.numberOfPairs * 2))
        if (this.cards[index].value === 0) {
          if (this.customized && this.typeChosen === 'words') this.cards[index].text = this.customWords[j]
          else if (this.customized && this.typeChosen === 'color') this.cards[index].color = 'background-color: ' + this.customColors[value - 1] + ';'
          else this.cards[index].color = 'background-color: ' + this.cardTypes[value - 1].color + ';'
          this.cards[index].flipped = false
          this.cards[index].value = value
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
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].value === this.cards[this.cardClickedBefore].value)) {
        this.numberOfCardsFlipped = 0
        this.pairsMissing--
        if (this.pairsMissing === 0) this.solved = true
      }
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].value !== this.cards[this.cardClickedBefore].value)) {
        setTimeout(() => { this.refreshPreview(index) }, 1000)
      }
    },
    refreshPreview (index) {
      this.cards[index].flipped = false
      this.cards[this.cardClickedBefore].flipped = false
      this.numberOfCardsFlipped = 0
    },
    limit (value) {
      return String(value).substring(0, 15)
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
.card-color {
  height: 75px;
  width: 75px;
  margin: 10px;
  margin-top: 0px;
}
.card-text {
  height: 50px;
  width: 200px;
  margin: 8px;
  margin-top: 0px;
}
.memory-card-color {
  height: 75px;
  width: 75px;
  margin: 10px;
  margin-top: 0px;
  border: none;
}
.memory-card-text {
  height: 50px;
  width: 200px;
  margin: 8px;
  margin-top: 0px;
}
</style>
