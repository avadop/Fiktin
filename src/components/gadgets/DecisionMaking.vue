<template>
  <div class="border">
    <h6 class="title">Toma de decisiones</h6>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no se verá al leer el libro</span>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Número de opciones: {{ numberOfOptions }}</span></b-col>
      <b-col>
        <b-form-input v-if="aux.length > 0" v-model="numberOfOptions" type="range" min="2" max="10" @change="modify(), save()"/>
        <b-form-input v-else disabled v-model="numberOfOptions" type="range" min="2" max="10" @change="modify(), save()"/>
      </b-col>
    </b-row>
    <div class="table" v-for="(element, index) in decisions" :key="index">
      <b-row style="padding-bottom: 10px;">
        <b-col cols="3"><span>Texto (opcional): </span></b-col>
        <b-col>
          <b-form-input size="sm" v-if="element.plainText.length>2000" :state="false" @blur="save()" v-model="element.plainText" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
          <b-form-input size="sm" v-else @blur="save()" v-model="element.plainText" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="5"><span>Sección a la que quieres saltar: </span></b-col>
        <b-col><b-form-select size="sm" @change="save()" v-model="element.action" :options="aux"></b-form-select></b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'decisionMaking',
  props: {
    actualSection: String,
    auxSectionsData: Array,
    auxDecisions: Array,
    auxNumberOfOptions: Number,
    index: Number
  },
  data () {
    return {
      aux: [],
      decisions: [],
      numberOfOptions: 2,
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
    auxNumberOfOptions: function () {
      this.refresh()
    },
    // Observamos textAux para cuando queramos cambiar posiciones del array de gadgets
    auxDecisions: function () {
      this.refresh()
    },
    index: function () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.aux = []
      this.decisions = []
      this.numberOfOptions = this.auxNumberOfOptions
      this.valid = false
      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      this.checkContent()
      this.hardRefresh()
    },
    hardRefresh () {
      var splice = false
      var iSplice = -1
      for (var j = 0; j < this.decisions.length; ++j) {
        var end = false
        for (var i = 0; i < this.aux.length && !end; ++i) {
          if (this.aux[i].value === this.actualSection) {
            if (i === 0 && this.aux[i].value === this.decisions[j].action && this.aux.length > 1) {
              this.decisions[j].action = this.aux[1].value
            }
            splice = true
            iSplice = i
            end = true
          }
        }
        if (this.aux.length > 1) this.valid = true
      }
      if (splice) this.aux.splice(iSplice, 1)
    },
    modify () {
      if (this.numberOfOptions > this.decisions.length) {
        for (var i = this.decisions.length; i < this.numberOfOptions; ++i) {
          this.decisions.push({ plainText: '', htmlText: '<span></span>', choice: 'Section', action: this.aux[0].value })
        }
      } else if (this.numberOfOptions < this.decisions.length) {
        for (var j = this.decisions.length; j > this.numberOfOptions; --j) {
          this.decisions.pop()
        }
      }
      this.numberOfOptions = this.decisions.length
      this.hardRefresh()
    },
    deepClone () {
      // NO se pueden asignar props directamente a data, porque copian la dirección del padre
      // Es necesario copiarlos de otra forma. Se puede hacer como { ...prop }, pero para el b-form-select está en deshuso
      // En este caso es necesario realizar la copia manualmente
      for (var i = 0; i < this.auxSectionsData.length; ++i) {
        this.aux.push(this.auxSectionsData[i])
      }
      for (var j = 0; j < this.auxDecisions.length; ++j) {
        this.decisions.push(this.auxDecisions[j])
      }
    },
    checkContent () {
      for (var j = 0; j < this.decisions.length; ++j) {
        // Si la decisión es un cambio de sección
        if (this.decisions[j].choice === 'Section') {
          if ((this.decisions[j].action === '' || this.decisions[j].action === undefined) && this.auxSectionsData.length > 1) this.decisions[j].action = this.auxSectionsData[0].value
          else {
            var quit = false
            for (var i = 0; i < this.aux.length && !quit; ++i) {
              if (this.decisions[j].action === this.aux[i].value) quit = true
            }
            if (!quit && this.auxSectionsData.length > 1) this.decisions[j].action = this.auxSectionsData[0].value
            else if (!quit) this.decisions[j].action = ''
          }
        }
      }
    },
    save () {
      for (var i = 0; i < this.decisions.length; ++i) {
        var plainText = this.decisions[i].plainText.substring(0, 2000)
        var htmlText = ('<span>' + plainText + '</span>')
        this.decisions[i].htmlText = htmlText
        if (this.decisions[i].action === undefined) this.decisions[i].action = ''
      }
      this.numberOfOptions = parseInt(this.numberOfOptions, 10)
      this.$emit('section', this.decisions, this.numberOfOptions, this.index)
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
.table {
  border: 1px solid rgb(218, 218, 218);
  padding: 10px;
  margin-bottom: 10px;
}
</style>
