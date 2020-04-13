<template>
  <div class="border">
    <h6 class="title">Repetición de sección</h6>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="3"><span>Texto (opcional): </span></b-col>
      <b-col>
        <b-form-input size="sm" v-if="text.length>2000" :state="false" @blur="save()" v-model="text" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
        <b-form-input size="sm" v-else @blur="save()" v-model="text" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
      </b-col>
    </b-row>
    <span>La sección que se va a repetir es {{ actualSection }} - {{ sectionName }}.</span>
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
      text: this.textAux
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
    }
  }
}
</script>

<style scoped>
.border {
  padding: 10px;
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
