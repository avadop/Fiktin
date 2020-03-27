<template>
  <div>
    <div class="buttons">
      <button class="buttonBack" @click="goBack()">Atrás</button>
      <h3 class="title">{{ book.title }}</h3>
    </div>
    <div class="editBook">
      <div class="sidebar">
        <h4>Gadgets</h4>
        <span style="color: red;" v-if="data.length==0">No hay gadgets creados. Para editar el documento, agrega uno primero</span>
        <div v-for="(text, index) in data" :key="index">
          <div class="sidebarBlock" v-if="lastPress!==index">
            <span class="marginLeft">Tipo: {{ text.componentName }}</span>
            <div class="h5 lg, verticalLine">
              <b-icon icon="chevron-up" class="marginLeftButton" @mouseup="itemUp(index)">Subir gadget</b-icon>
              <b-icon icon="chevron-down" class="marginLeftButton" @mouseup="itemDown(index)">Bajar gadget</b-icon>
              <b-icon icon="layers" class="marginLeftButton" @mouseup="itemClone(index)">Duplicar gadget</b-icon>
              <b-icon icon="trash-fill" class="marginLeftButton" @mouseup="itemDelete(index)">Eliminar gaget</b-icon>
            </div>
          </div>
          <div class="sidebarBlockSelected" v-else>
            <span class="marginLeft">Tipo: {{ text.componentName }}</span>
            <div class="h5 lg, verticalLine">
              <b-icon icon="chevron-up" class="marginLeftButton" @mouseup="itemUp(index)">Subir gadget</b-icon>
              <b-icon icon="chevron-down" class="marginLeftButton" @mouseup="itemDown(index)">Bajar gadget</b-icon>
              <b-icon icon="layers" class="marginLeftButton" @mouseup="itemClone(index)">Duplicar gadget</b-icon>
              <b-icon icon="trash-fill" class="marginLeftButton" @mouseup="itemDelete(index)">Eliminar gaget</b-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="h3 mb-2, options">
        <div class="normalPanel">
          <span style="font-size: 20px;">Texto normal</span>
          <b-icon icon="plus" class="addGadgetButton" @click="addNormal()">Añadir</b-icon>
          <div class="normalPanelOptions">
            <b-icon icon="type-bold" class="buttonNormal" v-if="boldActive!=1" @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
            <b-icon icon="type-bold" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Bold')">Bold</b-icon>
            <b-icon icon="type-italic" class="buttonNormal" v-if="italicActive!=1" @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
            <b-icon icon="type-italic" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Italic')">Italic</b-icon>
            <b-icon icon="type-underline" class="buttonNormal" v-if="underlineActive!=1" @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
            <b-icon icon="type-underline" class="buttonPressed" v-else @mousedown="onLiveEditComponent($event, 'Underline')">Underline</b-icon>
            <b-icon icon="type-strikethrough" class="buttonNormalRightBorder" v-if="strikeThroughActive!=1" @mousedown="onLiveEditComponent($event, 'StrikeThrough')">strikeThrough</b-icon>
            <b-icon icon="type-strikethrough" class="buttonPressedRightBorder" v-else @mousedown="onLiveEditComponent($event, 'StrikeThrough')">strikeThrough</b-icon>
          </div>
        </div>
        <div class="headerPanel">
          <span style="font-size: 20px;">Título</span>
          <b-icon icon="plus" class="addGadgetButton" @click="addTitle()">Añadir</b-icon>
          <div class="headerPanelOptions">
            <b-icon icon="plus" class="addGadgetButton" @mousedown="addTitle()">Añadir título</b-icon>
          </div>
        </div>
        <b-icon icon="cloud-upload" class="buttonNormalRightBorder" @mousedown="save()">Save</b-icon>
      </div>
      <!--Poniendo el contenteditable, keyup y click aquí, podemos controlar las flechas de una forma muy sencilla-->
      <div @keyup="checkStyles" @click="checkStyles()" @keydown.tab.prevent class="document">
        <div class="editable" v-for="(text, index) in data" :key="index" @click="lastElementPressed(index)">
          <Normal v-if="text.component=='Normal'"
            :htmlTextAux="text.htmlText"
            :index="index"
            :boldUse="boldUse"
            :italicUse="italicUse"
            :underlineUse="underlineUse"
            :strikeThroughUse="strikeThroughUse"
            :lastPress="lastPress"
            @html="saveHTML"
            @delete="checkDelete"/>
          <Header1 v-if="text.component=='Header1'"
            :htmlTextAux="text.htmlText"
            :plainTextAux="text.plainText"
            :index="index"
            @html="savePlaneAndHTML"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Normal from '@/components/gadgets/Normal.vue'
import Header1 from '@/components/gadgets/Header1.vue'

export default {
  name: 'editBook',
  components: {
    Normal,
    Header1
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
      strikeThroughActive: 0,
      strikeThroughUse: false,
      lastPress: -1,
      data: [{
        htmlText: '<b>Bold </b><i>Italiccc </i><u>underline </u>plaintext',
        component: 'Normal',
        componentName: 'Texto normal' }, {
        htmlText: '<b>Bold </b><i>Italiccc </i><u>underline </u>',
        component: 'Normal',
        componentName: 'Texto normal' }, {
        plainText: 'Nooo',
        htmlText: '<h1>Nooo</h1>',
        component: 'Header1',
        componentName: 'Título'
      }]
    }
  },
  methods: {
    itemUp (index) {
      if (index > 0) {
        var aux = this.data[index]
        this.$set(this.data, index, this.data[index - 1])
        this.$set(this.data, index - 1, aux)
      }
    },
    itemDown (index) {
      if (index < this.data.length - 1) {
        var aux = this.data[index]
        this.$set(this.data, index, this.data[index + 1])
        this.$set(this.data, index + 1, aux)
      }
    },
    itemDelete (index) {
      this.data.splice(index, 1)
    },
    itemClone (index) {
      // Debido a problemas de clonaciones, es necesario poner los textos manualmente
      if (this.data[index].component === 'Normal') this.data.splice(index + 1, 0, { htmlText: this.data[index].htmlText, component: 'Normal', componentName: 'Texto normal' })
      else if (this.data[index].component === 'Header1') this.data.splice(index + 1, 0, { plainText: this.data[index].plainText, htmlText: this.data[index].htmlText, component: 'Header1', componentName: 'Título' })
    },
    addNormal () {
      this.data.splice(this.lastPress + 1, 0, { htmlText: '', component: 'Normal', componentName: 'Texto normal' })
    },
    addTitle () {
      this.data.splice(this.lastPress + 1, 0, { plainText: '', htmlText: '<h1></h1>', component: 'Header1', componentName: 'Título' })
    },
    checkStyles () {
      if (document.queryCommandState('Bold')) this.changeButtons('Bold', 1)
      else this.changeButtons('Bold', -1)
      if (document.queryCommandState('Italic')) this.changeButtons('Italic', 1)
      else this.changeButtons('Italic', -1)
      if (document.queryCommandState('Underline')) this.changeButtons('Underline', 1)
      else this.changeButtons('Underline', -1)
      if (document.queryCommandState('StrikeThrough')) this.changeButtons('StrikeThrough', 1)
      else this.changeButtons('StrikeThrough', -1)
    },
    checkDelete (index) {
      this.data.splice(index, 1)
    },
    lastElementPressed (index) {
      this.lastPress = index
    },
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
      if (component === 'StrikeThrough') {
        if (this.strikeThroughActive <= 0) {
          this.strikeThroughActive = 1
          this.strikeThroughUse = true
        } else {
          this.strikeThroughActive = 0
          this.strikeThroughUse = false
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
      if (btn === 'StrikeThrough') {
        if (val > 0 && this.strikeThroughActive !== val && this.strikeThroughUse === false) {
          this.strikeThroughActive = val
          this.strikeThroughUse = true
        } else if (val < 0 && this.strikeThroughActive !== val && this.strikeThroughUse === true) {
          this.strikeThroughUse = false
          this.strikeThroughActive = val
        }
      }
    },
    save () {
      alert('Hay que implementar save')
    },
    saveHTML (htmlText, index) {
      this.data[index].htmlText = htmlText
    },
    savePlaneAndHTML (plainText, htmlText, index) {
      this.data[index].plainText = plainText
      this.data[index].htmlText = htmlText
    },
    goBack () {
      this.$router.replace({ name: 'readBook', params: { book: this.book } })
    }
  }
}
</script>

<style scoped>
/* Botones de la aplicación y no del editor de texto */
.buttons {
  text-align: justify;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
}
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
.title {
  vertical-align: top;
  margin-left: 20px;
  display: inline-block;
}
/* Características principales de la vista */
.editBook {
  text-align: justify;
  margin-left: 30px;
  padding-bottom: 30px;
  background-color: rgb(226, 250, 227);
}
/* Barra lateral izquierda */
.sidebar {
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  width: 250px;
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(129, 129, 129);
  position: fixed;
  overflow: auto;
}
.sidebarBlock {
  border: 1px solid rgb(129, 129, 129);
  margin-bottom: 5px;
}
.sidebarBlockSelected {
  border: 1px solid rgb(87, 87, 87);
  background-color: lightgray;
  margin-bottom: 5px;
}
.verticalLine {
  border-top: 1px solid gray;
  text-align: justify;
  margin-bottom: 0px;
}
.marginLeft {
  margin-left: 5px;
}
.marginLeftButton {
  margin-left: 5px;
  padding: 1px;
}
.marginLeftButton:hover {
  background-color: rgb(205, 207, 218);
}
/* Componentes editables del editor */
.editable {
  outline: 0px solid transparent;
  cursor: text;
  margin-bottom: 15px;
}
/* Cinta de opciones del editor */
.normalPanel {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border-right: 1px solid darkgray;
  border-left: 1px solid darkgray;
}
.normalPanelOptions {
  margin-top: 5px;
  justify-content: center;
  display: flex;
}
.headerPanel {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border-right: 1px solid darkgray;
}
.headerPanelOptions {
  margin-top: 5px;
  justify-content: center;
  display: flex;
}
.addGadgetButton {
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(189, 189, 189);
  padding: 2px;
  margin-left: 25px;
}
.addGadgetButton:hover {
  background-color: rgb(213, 215, 228);
}
.options {
  margin-left: 280px;
  padding-top: 20px;
}
.buttonNormal {
  background-color: rgb(227, 229, 241);
  border-top: 1px solid rgb(189, 189, 189);
  border-bottom: 1px solid rgb(189, 189, 189);
  border-left: 1px solid rgb(189, 189, 189);
  padding: 2px;
}
.buttonNormal:hover {
  background-color: rgb(213, 215, 228);
}
.buttonPressed {
  background-color: rgb(183, 188, 209);
  border: 1px solid rgb(148, 148, 148);
  padding: 2px;
}
.buttonPressed:hover {
  background-color: rgb(194, 196, 206);
}
.buttonNormalRightBorder {
  background-color: rgb(227, 229, 241);
  border: 1px solid rgb(189, 189, 189);
  padding: 2px;
}
.buttonNormalRightBorder:hover {
  background-color: rgb(213, 215, 228);
}
.buttonPressedRightBorder {
  background-color: rgb(183, 188, 209);
  border: 1px solid rgb(148, 148, 148);
  padding: 2px;
}
.buttonPressedRightBorder:hover {
  background-color: rgb(194, 196, 206);
}
/* Documento de texto */
.document {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin-left: 280px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px rgb(168, 168, 168) solid;
  background: white;
}
</style>
