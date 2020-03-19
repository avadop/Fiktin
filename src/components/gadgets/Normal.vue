<template>
  <div>
    <div id="text" class="editme" v-html="this.htmlTextAux" contenteditable @click="checkStyles" @keydown="checkStyles" @blur="saveSelection($event)"/>
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
    underlineUse: Boolean
  },
  /* mounted () {
    // Para usar el iframe, el div editable debe estar entre <iframe> e </iframe>, pero no sé cómo se usa
    iframeNode.contenDocument.designMode='on'
  }, */
  watch: {
    boldUse: function () {
      if (document.queryCommandState('Bold') && !this.boldUse) document.execCommand('bold')
      else if (!document.queryCommandState('Bold') && this.boldUse) document.execCommand('bold')
    },
    italicUse: function () {
      if (document.queryCommandState('Italic') && !this.italicUse) document.execCommand('italic')
      else if (!document.queryCommandState('Italic') && this.italicUse) document.execCommand('italic')
    },
    underlineUse: function () {
      if (document.queryCommandState('Underline') && !this.underlineUse) document.execCommand('underline')
      else if (!document.queryCommandState('Underline') && this.underlineUse) document.execCommand('underline')
    }
  },
  methods: {
    checkStyles () {
      if (document.queryCommandState('Bold')) this.$emit('buttons', 'Bold', 1)
      else this.$emit('buttons', 'Bold', -1)
      if (document.queryCommandState('Italic')) this.$emit('buttons', 'Italic', 1)
      else this.$emit('buttons', 'Italic', -1)
      if (document.queryCommandState('Underline')) this.$emit('buttons', 'Underline', 1)
      else this.$emit('buttons', 'Underline', -1)
    },
    saveSelection (evt) {
      var src = evt.target.innerHTML
      var htmlText = src
      this.$emit('html', htmlText, this.index)
    }
    // UNUSED METHODS!! (saved just in case)
    /* getCaretPosition (node) {
      var range = window.getSelection().getRangeAt(0)
      var preCaretRange = range.cloneRange()
      var caretPosition
      var tmp = document.createElement('div')
      preCaretRange.selectNodeContents(node)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      tmp.appendChild(preCaretRange.cloneContents())
      caretPosition = tmp.innerHTML.length
      return caretPosition
    },
    // Código cogido de StackOverflow: https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
    getCaretCharacterOffsetWithin (element) {
      var caretOffset = 0
      var doc = element.ownerDocument || element.document
      var win = doc.defaultView || doc.parentWindow
      var sel
      if (typeof win.getSelection !== 'undefined') {
        sel = win.getSelection()
        if (sel.rangeCount > 0) {
          var range = win.getSelection().getRangeAt(0)
          var preCaretRange = range.cloneRange()
          preCaretRange.selectNodeContents(element)
          preCaretRange.setEnd(range.endContainer, range.endOffset)
          caretOffset = preCaretRange.toString().length
        }
      } else if ((sel = doc.selection) && sel.type !== 'Control') {
        var textRange = sel.createRange()
        var preCaretTextRange = doc.body.createTextRange()
        preCaretTextRange.moveToElementText(element)
        preCaretTextRange.setEndPoint('EndToEnd', textRange)
        caretOffset = preCaretTextRange.text.length
      }
      return caretOffset
    } */
  }
}
</script>

<style scoped>
.editme {
  outline: 0px solid transparent;
  cursor: text;
}
</style>
