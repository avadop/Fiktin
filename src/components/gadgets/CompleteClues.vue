<template>
  <div class="border">
    <h6 class="title">Completar pistas</h6>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no cambiará de secciones en la lectura en la lectura</span>
    <b-row class="right">
      <b-col cols="5"><span>Cambio de sección al acertar: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="onGuess" :options="aux"></b-form-select></b-col>
    </b-row>
    <div>
      <button v-if="!changeSectionWhenWrong" @click="wrong(), save()">Sin cambio de sección</button>
      <button v-else @click="wrong(), save()">Con cambio de sección</button>
      <span style="padding-left: 10px;">Si marcas esta casilla, cuando no se acierte en la respuesta se irá a la sección por seleccionar</span>
      <b-row v-if="changeSectionWhenWrong">
        <b-col cols="5"><span>Cambio de sección al fallar: </span></b-col>
        <b-col><b-form-select size="sm" @change="save()" v-model="onWrong" :options="aux"></b-form-select></b-col>
      </b-row>
    </div>
    <div>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="4"><span>Número de pistas: {{ cluesNumber }}</span></b-col>
        <b-col>
          <b-form-input v-if="aux.length > 0" v-model="cluesNumber" type="range" min="1" max="5" @change="modifyClues(), save()" @blur="modifyOptions()"/>
        </b-col>
      </b-row>
      <div class="table" v-for="(element, index) in clues" :key="index">
        <b-row>
          <b-col cols="3"><span>pista {{ index + 1 }} con valor: </span></b-col>
          <b-col>
            <b-form-input v-model="element.clue" type="text" size="sm" @change="save()" @blur="modifyOptions()"/>
          </b-col>
        </b-row>
      </div>
    </div>
    <div>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="4"><span>Número de respuestas: {{ answersNumber }}</span></b-col>
        <b-col>
          <b-form-input v-if="aux.length > 0" v-model="answersNumber" type="range" min="1" max="5" @change="modifyAnswers(), save()"/>
        </b-col>
      </b-row>
      <div class="table" v-for="(element, index) in answers" :key="index">
        <b-row>
          <b-col cols="3"><span>Respuesta {{ index + 1 }}: </span></b-col>
          <b-col><b-form-select v-model="element.answer" :options="options" size="sm" @change="save()"/></b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'completeClues',
  props: {
    actualSection: String,
    auxSectionsData: Array,
    auxAnswersNumber: Number,
    auxAnswers: Array,
    auxCluesNumber: Number,
    auxClues: Array,
    auxOnGuess: String,
    auxChangeSectionWhenWrong: Boolean,
    auxOnWrong: String,
    index: Number
  },
  data () {
    return {
      aux: [],
      answersNumber: 1,
      answers: [],
      cluesNumber: 1,
      clues: [],
      onGuess: '',
      changeSectionWhenWrong: false,
      onWrong: '',
      options: [],
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
    auxAnswersNumber: function () {
      this.refresh()
    },
    auxAnswers: function () {
      this.refresh()
    },
    auxCluesNumber: function () {
      this.refresh()
    },
    auxClues: function () {
      this.refresh()
    },
    auxOnGuess: function () {
      this.refresh()
    },
    auxChangeSectionWhenWrong: function () {
      this.refresh()
    },
    auxOnWrong: function () {
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
      this.answers = []
      this.answersNumber = this.auxAnswersNumber
      this.clues = []
      this.cluesNumber = this.auxCluesNumber
      this.onGuess = this.auxOnGuess
      this.changeSectionWhenWrong = this.auxChangeSectionWhenWrong
      this.onWrong = this.auxOnWrong
      this.options = []
      this.valid = false
      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      this.checkContent()
      this.hardRefresh()
    },
    hardRefresh () {
      var splice = false
      var iSplice = -1
      var end = false
      for (var i = 0; i < this.aux.length && !end; ++i) {
        if (this.aux[i].value === this.actualSection) {
          if (i === 0 && this.aux[i].value === this.onWrong && this.aux.length > 1) {
            this.onWrong = this.aux[1].value
          }
          if (i === 0 && this.aux[i].value === this.onGuess && this.aux.length > 1) {
            this.onGuess = this.aux[1].value
          }
          splice = true
          iSplice = i
          end = true
        }
      }
      if (this.aux.length > 1) this.valid = true
      if (splice) this.aux.splice(iSplice, 1)
    },
    modifyAnswers () {
      this.answersNumber = parseInt(this.answersNumber, 10)
      if (this.answersNumber > this.answers.length) {
        for (var i = this.answers.length; i < this.answersNumber; ++i) {
          this.answers.push({ answer: this.clues[0].clue })
        }
      } else if (this.answersNumber < this.answers.length) {
        for (var j = this.answers.length; j > this.answersNumber; --j) {
          this.answers.pop()
        }
      }
      this.answersNumber = this.answers.length
      this.hardRefresh()
    },
    modifyClues () {
      this.cluesNumber = parseInt(this.cluesNumber, 10)
      if (this.cluesNumber > this.clues.length) {
        for (var i = this.clues.length; i < this.cluesNumber; ++i) {
          this.clues.push({ clue: '' })
        }
      } else if (this.cluesNumber < this.clues.length) {
        for (var j = this.clues.length; j > this.cluesNumber; --j) {
          this.clues.pop()
        }
      }
      this.cluesNumber = this.clues.length
      this.modifyOptions()
      this.hardRefresh()
    },
    modifyOptions () {
      this.options = []
      for (var j = 0; j < this.clues.length; ++j) {
        this.options.push({ value: this.clues[j].clue, text: this.clues[j].clue })
      }
      for (var i = 0; i < this.answers.length; ++i) {
        var a = false
        for (var k = 0; k < this.options.length && !a; ++k) {
          if (this.answers[i].answer === this.options[k].value) a = true
        }
        if (!a) this.answers[i].answer = this.options[0].value
      }
    },
    deepClone () {
      // NO se pueden asignar props directamente a data, porque copian la dirección del padre
      // Es necesario copiarlos de otra forma. Se puede hacer como { ...prop }, pero para el b-form-select está en deshuso
      // En este caso es necesario realizar la copia manualmente
      for (var i = 0; i < this.auxSectionsData.length; ++i) {
        this.aux.push(this.auxSectionsData[i])
      }
      for (var j = 0; j < this.auxClues.length; ++j) {
        this.clues.push(this.auxClues[j])
        this.options.push({ value: this.auxClues[j].clue, text: this.auxClues[j].clue })
      }
      for (var k = 0; k < this.auxAnswers.length; ++k) {
        this.answers.push(this.auxAnswers[k])
      }
    },
    checkContent () {
      if ((this.onWrong === '' || this.onWrong === undefined) && this.auxSectionsData.length > 1) this.onWrong = this.auxSectionsData[0].value
      else {
        var quit = false
        for (var i = 0; i < this.aux.length && !quit; ++i) {
          if (this.onWrong === this.aux[i].value) quit = true
        }
        if (!quit && this.auxSectionsData.length > 1) this.onWrong = this.auxSectionsData[0].value
        else if (!quit) this.onWrong = ''
      }
      if ((this.onGuess === '' || this.onGuess === undefined) && this.auxSectionsData.length > 1) this.onGuess = this.auxSectionsData[0].value
      else {
        var quit2 = false
        for (var j = 0; j < this.aux.length && !quit2; ++j) {
          if (this.onGuess === this.aux[j].value) quit2 = true
        }
        if (!quit2 && this.auxSectionsData.length > 1) this.onGuess = this.auxSectionsData[0].value
        else if (!quit2) this.onGuess = ''
      }
    },
    wrong () {
      this.changeSectionWhenWrong = !this.changeSectionWhenWrong
    },
    save () {
      this.answersNumber = parseInt(this.answersNumber, 10)
      this.cluesNumber = parseInt(this.cluesNumber, 10)
      this.numberOfConditions = parseInt(this.numberOfConditions, 10)
      this.$emit('clues', this.answers, this.answersNumber, this.clues, this.cluesNumber, this.onGuess, this.changeSectionWhenWrong, this.onWrong, this.index)
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
