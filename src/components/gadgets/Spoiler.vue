<template>
  <b-card>
    <div class="d-flex justify-content-start">
      <h6 class="title">Spoiler</h6>
      <b-button class="ml-auto" variant="outline-info" @click="preview = !preview"><b-icon icon="eye"/></b-button>
    </div>
    <div v-show="preview">
      <hr>
      <div class="spoiler" v-html="htmlTextAux"></div>
      <hr>
    </div>
    <span :id="'spoiler' + index" class="editme" v-html="plainTextAux" contenteditable @blur="saveSelection($event)"/>
  </b-card>
</template>

<script>
export default {
  name: 'spoiler',
  props: {
    htmlTextAux: String,
    plainTextAux: String,
    index: Number
  },
  data () {
    return {
      preview: false
    }
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
.spoiler {
  background-color: rgb(61, 61, 61);
  color: rgb(61, 61, 61);
  min-height: 24px;
}
.spoiler:hover {
  color: white;
}
.title {
  font-weight: bold;
}
</style>
