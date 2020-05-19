<template>
  <div style="margin-bottom: 15px;">
    <b-button v-if="!pressed" @click="generateRandom(), processConditions()" variant="outline-info"><b-icon icon="question-diamond"/></b-button>
    <span v-else>El número generado es {{ this.number }}</span>
  </div>
</template>

<script>
export default {
  name: 'randomNumberReading',
  props: {
    lowerLimit: Number,
    upperLimit: Number,
    conditions: Array
  },
  data () {
    return {
      number: '',
      pressed: false
    }
  },
  methods: {
    generateRandom () {
      this.number = Math.floor(Math.random() * (this.upperLimit - this.lowerLimit + 1) + this.lowerLimit)
      this.number = parseInt(this.number, 10) // Hacemos un parseInt por si acaso
      this.pressed = true
    },
    processConditions () {
      setTimeout(() => {
        for (var i = 0; i < this.conditions.length; ++i) {
          if (this.conditions[i].condition === '>') {
            if (this.number > this.conditions[i].number) this.$emit('change', this.conditions[i].section)
          } else if (this.conditions[i].condition === '>=') {
            if (this.number >= this.conditions[i].number) this.$emit('change', this.conditions[i].section)
          } else if (this.conditions[i].condition === '<') {
            if (this.number < this.conditions[i].number) this.$emit('change', this.conditions[i].section)
          } else if (this.conditions[i].condition === '<=') {
            if (this.number <= this.conditions[i].number) this.$emit('change', this.conditions[i].section)
          } else if (this.conditions[i].condition === '==') {
            if (this.number === this.conditions[i].number) this.$emit('change', this.conditions[i].section)
          }
        }
      }, 1200)
    }
  }
}
</script>
