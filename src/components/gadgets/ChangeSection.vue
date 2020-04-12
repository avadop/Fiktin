<template>
  <div class="border">
    <b-row style="padding-bottom: 10px;">
      <b-col cols="3"><span>Texto (opcional): </span></b-col>
      <b-col>
        <b-form-input size="sm" v-if="text.length>2000" :state="false" @blur="save()" v-model="text" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
        <b-form-input size="sm" v-else @blur="save()" v-model="text" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
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
      selectedSectionID: this.selectedSection
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
      this.selectedSectionID = this.selectedSection
      this.text = this.textAux
      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      var end = false
      for (var i = 0; i < this.aux.length && !end; ++i) {
        if (this.aux[i].value === this.actualSection && this.aux.length > 1) {
          if (i === 0 && this.aux[i].value === this.selectedSectionID) {
            this.selectedSectionID = this.aux[1].value
          }
          this.aux.splice(i, 1)
          end = true
        }
      }
    },
    deepClone () {
      // NO se pueden asignar props directamente a data, porque copian la dirección del padre
      // Es necesario copiarlos de otra forma. Se puede hacer como { ...prop }, pero para el b-form-select está en deshuso
      // En este caso es necesario realizar la copia manualmente
      for (var i = 0; i < this.auxSectionsData.length; ++i) {
        this.aux.push(this.auxSectionsData[i])
      }
    },
    save () {
      var plainText = this.text.substring(0, 2000)
      var htmlText = ('<span>' + plainText + '</span>')
      this.$emit('section', htmlText, plainText, this.selectedSectionID, this.index)
    }
  }
}
</script>

<style scoped>
.border {
  padding: 10px;
}
.text {
  display: flex;
}
.selection {
  display: flex;
}
</style>
