<template>
  <b-card>
    <div class="d-flex justify-content-start">
      <h6 class="title">Completar la secuencia</h6>
      <b-button style="font-size: 16px;" class="ml-auto" variant="outline-info" v-b-tooltip.hover title="Previsualizar gadget" @click="preparePreview()"><b-icon icon="eye"/></b-button>
    </div>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget solo mostrará la secuencia en la lectura</span>
    <br>
    <b-row class="right">
      <b-col cols="5"><span>Cambio de sección al acertar: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="rightSection" :options="aux"></b-form-select></b-col>
    </b-row>
    <b-row class="right" style="padding-left: 10px">
      <b-button style="font-size: 14px;" variant="outline-dark" size="sm" v-if="!changeSectionWhenWrong" @click="wrong(), save()">Cambiar de sección al fallar</b-button>
      <b-button style="font-size: 14px;" variant="outline-dark" size="sm" v-else @click="wrong(), save()">Continuar lectura al fallar</b-button>
      <b-col v-if="changeSectionWhenWrong" style="padding-top: 5px;"><b-form-select size="sm" @change="save()" v-model="wrongSection" :options="aux"></b-form-select></b-col>
    </b-row>
    <hr>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Nº de intentos: {{ numberOfTries }}</span></b-col>
      <b-col>
        <b-form-input v-if="aux.length > 0" v-model="numberOfTries" type="range" min="1" max="10" @change="save()"/>
        <b-form-input v-else disabled v-model="numberOfTries" type="range" min="1" max="10" @change="save()"/>
      </b-col>
    </b-row>
    <hr>
    <div>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="6"><span>Nº de campos dados: {{ sequence.length }}</span></b-col>
        <b-col>
          <b-form-input v-model="numberOfSequence" type="range" min="1" max="8" @change="modifySequence(), save()"/>
        </b-col>
      </b-row>
      <b-row v-for="(element, index) in sequence" :key="index" style="padding-bottom: 10px;">
        <b-col cols="3"><span>Elemento {{ index + 1 }}: </span></b-col>
        <b-col><b-form-input v-model="element.text" size="sm" :formatter="limit" placeholder="Texto dado máximo de 20 caracteres" @blur="save()"/></b-col>
      </b-row>
    </div>
    <hr>
    <div>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="6"><span>Nº de campos a solucionar: {{ solution.length }}</span></b-col>
        <b-col>
          <b-form-input v-model="numberOfSolution" type="range" min="1" max="5" @change="modifySolution(), save()"/>
        </b-col>
      </b-row>
      <b-row v-for="(element, index) in solution" :key="index" style="padding-bottom: 10px;">
        <b-col cols="3"><span>Solución {{ index + 1 }}: </span></b-col>
        <b-col><b-form-input v-model="element.text" size="sm" trim :formatter="limit" placeholder="Solución de máximo de 20 caracteres" @blur="save()"/></b-col>
      </b-row>
    </div>

    <b-modal v-model="showPreview" hide-footer hide-header centered >
      <div style="margin: 10px;">
        <h5>Completa la secuencia: </h5>
        <div class="d-block text-center">
          <div>
            <div class="row">
              <span v-for="(seq, sequenceIndex) in sequence" :key="sequenceIndex" style="margin-right:10px; margin-left: 10px; font-size: 22px;">
                {{ seq.text }}
              </span>
            </div>
            <div class="row">
              <b-form-input v-for="(text, answerIndex) in solution" :key="answerIndex" style="margin-top:5px; margin-right:5px; margin-left: 5px; width: 115px;" v-model="answersPreview[answerIndex]" trim  :formatter="limit" placeholder="Respuesta">
              </b-form-input>
              <b-button style="width: 100px; font-size: 16px;" :disabled="numberOfTriesPreview === 0 || answersPreview.length !== solution.length" variant="primary" block @click="tryPreview()">Probar</b-button>
            </div>
          </div>
          <span v-if="correctPreview === false" style="color: red"> ¡Has fallado! </span>
          <span v-else-if="correctPreview === true" style="color: green"> ¡Has acertado! </span>
          <span> Te quedan {{ numberOfTriesPreview }} intentos</span><br/>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <b-button  style="font-size: 16px;" id="button-modal-ok" class="mt-1" variant="secondary" block @click="showPreview = false, correctPreview = null">Ok</b-button>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
export default {
  name: 'sequence',
  props: {
    actualSection: String,
    auxSectionsData: Array,
    auxSequence: Array,
    auxSolution: Array,
    auxChangeSectionWhenWrong: Boolean,
    auxWrongSection: String,
    auxRightSection: String,
    auxNumberOfTries: Number,
    index: Number
  },
  data () {
    return {
      aux: [],
      sequence: [],
      numberOfSequence: 1,
      solution: [],
      numberOfSolution: 1,
      changeSectionWhenWrong: false,
      wrongSection: '',
      rightSection: '',
      numberOfTries: 1,
      valid: false,

      answersPreview: [],
      numberOfTriesPreview: 0,
      correctPreview: null,
      showPreview: false
    }
  },
  watch: {
    auxSectionsData: function () {
      this.refresh()
    },
    actualSection: function () {
      this.refresh()
    },
    auxSequence: function () {
      this.refresh()
    },
    auxSolution: function () {
      this.refresh()
    },
    auxChangeSectionWhenWrong: function () {
      this.refresh()
    },
    auxWrongSection: function () {
      this.refresh()
    },
    auxRightSection: function () {
      this.refresh()
    },
    auxNumberOfTries: function () {
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
      this.sequence = []
      this.solution = []
      this.changeSectionWhenWrong = this.auxChangeSectionWhenWrong
      this.numberOfTries = this.auxNumberOfTries
      this.wrongSection = this.auxWrongSection
      this.rightSection = this.auxRightSection
      this.valid = false
      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      this.numberOfSequence = this.sequence.length
      this.numberOfSolution = this.solution.length
      this.checkContent()
      this.hardRefresh()
    },
    hardRefresh () {
      var splice = false
      var iSplice = -1
      var end = false
      for (var i = 0; i < this.aux.length && !end; ++i) {
        if (this.aux[i].value === this.actualSection) {
          if (i === 0 && this.aux[i].value === this.wrongSection && this.aux.length > 1) {
            this.wrongSection = this.aux[1].value
          }
          if (i === 0 && this.aux[i].value === this.rightSection && this.aux.length > 1) {
            this.rightSection = this.aux[1].value
          }
          splice = true
          iSplice = i
          end = true
        }
      }
      if (this.aux.length > 1) this.valid = true
      if (splice) this.aux.splice(iSplice, 1)
    },
    modifySequence () {
      this.numberOfSequence = parseInt(this.numberOfSequence, 10)
      if (this.numberOfSequence > this.sequence.length) {
        for (var i = this.sequence.length; i < this.numberOfSequence; ++i) {
          this.sequence.push({ text: '' })
        }
      } else if (this.numberOfSequence < this.sequence.length) {
        for (var j = this.sequence.length; j > this.numberOfSequence; --j) {
          this.sequence.pop()
        }
      }
      this.numberOfSequence = this.sequence.length
      this.hardRefresh()
    },
    modifySolution () {
      this.numberOfSolution = parseInt(this.numberOfSolution, 10)
      if (this.numberOfSolution > this.solution.length) {
        for (var i = this.solution.length; i < this.numberOfSolution; ++i) {
          this.solution.push({ text: '' })
        }
      } else if (this.numberOfSolution < this.solution.length) {
        for (var j = this.solution.length; j > this.numberOfSolution; --j) {
          this.solution.pop()
        }
      }
      this.numberOfSolution = this.solution.length
      this.hardRefresh()
    },
    deepClone () {
      // NO se pueden asignar props directamente a data, porque copian la dirección del padre
      // Es necesario copiarlos de otra forma. Se puede hacer como { ...prop }, pero para el b-form-select está en deshuso
      // En este caso es necesario realizar la copia manualmente
      for (var i = 0; i < this.auxSectionsData.length; ++i) {
        this.aux.push(this.auxSectionsData[i])
      }
      for (var j = 0; j < this.auxSequence.length; ++j) {
        this.sequence.push(this.auxSequence[j])
      }
      for (var k = 0; k < this.auxSolution.length; ++k) {
        this.solution.push(this.auxSolution[k])
      }
    },
    checkContent () {
      if ((this.wrongSection === '' || this.wrongSection === undefined) && this.auxSectionsData.length > 1) this.wrongSection = this.auxSectionsData[0].value
      else {
        var quit = false
        for (var i = 0; i < this.aux.length && !quit; ++i) {
          if (this.wrongSection === this.aux[i].value) quit = true
        }
        if (!quit && this.auxSectionsData.length > 1) this.wrongSection = this.auxSectionsData[0].value
        else if (!quit) this.wrongSection = ''
      }
      if ((this.rightSection === '' || this.rightSection === undefined) && this.auxSectionsData.length > 1) this.rightSection = this.auxSectionsData[0].value
      else {
        var quit2 = false
        for (var j = 0; j < this.aux.length && !quit2; ++j) {
          if (this.rightSection === this.aux[j].value) quit2 = true
        }
        if (!quit2 && this.auxSectionsData.length > 1) this.rightSection = this.auxSectionsData[0].value
        else if (!quit2) this.rightSection = ''
      }
    },
    limit (value) {
      return String(value).substring(0, 20)
    },
    wrong () {
      this.changeSectionWhenWrong = !this.changeSectionWhenWrong
    },
    save () {
      this.numberOfTries = parseInt(this.numberOfTries, 10)
      this.$emit('section', this.sequence, this.solution, this.changeSectionWhenWrong, this.wrongSection, this.rightSection, this.numberOfTries, this.index)
    },
    preparePreview () {
      this.answersPreview = []
      this.numberOfTriesPreview = this.numberOfTries
      this.correctPreview = null
      this.showPreview = true
    },
    tryPreview () {
      if (this.numberOfTriesPreview > 0) {
        this.numberOfTriesPreview--
        var correct = true
        for (var i = 0; i < this.solution.length; ++i) {
          if (this.answersPreview[i] !== this.solution[i].text) correct = false
        }
        if (correct === true) this.correctPreview = true
        else {
          this.correctPreview = false
          this.answersPreview = []
        }
      }
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
.right {
  padding-top: 10px;
}
</style>
