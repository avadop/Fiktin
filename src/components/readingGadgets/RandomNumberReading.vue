<template>
  <div style="margin-bottom: 15px;">
    <button v-if="!pressed" @click="generateRandom(), processConditions()">Generar</button>
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
    }
  }
}
</script>
