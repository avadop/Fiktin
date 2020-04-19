<template>
  <div>
    <span v-html="htmlText"/>
    <button style="margin-left: 10px;" @click="change()">Cambiar</button>
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
