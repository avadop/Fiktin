<template>
  <b contenteditable @input="onLiveEdit($event)" @keydown.delete="onDelete">{{ plainText }}</b>
</template>

<script>
export default {
  name: 'bold',
  props: {
    plainTextAux: String,
    index: Number
  },
  data () {
    return {
      plainText: this.plainTextAux,
      htmlText: ''
    }
  },
  methods: {
    restart () {
      this.htmlText = '<b>'
    },
    onDelete () {
      this.$emit('delete', this.index)
    },
    onLiveEdit (evt) {
      this.restart()
      var src = evt.target.innerHTML
      var plainText2 = src
      this.htmlText = this.htmlText.concat(src)
      this.htmlText = this.htmlText.concat('</b>')
      this.$emit('html', plainText2, this.htmlText, this.index)
    }
  }
}
</script>
