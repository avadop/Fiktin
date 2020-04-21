<template>
  <div>
    <h5>Tarjetas de memoria</h5>
    <p>¡Intenta emparejar todas las tarjetas!</p>
    <b-row style="margin-left: 15px;">
      <div v-for="(card, index) in cards" :key="index">
          <b-button v-if="card.flipped === false" :disabled="numberOfCardsFlipped === 2 || (numberOfMoves === maxNumberOfMoves)" style="height: 75px; width: 75px; margin: 10px; margin-top: 0px;" @click="flipCard(index)"></b-button>
          <b-button v-else :variant="card.image" style="height: 75px; width: 75px; margin: 10px; margin-top: 0px;"></b-button>
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
      cardTypes: [{ image: 'primary' },
        { image: 'danger' },
        { image: 'success' },
        { image: 'warning' },
        { image: 'dark' },
        { image: 'info' },
        { image: 'secondary' },
        { image: 'outline-success' },
        { image: 'outline-warning' },
        { image: 'outline-danger' },
        { image: 'outline-primary' },
        { image: 'outline-dark' }],
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
    flipCard (index) {
      this.numberOfCardsFlipped++
      this.cards[index].flipped = !this.cards[index].flipped
      this.numberOfMoves++

      if (this.numberOfCardsFlipped === 1) this.cardClickedBefore = index
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].image === this.cards[this.cardClickedBefore].image)) {
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
      if (this.numberOfCardsFlipped === 2 && (this.cards[index].image !== this.cards[this.cardClickedBefore].image)) {
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
