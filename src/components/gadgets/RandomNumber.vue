<template>
  <b-card>
    <h6 class="title">Número aleatorio</h6>
    <br>
    <span style="color: red;" v-if="!valid">No hay más secciones a las que saltar. Este gadget solo calculará el número aleatorio en la lectura</span>
    <b-col>
      <b-row>
        <b-col>
          <span>Límite inferior:</span>
        </b-col>
        <b-col>
        <span>Límite superior:</span>
        </b-col>
      </b-row>
    </b-col>
    <b-col>
      <b-row>
        <b-col>
          <b-form-input v-model="lowerLimit" type="number" placeholder="máximo 4 números" @change="modifyLimits(), modifyChangeNumber(), save()"/>
        </b-col>
        <b-col>
          <b-form-input v-model="upperLimit" type="number" placeholder="máximo 4 números" @change="modifyLimits(), modifyChangeNumber(), save()"/>
        </b-col>
      </b-row>
    </b-col>
    <hr>
    <b-row style="padding-bottom: 10px;">
      <b-col cols="4"><span>Nº de condiciones: {{ numberOfConditions }}</span></b-col>
      <b-col>
        <b-form-input v-if="aux.length > 0" v-model="numberOfConditions" type="range" min="0" max="4" @change="modify(), save()"/>
        <b-form-input v-else disabled v-model="numberOfConditions" type="range" min="0" max="4" @change="modify(), save()"/>
      </b-col>
    </b-row>
    <!-- <span style="color: orange; font-size: 14px;" v-if="numberOfConditions > 0">Aviso: la lectura de condiciones se realiza en orden. Si en la lectura se cumple la primera condición, no se comprueba el resto.</span> -->
    <b-row>
      <!-- <b-col cols="3"><span>Si el resultado es </span></b-col> -->
      <b-col><span>Condición</span></b-col>
      <b-col><span>Valor</span></b-col>
      <b-col><span>Sección</span></b-col>
    </b-row>
    <b-row v-for="(element, index) in conditions" :key="index" style="padding-bottom: 10px">
        <!-- <b-col cols="3"><span>Si el resultado es </span></b-col> -->
        <b-col><b-form-select v-model="element.condition" :options="options" size="sm"/></b-col>
        <b-col><b-form-input v-model="element.number" type="number" size="sm" @change="modifyChangeNumber(), save()"/></b-col>
        <b-col><b-form-select size="sm" @change="save()" v-model="element.section" :options="aux"></b-form-select></b-col>
    </b-row>
    <b-button size="sm" style="width: 150px; heigth:7px; margin-top: 10px; float: right;"  variant="secondary" block @click="preparePreview()">Previsualizar</b-button>

    <b-modal v-model="showPreview" hide-footer hide-header centered >
      <div style="margin-bottom: 15px;">
        <h5>Numero aleatorio</h5>
        <button v-if="!pressedPreview" @click="generateRandomPreview()" >Generar</button>
        <span v-else>El número generado es {{ this.numberPreview }}</span>
      </div>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-ok" class="mt-1" variant="secondary" block @click="showPreview = false">Ok</b-button>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
export default {
  name: 'randomNumber',
  props: {
    actualSection: String,
    auxSectionsData: Array,
    auxConditions: Array,
    auxLowerLimit: Number,
    auxUpperLimit: Number,
    auxNumberOfConditions: Number,
    index: Number
  },
  data () {
    return {
      aux: [],
      conditions: [],
      options: [
        { value: '>', text: 'Mayor' },
        { value: '>=', text: 'Mayor o igual' },
        { value: '<', text: 'Menor' },
        { value: '<=', text: 'Menor o igual' },
        { value: '==', text: 'igual' }
      ],
      numberOfConditions: 0,
      lowerLimit: 0,
      upperLimit: 0,
      valid: true,

      numberPreview: 0,
      pressedPreview: false,
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
    auxConditions: function () {
      this.refresh()
    },
    auxLowerLimit: function () {
      this.refresh()
    },
    auxUpperLimit: function () {
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
      this.conditions = []
      this.numberOfConditions = this.auxNumberOfConditions
      this.lowerLimit = this.auxLowerLimit
      this.lowerLimit = parseInt(this.lowerLimit, 10)
      this.upperLimit = this.auxUpperLimit
      this.upperLimit = parseInt(this.upperLimit, 10)
      this.valid = false
      // Es necesario hacer el deep clone en cada refresh
      this.deepClone()
      this.checkContent()
      this.hardRefresh()
    },
    hardRefresh () {
      var splice = false
      var iSplice = -1
      if (this.conditions.length === 0 && this.auxSectionsData.length === 1) this.aux = []
      for (var j = 0; j < this.conditions.length; ++j) {
        var end = false
        for (var i = 0; i < this.aux.length && !end; ++i) {
          if (this.aux[i].value === this.actualSection) {
            if (i === 0 && this.aux[i].value === this.conditions[j].section && this.aux.length > 1) {
              this.conditions[j].section = this.aux[1].value
            }
            splice = true
            iSplice = i
            end = true
          }
        }
      }
      if (this.aux.length > 1) this.valid = true
      if (splice) this.aux.splice(iSplice, 1)
    },
    modifyLimits () {
      // El range devuelve Strings. Parseamos a enteros
      this.lowerLimit = parseInt(this.lowerLimit, 10)
      this.upperLimit = parseInt(this.upperLimit, 10)

      // Si la expresión introducida es incorrecta, ponemos el límite corresponiente a 0
      if (isNaN(this.lowerLimit)) this.lowerLimit = 0
      else if (isNaN(this.upperLimit)) this.upperLimit = 0

      // Evitamos que los límites se salgan de los rangos
      if (this.lowerLimit < -9999) this.lowerLimit = -9999
      else if (this.lowerLimit > 9999) this.lowerLimit = 9999
      if (this.upperLimit < -9999) this.upperLimit = -9999
      else if (this.upperLimit > 9999) this.upperLimit = 9999

      // Si el límite superior es menor que el inferior, cambiamos las posiciones
      if (this.upperLimit < this.lowerLimit) {
        var aux = this.lowerLimit
        this.lowerLimit = this.upperLimit
        this.upperLimit = aux
      }
    },
    modifyChangeNumber () {
      for (var i = 0; i < this.conditions.length; ++i) {
        // Nos aseguramos que el número de la condición siempre se quede entre los valores mínimo y máximo
        this.conditions[i].number = parseInt(this.conditions[i].number, 10)
        if (isNaN(this.conditions[i].number)) this.conditions[i].number = this.lowerLimit
        else if (this.conditions[i].number < this.lowerLimit) this.conditions[i].number = this.lowerLimit
        else if (this.conditions[i].number > this.upperLimit) this.conditions[i].number = this.upperLimit
      }
    },
    modify () {
      this.numberOfConditions = parseInt(this.numberOfConditions, 10)
      if (this.numberOfConditions > this.conditions.length) {
        for (var i = this.conditions.length; i < this.numberOfConditions; ++i) {
          this.conditions.push({ condition: '>', number: this.lowerLimit, section: this.aux[0].value })
        }
      } else if (this.numberOfConditions < this.conditions.length) {
        for (var j = this.conditions.length; j > this.numberOfConditions; --j) {
          this.conditions.pop()
        }
      }
      this.numberOfConditions = this.conditions.length
      this.hardRefresh()
    },
    deepClone () {
      // NO se pueden asignar props directamente a data, porque copian la dirección del padre
      // Es necesario copiarlos de otra forma. Se puede hacer como { ...prop }, pero para el b-form-select está en deshuso
      // En este caso es necesario realizar la copia manualmente
      for (var i = 0; i < this.auxSectionsData.length; ++i) {
        this.aux.push(this.auxSectionsData[i])
      }
      for (var j = 0; j < this.auxConditions.length; ++j) {
        this.conditions.push(this.auxConditions[j])
      }
    },
    checkContent () {
      for (var j = 0; j < this.conditions.length; ++j) {
        if ((this.conditions[j].section === '' || this.conditions[j].section === undefined) && this.auxSectionsData.length > 1) this.conditions[j].section = this.auxSectionsData[0].value
        else {
          var quit = false
          for (var i = 0; i < this.aux.length && !quit; ++i) {
            if (this.conditions[j].section === this.aux[i].value) quit = true
          }
          if (!quit && this.auxSectionsData.length > 1) this.conditions[j].section = this.auxSectionsData[0].value
          else if (!quit) this.conditions[j].section = ''
        }
      }
    },
    save () {
      this.lowerLimit = parseInt(this.lowerLimit, 10)
      this.upperLimit = parseInt(this.upperLimit, 10)
      this.numberOfConditions = parseInt(this.numberOfConditions, 10)
      this.$emit('random', this.conditions, this.numberOfConditions, this.lowerLimit, this.upperLimit, this.index)
    },
    preparePreview () {
      this.numberPreview = 0
      this.pressedPreview = false
      this.showPreview = true
    },
    generateRandomPreview () {
      this.numberPreview = Math.floor(Math.random() * (parseInt(this.upperLimit, 10) - parseInt(this.lowerLimit, 10) + 1) + parseInt(this.lowerLimit, 10))
      this.numberPreview = parseInt(this.numberPreview, 10) // Hacemos un parseInt por si acaso
      this.pressedPreview = true
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
