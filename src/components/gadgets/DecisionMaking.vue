<template>
  <b-card>
    <h6 class="title">Toma de decisiones</h6>
    <br>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no se verá al leer el libro</span>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Nº de opciones: {{ numberOfOptions }}</span></b-col>
      <b-col>
        <b-form-input v-if="aux.length > 0" v-model="numberOfOptions" type="range" min="2" max="10" @change="modify(), save()"/>
        <b-form-input v-else disabled v-model="numberOfOptions" type="range" min="2" max="10" @change="modify(), save()"/>
      </b-col>
    </b-row>
    <div v-for="(element, index) in decisions" :key="index">
      <hr>
      <b-col>
        <b-row>
          <b-col>
          <span>Texto (opcional): </span>
          </b-col>
          <b-col>
            <span>Sección:</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
          <b-form-input size="sm" style="margin-bottom: 6px;" @blur="save()" v-model="element.plainText" :formatter="formatMaxText" placeholder="Escribe un mensaje si quieres (max 2000 caracteres)"></b-form-input>
          <span v-if="element.plainText.length > 1800" style="color: red;">Estas cerca del limite de caracteres, llevas {{ element.plainText.length }} /2000</span>
          </b-col>
          <b-col>
          <b-form-select size="sm" @change="save()" v-model="element.action" :options="aux"></b-form-select>
          </b-col>
        </b-row>
      </b-col>
    </div>
    <b-button size="sm" style="width: 150px; heigth:7px; margin-top: 10px; float: right;"  variant="secondary" block @click="preparePreview()">Previsualizar</b-button>

    <b-modal v-model="showPreview" hide-footer hide-header centered >
      <h5>Toma de decisiones</h5>
      <div style="margin-bottom: 15px;">
        <b-form-radio-group v-model="selectedPreview" :options="optionsPreview" @change="changePreview" stacked/>
      </div>
      <p v-if="clicked === true" style="padding-left: 15px;">Cambio a seccion: {{ sectionNamePreview }} </p>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="showPreview = false">Ok</b-button>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
import { sectionsCollection } from '@/firebase.js'

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
      valid: true,

      showPreview: false,
      selectedPreview: '',
      sectionNamePreview: '',
      clicked: false,
      optionsPreview: []
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
        var plainText = this.decisions[i].plainText
        var htmlText = ('<span>' + plainText + '</span>')
        this.decisions[i].htmlText = htmlText
        if (this.decisions[i].action === undefined) this.decisions[i].action = ''
      }
      this.numberOfOptions = parseInt(this.numberOfOptions, 10)
      this.$emit('section', this.decisions, this.numberOfOptions, this.index)
    },
    formatMaxText (value) {
      return String(value).substring(0, 2000)
    },
    preparePreview () {
      this.showPreview = true
      this.selectedPreview = ''
      this.sectionNamePreview = ''
      this.clicked = false
      this.optionsPreview = []
      for (var i = 0; i < this.decisions.length; ++i) {
        this.optionsPreview.push({ value: this.decisions[i].action, html: this.decisions[i].htmlText })
      }
    },
    changePreview (value) {
      sectionsCollection.doc(value).get().then(doc => {
        if (doc.exists) {
          this.sectionNamePreview = doc.data().name
        } else {
          this.sectionNamePreview = 'No has seleccionado ninguna seccion'
        }
      })
      this.clicked = true
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
.table {
  border: 1px solid rgb(218, 218, 218);
  padding: 10px;
  margin-bottom: 10px;
}
</style>
