<template>
  <div style="margin-top: 20px; margin-bottom: 20px;">
    <h5>Completa la secuencia: </h5>
    <div class="d-block text-center">
      <div class="d-flex">
        <div  class="d-flex">
          <div v-for="(seq, sequenceIndex) in sequence" :key="sequenceIndex">
            <div  style="margin-top:8px;">
              <span style="margin-right:10px; margin-left: 10px; font-size: 22px;">{{ seq.text }}</span>
            </div>
          </div>
          </div>
          <div class="d-flex">
          <div v-for="(text, index) in solution" :key="index">
            <b-form-input style="margin-top:5px; margin-right:5px; margin-left: 5px; width: 115px;" v-model="answers[index]" trim  :formatter="limit" placeholder="Respuesta"></b-form-input>
          </div>
          <b-button style="width: 100px;" :disabled="numberOfTries === 0 || answers.length !== solution.length" variant="primary" block @click="confirm()">Probar</b-button>
        </div>
      </div>
      <span v-if="correctPreview === false" style="color: red"> ¡Has fallado! </span>
      <span v-else-if="correctPreview === true" style="color: green"> ¡Has acertado! </span>
      <span> Te quedan {{ numberOfTries }} intentos</span><br/>
      <b v-if="numberOfTries === 0 && changeSectionWhenWrong === false">¡Sigue leyendo!</b>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sequenceReading',
  props: {
    numberOfTriesAux: Number,
    sequence: Array,
    solution: Array,
    rightSection: String,
    wrongSection: String,
    changeSectionWhenWrong: Boolean
  },
  data () {
    return {
      numberOfTries: this.numberOfTriesAux,
      answers: [],
      correctPreview: null
    }
  },
  methods: {
    confirm () {
      if (this.numberOfTries > 0) {
        this.numberOfTries--
        var correct = true
        for (var i = 0; i < this.solution.length; ++i) {
          if (this.answers[i] !== this.solution[i].text) correct = false
        }
        if (correct === true) {
          this.correctPreview = true
          setTimeout(() => { this.$emit('answered', this.rightSection) }, 700)
        } else {
          this.correctPreview = false
          this.answers = []
          if (this.numberOfTries === 0 && this.changeSectionWhenWrong === true) {
            this.correctPreview = null
            setTimeout(() => { this.$emit('answered', this.wrongSection) }, 700)
          }
        }
      }
    },
    limit (value) {
      return String(value).substring(0, 20)
    }
  }
}
</script>
