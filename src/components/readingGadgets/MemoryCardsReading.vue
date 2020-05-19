<template>
  <div>
    <h5>Tarjetas de memoria</h5>
    <p>¡Intenta emparejar todas las tarjetas!</p>
    <b-row v-if="customized === true && typeChosen === 'words'" style="margin-left: 15px;">
      <div v-for="(cardText, indexText) in cards" :key="indexText">
          <b-button v-if="cardText.flipped === false" class="card-text" style="margin-bottom: 10px;"  :disabled="numberOfCardsFlipped === 2 || (numberOfMoves === maxNumberOfMoves)" @click="flipCard(indexText)"></b-button>
          <b-button v-else variant="info" class="memory-card-text" style="margin-bottom: 10px; font-weight: bold; font-size: 20px;">{{ cardText.text }}</b-button>
      </div>
    </b-row>
    <b-row v-else style="margin-left: 15px;">
      <div v-for="(card, index) in cards" :key="index">
          <b-button v-if="card.flipped === false" class="card-color" :disabled="numberOfCardsFlipped === 2 || (numberOfMoves === maxNumberOfMoves)" @click="flipCard(index)"></b-button>
          <b-button v-else class="memory-card-color" :style="card.color"></b-button>
      </div>
    </b-row>
    <p v-if="numberOfMoves === maxNumberOfMoves && this.numberOfPairsMissing > 0" style="color: red;">Te has quedado sin movimientos :(</p>
    <p v-else>Llevas {{ numberOfMoves }} movimientos de {{ maxNumberOfMoves }} disponibles! Te quedan {{ maxNumberOfMoves - numberOfMoves }}!! </p>
    <p v-if="solved === true" style="color: green;">¡Has resuelto el puzzle!</p>
    <b v-if="numberOfMoves === maxNumberOfMoves && this.numberOfPairsMissing > 0 && changeSectionWhenWrong === false">¡Sigue leyendo!</b>
  </div>
</template>

<script>
export default {
  name: 'memoryCardsReading',
  props: {
    numberOfPairs: Number,
    maxNumberOfMoves: Number,
    sectionNoMoreMoves: String,
    sectionSolved: String,
    changeSectionWhenWrong: Boolean,
    customized: Boolean,
    typeChosen: String,
    customWords: Array,
    customColors: Array
  },
  data () {
    return {
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
      numberOfPairsMissing: this.numberOfPairs,
      numberOfMoves: 0,
      solved: false
    }
  },
  mounted () {
    this.shuffleCards()
  },
  methods: {
    shuffleCards () {
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
    flipCard (index) {
      this.numberOfCardsFlipped++
      this.cards[index].flipped = !this.cards[index].flipped
      this.numberOfMoves++

      if (this.numberOfCardsFlipped === 1) this.cardClickedBefore = index
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].value === this.cards[this.cardClickedBefore].value)) {
        this.numberOfCardsFlipped = 0
        this.numberOfPairsMissing--
        if (this.numberOfPairsMissing === 0) this.solved = true
        setTimeout(() => {
          if (this.numberOfPairsMissing === 0) {
            this.checkAnswer()
          }
        }, 700)
      }
      if (this.numberOfMoves === this.maxNumberOfMoves && this.numberOfPairsMissing > 0) this.checkAnswer()
      if (this.numberOfCardsFlipped === 2 && (this.cards[this.cardClickedBefore].value !== this.cards[index].value)) {
        setTimeout(() => { this.refresh(index) }, 1000)
      }
    },
    refresh (index) {
      this.cards[index].flipped = false
      this.cards[this.cardClickedBefore].flipped = false
      this.numberOfCardsFlipped = 0
    },
    checkAnswer () {
      if (this.sectionSolved !== '') {
        if (this.solved === true) setTimeout(() => { this.$emit('answered', this.sectionSolved) }, 700)
        else {
          if (this.changeSectionWhenWrong === true) setTimeout(() => { this.$emit('answered', this.sectionNoMoreMoves) }, 700)
        }
      }
    }
  }
}
</script>

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
