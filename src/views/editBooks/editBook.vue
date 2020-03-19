<template>
  <div class="editBook">
    <button class="buttonBack" @click="goBack()">Atrás</button>
    <br>
    <div class="h1 mb-2">
      <b-icon icon="type-bold" class="buttonNormal" v-if="boldActive!=1" @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
      <b-icon icon="type-bold" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
      <b-icon icon="type-italic" class="buttonNormal" v-if="italicActive!=1" @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
      <b-icon icon="type-italic" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
      <b-icon icon="type-underline" class="buttonNormal" v-if="underlineActive!=1" @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
      <b-icon icon="type-underline" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
      <b-icon icon="cloud-upload" class="buttonNormalRightBorder">Save</b-icon>
    </div>
    <div class="document">
      <div class="editable" v-for="(text, index) in data" :key="index">
        <Normal v-if="text.component=='Normal'"
        :htmlTextAux="text.htmlText"
        :index="index"
        :boldUse="boldUse"
        :italicUse="italicUse"
        :underlineUse="underlineUse"
        @html="saveHTML"
        @buttons="changeButtons"/>
      </div>
    </div>
  </div>
</template>

<script>
import Normal from '@/components/gadgets/Normal.vue'

export default {
  name: 'editBook',
  components: {
    Normal
  },
  props: {
    book: Object
  },
  data () {
    return {
      boldActive: 0,
      boldUse: false,
      italicActive: 0,
      italicUse: false,
      underlineActive: 0,
      underlineUse: false,
      data: [{
        htmlText: '<b>Bold </b><i>Italiccc </i><u>underline </u><span>plaintext </span>',
        component: 'Normal'
      }]
    }
  },
  methods: {
    onLiveEditComponent (evt, component) {
      evt.preventDefault() // Prevenimos perder el foco del cursor SOLO para estos botones (save no está entre ellos para que funcione todo correctamente)
      if (component === 'Bold') {
        if (this.boldActive <= 0) {
          this.boldActive = 1
          this.boldUse = true
        } else {
          this.boldActive = 0
          this.boldUse = false
        }
      }
      if (component === 'Italic') {
        if (this.italicActive <= 0) {
          this.italicActive = 1
          this.italicUse = true
        } else {
          this.italicActive = 0
          this.italicUse = false
        }
      }
      if (component === 'Underline') {
        if (this.underlineActive <= 0) {
          this.underlineActive = 1
          this.underlineUse = true
        } else {
          this.underlineActive = 0
          this.underlineUse = false
        }
      }
    },
    changeButtons (btn, val) {
      if (btn === 'Bold') {
        if (val > 0 && this.boldActive !== val && this.boldUse === false) {
          this.boldActive = val
          this.boldUse = true
        } else if (val < 0 && this.boldActive !== val && this.boldUse === true) {
          this.boldUse = false
          this.boldActive = val
        }
      }
      if (btn === 'Italic') {
        if (val > 0 && this.italicActive !== val && this.italicUse === false) {
          this.italicActive = val
          this.italicUse = true
        } else if (val < 0 && this.italicActive !== val && this.italicUse === true) {
          this.italicUse = false
          this.italicActive = val
        }
      }
      if (btn === 'Underline') {
        if (val > 0 && this.underlineActive !== val && this.underlineUse === false) {
          this.underlineActive = val
          this.underlineUse = true
        } else if (val < 0 && this.underlineActive !== val && this.underlineUse === true) {
          this.underlineUse = false
          this.underlineActive = val
        }
      }
    },
    saveHTML (htmlText, index) {
      this.data[index].htmlText = htmlText
    },
    goBack () {
      this.$router.replace({ name: 'readBook', params: { book: this.book } })
    }
  }
}
</script>

<style scoped>
.editBook {
  text-align: justify;
  margin-left: 30px;
  background-color: rgb(226, 250, 227);
}
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.editable {
  outline: 0px solid transparent;
  cursor: text;
}
.buttonNormal {
  background-color: rgb(227, 229, 241);
  border-top: 1px solid rgb(189, 189, 189);
  border-bottom: 1px solid rgb(189, 189, 189);
  border-left: 1px solid rgb(189, 189, 189);
}
.buttonPressed {
  background-color: rgb(183, 188, 209);
  border: 1px solid rgb(148, 148, 148);
}
.buttonNormalRightBorder {
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(189, 189, 189);
}
.document {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  border: 1px rgb(168, 168, 168) solid;
  background: white;
}
</style>
