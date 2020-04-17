<template>
  <div class="border">
    <h6 class="title">Cambio de sección</h6>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no se verá al leer el libro</span>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="3"><span>Texto (opcional): </span></b-col>
      <b-col>
        <b-form-input size="sm" style="margin-bottom: 6px;" @blur="save()" v-model="text" :formatter="formatMaxText" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
        <span v-if="text.length > 1800" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.text.length}} /2000</span>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="5"><span>Sección a la que quieres saltar: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="selectedSectionID" :options="aux"></b-form-select></b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'changeSection',
  props: {
    actualSection: String,
    auxSectionsData: Array,
    selectedSection: String,
    textAux: String,
    index: Number
  },
  data () {
    return {
      aux: [],
      text: this.textAux,
      selectedSectionID: this.selectedSection,
      valid: true
    }
  },
  watch: {
    auxSectionsData: function () {
      this.refresh()
    },
    actualSection: function () {
      this.refresh()
    },
    // Observamos selectedSection para cuando queramos cambiar posiciones del array de gadgets
    selectedSection: function () {
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
      this.aux = []
      this.valid = false
      this.selectedSectionID = this.selectedSection
      this.text = this.textAux
      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      this.checkContent(this.aux)
      var end = false
      for (var i = 0; i < this.aux.length && !end; ++i) {
        if (this.aux[i].value === this.actualSection) {
          if (i === 0 && this.aux[i].value === this.selectedSectionID && this.aux.length > 1) {
            this.selectedSectionID = this.aux[1].value
          }
          this.aux.splice(i, 1)
          end = true
        }
      }
      if (this.aux.length > 0) this.valid = true
      if (!this.valid) this.selectedSectionID = ''
      this.save()
    },
    deepClone () {
      // NO se pueden asignar props directamente a data, porque copian la dirección del padre
      // Es necesario copiarlos de otra forma. Se puede hacer como { ...prop }, pero para el b-form-select está en deshuso
      // En este caso es necesario realizar la copia manualmente
      for (var i = 0; i < this.auxSectionsData.length; ++i) {
        this.aux.push(this.auxSectionsData[i])
      }
    },
    checkContent (aux) {
      if ((this.selectedSectionID === '' || this.selectedSectionID === undefined) && this.auxSectionsData.length > 1) this.selectedSectionID = this.auxSectionsData[0].value
      else {
        var quit = false
        for (var i = 0; i < aux.length && !quit; ++i) {
          if (this.selectedSectionID === aux[i].value) quit = true
        }
        if (!quit && this.auxSectionsData.length > 1) this.selectedSectionID = this.auxSectionsData[0].value
        else if (!quit) this.selectedSectionID = ''
      }
    },
    save () {
      var plainText = this.text
      var htmlText = ('<span>' + plainText + '</span>')
      if (this.selectedSectionID === undefined) this.selectedSectionID = ''
      this.$emit('section', htmlText, plainText, this.selectedSectionID, this.index)
      this.$emit('save')
    },
    formatMaxText (value) {
      return String(value).substring(0, 2000)
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
