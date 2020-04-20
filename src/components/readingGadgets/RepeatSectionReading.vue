<template>
  <div>
    <span v-html="htmlText"/>
    <button style="margin-left: 10px;" v-if="htmlText.length != 13" @click="change()">Repetir</button>
    <button v-else @click="change()">Repetir</button>
  </div>
</template>

<script>
export default {
  name: 'repeatSectionReading',
  props: {
    htmlText: String,
    actual: String
  },
  methods: {
    change () {
      this.$emit('change', this.actual)
    }
  }
}
</script>
