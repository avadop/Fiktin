<template>
  <div>
    <span v-html="htmlText"/>
    <button style="margin-left: 10px;" v-if="htmlText.length != 13" @click="change()">Cambiar</button>
    <button v-else @click="change()">Cambiar</button>
  </div>
</template>

<script>
export default {
  name: 'changeSectionReading',
  props: {
    htmlText: String,
    next: String
  },
  methods: {
    change () {
      this.$emit('change', this.next)
    }
  }
}
</script>
