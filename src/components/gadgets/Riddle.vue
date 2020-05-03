<template>
  <div>
    <b-card>
      <div class="d-flex">
        <h6 class="title">Adivinanza</h6>
      </div>
      <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no se verá al leer el libro</span>
      <br>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="4"><span>Nº de intentos: {{ numberOfTries }}</span></b-col>
        <b-col>
          <b-form-input v-if="aux.length > 0" v-model="numberOfTries" type="range" min="1" max="10" @change="save()"/>
          <b-form-input v-else disabled v-model="numberOfTries" type="range" min="1" max="10" @change="save()"/>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="5"><span>Cambio de sección al acertar: </span></b-col>
        <b-col><b-form-select size="sm" @change="save()" v-model="rightSectionID" :options="aux"></b-form-select></b-col>
      </b-row>
      <b-row class="right" style="padding-left: 10px">
        <b-col cols="5">
          <b-button variant="outline-dark" size="sm" v-if="!changeSectionWhenWrong" @click="changeSectionWhenWrong = true, save()">Cambiar de sección al fallar</b-button>
          <b-button variant="outline-dark" size="sm" v-else @click="noWrongSection()">Continuar lectura al fallar</b-button>
        </b-col>
        <b-col v-if="changeSectionWhenWrong" style="padding-top: 5px;"><b-form-select size="sm" @change="save()" v-model="wrongSectionID" :options="aux"></b-form-select></b-col>
      </b-row>
      <hr>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="2"><span>Pregunta: </span></b-col>
        <b-col>
          <b-form-textarea rows="3" style="margin-bottom: 10px;" @blur="save()" :formatter="formatMaxRiddle" v-model="riddleText" placeholder="Escribe el texto de la adivinanza (max 2000 caracteres)"></b-form-textarea>
          <span v-if="riddleText.length > 1800" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.riddleText.length}} /2000</span>
        </b-col>
      </b-row>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="3"><span>Respuesta: </span></b-col>
        <b-col>
          <b-form-input trim style="margin-bottom: 10px;" @blur="save()" v-model="answerText" :formatter="formatAnswer" placeholder="Escribe la respuesta a tu adivinanza (max 30 caracteres)"></b-form-input>
          <span v-if="answerText.length > 24" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.answerText.length}} /30</span>
        </b-col>
      </b-row>
      <b-button size="sm" style="width: 150px; heigth:7px; margin-top: 10px; float: right;"  variant="secondary" block @click="show = true, numberOfTriesPreview = parseInt(numberOfTries,10)">Previsualizar</b-button>
    </b-card>

    <b-modal v-model="show" hide-footer hide-header centered>
      <div class="d-block text-left">
        <h5 style="margin-bottom: 10px;">Adivinanza</h5>
      </div>
      <div class="d-block text-center">
        <p> {{ riddleText }}</p>
        <div class="d-flex">
          <b-form-input style="margin-top:5px;" v-model="tryText" trim  :formatter="formatAnswer" placeholder="Respuesta"></b-form-input>
          <span v-if="tryText.length > 24" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.tryText.length}} /30</span>
          <b-button style="width: 150px;" :disabled="numberOfTriesPreview === 0" variant="primary" block @click="tryAnswer()">Probar</b-button>
        </div>
        <p>Te quedan {{ numberOfTriesPreview }} intentos</p>
        <p v-if="correctPreview === true" style="font-weight: bold;">¡Enhorabuena! ¡has acertado!</p>
        <p v-if="correctPreview === false" style="font-weight: bold;">Has fallado :(</p>
      </div>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="show = false, correctPreview = null">Ok</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: 'riddle',
  props: {
    actualSection: String,
    auxSectionsData: Array,
    riddleTextAux: String,
    answerTextAux: String,
    rightSectionAux: String,
    wrongSectionAux: String,
    numberOfTriesAux: String,
    changeSectionWhenWrongAux: Boolean,
    index: Number
  },
  data () {
    return {
      aux: [],
      riddleText: this.riddleTextAux,
      answerText: this.answerTextAux,
      tryText: '',
      rightSectionID: this.rightSectionAux,
      wrongSectionID: this.wrongSectionAux,
      numberOfTries: this.numberOfTriesAux,
      valid: true,
      show: false,
      numberOfTriesPreview: 0,
      changeSectionWhenWrong: this.changeSectionWhenWrongAux,
      correctPreview: null
    }
  },
  watch: {
    auxSectionsData: function () {
      this.refresh()
    },
    actualSection: function () {
      this.refresh()
    },
    // Observamos rightSection para cuando queramos cambiar posiciones del array de gadgets
    rightSectionAux: function () {
      this.refresh()
    },
    wrongSectionAux: function () {
      this.refresh()
    },
    // Observamos textAux para cuando queramos cambiar posiciones del array de gadgets
    riddleTextAux: function () {
      this.refresh()
    },
    answerTextAux: function () {
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
      this.rightSectionID = this.rightSectionAux
      this.wrongSectionID = this.wrongSectionAux
      this.riddleText = this.riddleTextAux
      this.answerText = this.answerTextAux

      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      this.checkContent(this.aux)
      var end = false
      for (var i = 0; i < this.aux.length && !end; ++i) {
        if (this.aux[i].value === this.actualSection) {
          if (i === 0 && this.aux[i].value === this.rightSectionID && this.aux.length > 1) {
            this.rightSectionID = this.aux[1].value
          }
          this.aux.splice(i, 1)
          end = true
        }
      }
      if (this.aux.length > 0) this.valid = true
      if (!this.valid) this.rightSectionID = ''
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
      if ((this.rightSectionID === '' || this.rightSectionID === undefined) && this.auxSectionsData.length > 1) this.rightSectionID = this.auxSectionsData[0].value
      else {
        var quit = false
        for (var i = 0; i < aux.length && !quit; ++i) {
          if (this.rightSectionID === aux[i].value) quit = true
        }
        if (!quit && this.auxSectionsData.length > 1) this.rightSectionID = this.auxSectionsData[0].value
        else if (!quit) this.rightSectionID = ''
      }
    },
    save () {
      if (this.wrongSectionID === undefined) this.wrongSectionID = ''
      if (this.rightSectionID === undefined) this.rightSectionID = ''
      this.$emit('section', this.changeSectionWhenWrong, this.riddleText, this.answerText, this.rightSectionID, this.wrongSectionID, this.numberOfTries, this.index)
    },
    tryAnswer () {
      if (this.numberOfTriesPreview > 0) {
        this.numberOfTriesPreview--
        if (this.tryText === this.answerText) this.correctPreview = true
        else this.correctPreview = false
      }
    },
    noWrongSection () {
      this.changeSectionWhenWrong = false
      this.wrongSectionID = ''
      this.save()
    },
    formatMaxRiddle (value) {
      return String(value).substring(0, 2000)
    },
    formatAnswer (value) {
      var answer = String(value).substring(0, 30)
      return answer.toLowerCase()
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

<style>
#button-modal-ok {
  width: 50px;
}
</style>
