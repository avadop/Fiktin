<template>
  <div>
    <span v-html="htmlText"/>
    <button style="margin-left: 10px;" @click="change()">Repetir</button>
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
