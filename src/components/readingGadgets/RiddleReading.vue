<template>
  <div class="border" style="padding: 11px; margin: 8px;">
    <div class="d-block text-left">
      <h5 style="margin-bottom: 10px; font-size: 24px;">Adivinanza</h5>
    </div>
    <div class="d-block text-center">
      <p> {{ riddleText }}</p>
      <div class="d-flex">
        <b-form-input style="margin-top:5px;" v-model="tryText" trim  :formatter="formatAnswer" placeholder="Respuesta"></b-form-input>
        <span v-if="tryText.length > 24" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.tryText.length}} /30</span>
        <b-button style="width: 150px;" :disabled="numberOfTries === 0" variant="primary" block @click="tryAnswer()">Probar</b-button>
      </div>
      <span v-if="correctPreview === false" style="color: red"> ¡Has fallado! </span>
      <span v-else-if="correctPreview === true" style="color: green"> ¡Has acertado! </span>
      <span> Te quedan {{ numberOfTries }} intentos</span><br/>
      <b> {{ text }} </b>
    </div>
  </div>
</template>

<script>
export default {
  name: 'riddleReading',
  props: {
    numberOfTriesAux: String,
    riddleText: String,
    answerText: String,
    wrongSection: String,
    rightSection: String
  },
  data () {
    return {
      tryText: '',
      numberOfTries: parseInt(this.numberOfTriesAux, 10),
      correctPreview: null,
      text: ''
    }
  },
  methods: {
    tryAnswer () {
      if (this.numberOfTries > 0) {
        this.numberOfTries--
        if (this.tryText === this.answerText) {
          this.correctPreview = true
          setTimeout(() => { this.$emit('answered', this.rightSection) }, 700)
        } else {
          this.correctPreview = false
          if (this.numberOfTries === 0 && this.wrongSection !== '') {
            setTimeout(() => { this.$emit('answered', this.wrongSection) }, 700)
            this.correctPreview = null
          } else if (this.numberOfTries === 0 && this.wrongSection === '') this.text = '¡Sigue leyendo!'
        }
      }
    },
    formatMaxRiddle (value) {
      return String(value).substring(0, 2000)
    },
    formatAnswer (value) {
      var answer = String(value).substring(0, 30)
      return answer.toLowerCase()
    }
  }
}

</script>
