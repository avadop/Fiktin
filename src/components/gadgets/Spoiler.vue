<template>
  <div>
    <span :id="'spoiler' + index" class="editme" v-html="plainTextAux" contenteditable @blur="saveSelection($event)"/>
  </div>
</template>

<script>
export default {
  name: 'spoiler',
  props: {
    htmlTextAux: String,
    plainTextAux: String,
    index: Number
  },
  methods: {
    saveSelection (evt) {
      var src = evt.target.innerHTML
      var plainText = src
      var htmlText = ('<span>' + src + '</span>')
      this.$emit('html', plainText, htmlText, this.index)
    }
  }
}
</script>

<style scoped>
.editme {
  outline: 0px solid transparent;
  cursor: text;
  display: block;
  min-height: 24px;
  background-color: black;
  color: white;
}
</style>
