<template>
  <div class="border">
    <h6 class="title">Tarjetas de memoria</h6>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no llevará a ninguna sección al resolver el puzzle</span>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Número de parejas a desvelar: {{ numberOfPairs }}</span></b-col>
      <b-col>
        <b-form-input v-model="numberOfPairs" type="range" min="2" max="12" @change="save()"/>
      </b-col>
    </b-row>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Número de movimientos disponibles: {{ maxNumberOfMoves }}</span></b-col>
      <b-col>
        <b-form-input v-model="maxNumberOfMoves" type="range" :min="numberOfPairs * 2" max="100" @change="save()"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="5"><span>Sección a la que quieres saltar si se resuelve el puzzle: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="sectionSolved" :options="sections"></b-form-select></b-col>
    </b-row><br/>
    <b-row v-if="changeSectionWhenWrong === true">
      <b-col cols="5"><span>Sección a la que quieres saltar si se falla la respuesta: </span></b-col>
      <b-col><b-form-select size="sm" @change="save()" v-model="sectionNoMoreMoves" :options="sections"></b-form-select></b-col>
      <b-button style="width: 20px; margin-right:50px;" class="my-1" variant="danger-dark" @click="noWrongSection()"><b-icon style="heigh:50px;width:50px;" variant="danger" icon="x"></b-icon></b-button>
    </b-row>
    <div v-else>
      <span @click="changeSectionWhenWrong = true, save()" style="color: darkblue; font-weight: bold; cursor: pointer;"> Agregar salto de seccion al quedarse sin movimientos</span>
      <span style="font-size: 13px;"> (En caso de no activar esta opción, si el lector se queda sin movimientos se quedará en la página que está)</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'memoryCards',
  props: {
    actualSection: String,
    sectionsDataAux: Array,
    numberOfPairsAux: Number,
    maxNumberOfMovesAux: Number,
    sectionNoMoreMovesAux: String,
    sectionSolvedAux: String,
    changeSectionWhenWrongAux: Boolean,
    index: Number
  },
  data () {
    return {
      sections: [],
      valid: true,
      numberOfPairs: this.numberOfPairsAux,
      maxNumberOfMoves: this.maxNumberOfMovesAux,
      sectionNoMoreMoves: this.sectionNoMoreMovesAux,
      sectionSolved: this.sectionSolvedAux,
      changeSectionWhenWrong: this.changeSectionWhenWrongAux
    }
  },
  watch: {
    sectionsDataAux: function () {
      this.refresh()
    },
    actualSection: function () {
      this.refresh()
    },
    numberOfPairsAux: function () {
      this.refresh()
    },
    numberOfPairs: function () {
      if (this.maxNumberOfMoves < this.numberOfPairs * 2) this.maxNumberOfMoves = this.numberOfPairs * 2
    },
    maxNumberOfMovesAux: function () {
      this.refresh()
    },
    sectionNoMoreMovesAux: function () {
      this.refresh()
    },
    sectionSolvedAux: function () {
      this.refresh()
    },
    changeSectionWhenWrongAux: function () {
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
      this.sections = []
      this.valid = false
      this.numberOfPairs = this.numberOfPairsAux
      this.maxNumberOfMoves = this.maxNumberOfMovesAux
      this.sectionNoMoreMoves = this.sectionNoMoreMovesAux
      this.sectionSolved = this.sectionSolvedAux
      this.changeSectionWhenWrong = this.changeSectionWhenWrongAux

      this.deepClone()
      this.checkContent()

      var end = false
      for (var i = 0; i < this.sections.length && !end; ++i) {
        if (this.sections[i].value === this.actualSection) {
          if (i === 0 && this.sections[i].value === this.sectionSolved && this.sections.length > 1) {
            this.sectionSolved = this.sections[1].value
          }
          this.sections.splice(i, 1)
          end = true
        }
      }
      if (this.sections.length > 0) this.valid = true
      if (!this.valid) {
        this.sectionSolved = ''
        this.sectionNoMoreMoves = ''
      }
      this.save()
    },
    deepClone () {
      for (var i = 0; i < this.sectionsDataAux.length; ++i) {
        this.sections.push(this.sectionsDataAux[i])
      }
    },
    checkContent () {
      if ((this.sectionNoMoreMoves === '' || this.sectionNoMoreMoves === undefined) && this.sectionsDataAux.length > 1) this.sectionNoMoreMoves = this.sectionsDataAux[0].value
      else {
        var quit = false
        for (var i = 0; i < this.sections.length && !quit; ++i) {
          if (this.sectionNoMoreMoves === this.sections[i].value) quit = true
        }
        if (!quit && this.sectionsDataAux.length > 1) this.sectionNoMoreMoves = this.sectionsDataAux[0].value
        else if (!quit) this.sectionNoMoreMoves = ''
      }
      if ((this.sectionSolved === '' || this.sectionSolved === undefined) && this.sectionsDataAux.length > 1) this.sectionSolved = this.sectionsDataAux[0].value
      else {
        var quit2 = false
        for (var j = 0; j < this.sections.length && !quit2; ++j) {
          if (this.sectionSolved === this.sections[j].value) quit2 = true
        }
        if (!quit2 && this.sectionsDataAux.length > 1) this.sectionSolved = this.sectionsDataAux[0].value
        else if (!quit2) this.sectionSolved = ''
      }
    },
    save () {
      if (this.sectionNoMoreMoves === undefined) this.sectionNoMoreMoves = ''
      if (this.sectionSolved === undefined) this.sectionSolved = ''
      this.$emit('save', parseInt(this.numberOfPairs, 10), parseInt(this.maxNumberOfMoves, 10), this.sectionNoMoreMoves, this.sectionSolved, this.changeSectionWhenWrong, this.index)
    },
    noWrongSection () {
      this.changeSectionWhenWrong = false
      this.sectionNoMoreMoves = ''
      this.save()
    }
  }
}
</script>
