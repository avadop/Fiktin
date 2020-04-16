<template>
  <div>
    <div class="border">
      <div class="d-flex">
        <h5 class="title">Adivinanza</h5>
        <b-button style="width: 150px; heigth:7px; align: right"  variant="outline-secondary" block @click="show = true, numberOfTriesPreview = numberOfTries">Preview</b-button>
      </div>
      <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget no se verá al leer el libro</span>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="2"><span>Pregunta: </span></b-col>
        <b-col>
          <b-form-textarea  @blur="save()" v-model="riddleText" placeholder="Escribe el texto de la adivinanza (max 2000 caracteres)"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="2"><span>Respuesta: </span></b-col>
        <b-col>
          <b-form-input  @blur="save()" v-model="answerText" placeholder="Escribe la respuesta a tu adivinanza (max 20 caracteres)"></b-form-input>
        </b-col>
      </b-row>
      <b-row style="padding-bottom: 10px;">
        <b-col cols="4"><span>Número de intentos: {{ numberOfTries }}</span></b-col>
        <b-col>
          <b-form-input v-if="aux.length > 0" v-model="numberOfTries" type="range" min="1" max="10" @change="save()"/>
          <b-form-input v-else disabled v-model="numberOfTries" type="range" min="1" max="10" @change="save()"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="5"><span>Sección a la que quieres saltar si se acierta la respuesta: </span></b-col>
        <b-col><b-form-select size="sm" @change="save()" v-model="rightSectionID" :options="aux"></b-form-select></b-col>
      </b-row><br/>
      <b-row>
        <b-col cols="5"><span>Sección a la que quieres saltar si se falla la respuesta: </span></b-col>
        <b-col><b-form-select size="sm" @change="save()" v-model="wrongSectionID" :options="aux"></b-form-select></b-col>
      </b-row>
    </div>

    <b-modal v-model="show" hide-footer hide-header >
      <div class="d-block text-left">
        <h5>Adivinanza</h5>
      </div>
      <div class="d-block text-center">
        <p> {{ riddleText }}</p>
        <div class="d-flex">
          <b-form-input style="margin-top:5px;" @blur="save()" v-model="answerText" placeholder="Respuesta"></b-form-input>
          <b-button style="width: 150px;" :disabled="numberOfTriesPreview === 0" variant="primary" block @click="tryAnswer()">Probar</b-button>
        </div>
        <p>Te quedan {{ numberOfTriesPreview }} intentos</p>
      </div>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="show = false">Ok</b-button>
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
    selectedSection: String,
    textAux: String,
    index: Number
  },
  data () {
    return {
      aux: [],
      riddleText: this.textAux,
      answerText: this.textAux,
      rightSectionID: this.selectedSection,
      wrongSectionID: this.selectedSection,
      numberOfTries: 1,
      valid: true,
      show: false,
      numberOfTriesPreview: 0
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
      var plainText = this.text.substring(0, 2000)
      var htmlText = ('<span>' + plainText + '</span>')
      if (this.selectedSectionID === undefined) this.selectedSectionID = ''
      this.$emit('section', htmlText, plainText, this.selectedSectionID, this.index)
      this.$emit('save')
    },
    tryAnswer () {
      if (this.numberOfTriesPreview > 0) {
        this.numberOfTriesPreview--
      }
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

<style>
#button-modal-ok {
  width: 50px;
}
</style>
