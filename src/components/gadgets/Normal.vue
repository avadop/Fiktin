<template>
  <div>
    <span :id="'text' + index" class="editme" style="word-wrap: break-word;" contenteditable v-html="this.htmlTextAux" @blur="saveSelection($event, index)"/>
  </div>
</template>

<script>
export default {
  name: 'normal',
  props: {
    htmlTextAux: String,
    index: Number,
    boldUse: Boolean,
    italicUse: Boolean,
    underlineUse: Boolean,
    strikeThroughUse: Boolean,
    lastPress: Number
  },
  /* mounted () {
    // Para usar el iframe, el div editable debe estar entre <iframe> e </iframe>, pero no sé cómo se usa
    iframeNode.contenDocument.designMode='on'
  }, */
  watch: {
    boldUse: function () {
      var a = document.getElementById('text' + this.lastPress)
      if (a !== null) {
        if (a.id === 'text' + this.index) { // Prevenimos activaciones fuera del elemento
          if (document.queryCommandState('Bold') && !this.boldUse) document.execCommand('bold')
          else if (!document.queryCommandState('Bold') && this.boldUse) document.execCommand('bold')
        }
      }
    },
    italicUse: function () {
      var a = document.getElementById('text' + this.lastPress)
      if (a !== null) {
        if (document.getElementById('text' + this.lastPress).id === 'text' + this.index) { // Prevenimos activaciones fuera del elemento
          if (document.queryCommandState('Italic') && !this.italicUse) document.execCommand('italic')
          else if (!document.queryCommandState('Italic') && this.italicUse) document.execCommand('italic')
        }
      }
    },
    underlineUse: function () {
      var a = document.getElementById('text' + this.lastPress)
      if (a !== null) {
        if (document.getElementById('text' + this.lastPress).id === 'text' + this.index) { // Prevenimos activaciones fuera del elemento
          if (document.queryCommandState('Underline') && !this.underlineUse) document.execCommand('underline')
          else if (!document.queryCommandState('Underline') && this.underlineUse) document.execCommand('underline')
        }
      }
    },
    strikeThroughUse: function () {
      var a = document.getElementById('text' + this.lastPress)
      if (a !== null) {
        if (document.getElementById('text' + this.lastPress).id === 'text' + this.index) { // Prevenimos activaciones fuera del elemento
          if (document.queryCommandState('StrikeThrough') && !this.strikeThroughUse) document.execCommand('strikeThrough')
          else if (!document.queryCommandState('StrikeThrough') && this.strikeThroughUse) document.execCommand('strikeThrough')
        }
      }
    }
  },
  methods: {
    saveSelection (evt, index) {
      var src = evt.target.innerHTML
      var htmlText = src
      this.$emit('html', htmlText, index)
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
}
</style>
