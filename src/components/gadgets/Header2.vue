<template>
  <div>
    <h2 :id="'header' + index" class="editme" style="word-wrap: break-word;" contenteditable v-html="this.plainTextAux" @blur="saveSelection($event)"/>
  </div>
</template>

<script>
export default {
  name: 'header1',
  props: {
    htmlTextAux: String,
    plainTextAux: String,
    index: Number
  },
  methods: {
    saveSelection (evt) {
      var src = evt.target.innerHTML
      var plainText = src
      var htmlText = ('<h2>' + src + '</h2>')
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
  min-height: 32px;
}
</style>
