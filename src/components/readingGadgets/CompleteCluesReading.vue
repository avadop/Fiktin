<template>
  <div style="margin-bottom: 15px; margin-top: 15px;">
    <h5>Completa las pistas</h5>
    <p>¡Adivina cual es la respuesta esperada!</p>
    <div>
      <div v-for="(element, index) in clues" :key="index">
        <span>Pista {{ index + 1}}: {{ element.clue }}</span>
      </div>
    </div>
    <div>
      <div v-for="(element, index) in data" :key="index">
        <b-form-select v-if="valid" v-model="data[index]" :options="options" size="sm"/>
        <b-form-select v-else disabled v-model="data[index]" :options="options" size="sm"/>
      </div>
    </div>
    <div>
      <button v-if="valid" style="margin-top: 10px;" @click="check()">Comprobar respuestas</button>
      <span v-else>Sigue leyendo!</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'randomNumberReading',
  props: {
    clues: Array,
    answers: Array,
    changeSectionWhenWrong: Boolean,
    onGuess: String,
    onWrong: String
  },
  data () {
    return {
      data: [],
      options: [],
      valid: true
    }
  },
  mounted () {
    this.data = []
    this.options = []
    this.valid = true
    for (var j = 0; j < this.clues.length; ++j) {
      this.options.push({ value: this.clues[j].clue, text: this.clues[j].clue })
    }
    for (var i = 0; i < this.answers.length; ++i) {
      this.data.push(this.clues[0].clue)
    }
  },
  methods: {
    check () {
      var wrong = false
      for (var i = 0; i < this.answers.length && !wrong; ++i) {
        if (this.answers[i].answer !== this.data[i]) wrong = true
      }
      if (!wrong) this.$emit('answered', this.onGuess)
      else if (wrong && this.changeSectionWhenWrong) this.$emit('answered', this.onWrong)
      else if (wrong && !this.changeSectionWhenWrong) this.valid = false
    }
  }
}
</script>
