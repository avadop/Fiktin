<template>
  <div>
    <span>PICTURE</span>
    <h3 :id="'picture' + index" class="editme" contenteditable @blur="saveSelection($event)"/>
  </div>
</template>

<script>
export default {
  name: 'picture',
  props: {
    index: Number
  },
  methods: {
    saveSelection (evt) {
      var src = evt.target.innerHTML
      var plainText = src
      var htmlText = ('<h3> PICTURE </h3>')
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
  min-height: 28px;
}
</style>
