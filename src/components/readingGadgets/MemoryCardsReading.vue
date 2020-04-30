<template>
  <div>
    <h5>Tarjetas de memoria</h5>
    <p>¡Intenta emparejar todas las tarjetas!</p>
    <b-row style="margin-left: 15px;">
      <div v-for="(card, index) in cards" :key="index">
          <b-button v-if="card.flipped === false" :disabled="numberOfCardsFlipped === 2 || (numberOfMoves === maxNumberOfMoves)" style="height: 75px; width: 75px; margin: 10px; margin-top: 0px;" @click="flipCard(index)"></b-button>
          <b-button v-else class="memory-card" :style="card.color"></b-button>
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
    changeSectionWhenWrong: Boolean
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
    flipCard (index) {
      this.numberOfCardsFlipped++
      this.cards[index].flipped = !this.cards[index].flipped
      this.numberOfMoves++

      if (this.numberOfCardsFlipped === 1) this.cardClickedBefore = index
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].color === this.cards[this.cardClickedBefore].color)) {
        this.numberOfCardsFlipped = 0
        this.numberOfPairsMissing--
        if (this.numberOfPairsMissing === 0) this.solved = true
        setTimeout(() => {
          if (this.numberOfPairsMissing === 0) {
            this.checkAnswer()
          }
        }, 700)
      }
      if (this.numberOfMoves === this.maxNumberOfMoves && this.numberOfPairsMissing > 0) {
        setTimeout(() => { this.checkAnswer() }, 700)
      }
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].color !== this.cards[this.cardClickedBefore].color)) {
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
        if (this.solved === true) this.$emit('answered', this.sectionSolved)
        else {
          if (this.changeSectionWhenWrong === true) this.$emit('answered', this.sectionNoMoreMoves)
        }
      }
    }
  }
}
</script>

<style>
.memory-card {
  height: 75px;
  width: 75px;
  margin: 10px;
  margin-top: 0px;
  border: none;
}
</style>
