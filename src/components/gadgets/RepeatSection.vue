<template>
  <div class="border">
    <h6 class="title">Repetición de sección</h6>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="3"><span>Texto (opcional): </span></b-col>
      <b-col>
        <b-form-input size="sm" :formatter="limit" @blur="save()" v-model="text" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
      </b-col>
    </b-row>
    <span>La sección que se va a repetir es: {{ sectionName }}.</span>
    <b-button size="sm" style="width: 150px; heigth:7px; margin-top: 10px; float: right;"  variant="secondary" block @click="preparePreview()">Previsualizar</b-button>

    <b-modal v-model="showPreview" hide-footer hide-header centered >
      <h5>Repetir seccion</h5>
      <div class="d-flex justify-content-center">
        <span v-html="htmlTextPreview"/>
        <button style="margin-left: 10px;" v-if="htmlTextPreview.length != 13" @click="clicked = true">Repetir</button>
        <button v-else @click="clicked = true">Repetir</button>
      </div>
      <p v-if="clicked === true" style="padding-left: 15px;">recarga de seccion: {{ sectionName }} </p>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="showPreview = false">Ok</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'changeSection',
  props: {
    actualSection: String,
    sectionName: String,
    textAux: String,
    index: Number
  },
  data () {
    return {
      aux: [],
      text: this.textAux,

      showPreview: false,
      htmlTextPreview: '',
      clicked: false
    }
  },
  watch: {
    actualSection: function () {
      this.refresh()
    },
    // Observamos textAux para cuando queramos cambiar posiciones del array de gadgets
    textAux: function () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.text = this.textAux
    },
    save () {
      var plainText = this.text.substring(0, 2000)
      var htmlText = ('<span>' + plainText + '</span>')
      this.$emit('html', plainText, htmlText, this.index)
    },
    preparePreview () {
      this.showPreview = true
      this.clicked = false
      this.htmlTextPreview = ('<span>' + this.text + '</span>')
    },
    limit (value) {
      return String(value).substring(0, 2000)
    }
  }
}
</script>

<style scoped>
.border {
  padding: 10px;
  padding-bottom: 54px;
}
.title {
  font-weight: bold;
}
.text {
  display: flex;
}
.selection {
  display: flex;
}
</style>
