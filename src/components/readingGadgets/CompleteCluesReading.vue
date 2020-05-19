<template>
  <div style="margin-bottom: 15px; margin-top: 15px;">
    <div v-for="(element, index) in data" :key="index" style="min-width: 200px; width: 200px; margin-top: 10px;">
      <b-form-select v-if="valid" v-model="data[index]" :options="options" size="sm"/>
      <b-form-select v-else disabled v-model="data[index]" :options="options" size="sm"/>
    </div>
    <p style="font-size: 14px">Selecciona las repuestas correctas y pulsa solucionar</p>
    <b-button v-if="valid" variant="outline-dark" @click="check()">Solucionar</b-button>
    <span v-else>Sigue leyendo!</span>
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
