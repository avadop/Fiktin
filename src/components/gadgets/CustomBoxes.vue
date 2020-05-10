<template>
  <b-card>
    <h6 class="title">Casilla personalizada</h6>
    <br>
    <span v-if="!validName" style="color: red;">Aviso: Si el nombre de la casilla no es válido, no se verá en la lectura</span>
    <b-form-group>
      <span>Uso de la casilla: </span>
      <b-form-radio-group id="radio-modes" v-if="aux.length > 0" v-model="mode" :options="modeOptions" buttons button-variant="outline-primary" size="sm" @change="checkMode"/>
      <b-form-radio-group id="radio-modes" v-else v-model="mode" :options="modeOptionsDisabled" buttons button-variant="outline-primary" size="sm" @change="checkMode"/>
    </b-form-group>
    <hr>
    <div v-if="mode == 'read'">
      <b-row style="margin-bottom: 5px;">
        <b-col cols=4><span>Texto anterior: </span></b-col>
        <b-col><b-form-textarea v-model="prevText" rows="3" no-resize placeholder="Texto anterior (opcional)" :formatter="formatText" @blur.native="save"/></b-col>
      </b-row>
      <b-row style="margin-bottom: 5px;">
        <b-col cols=4><span>Leer de casilla: </span></b-col>
        <b-col><b-form-select id="select-read" v-model="name" :options="aux" @change="save"/></b-col>
      </b-row>
      <b-row>
        <b-col cols=4><span>Texto posterior: </span></b-col>
        <b-col><b-form-textarea v-model="nextText" rows="3" no-resize placeholder="Texto posterior (opcional)" :formatter="formatText" @blur="save"/></b-col>
      </b-row>
    </div>
    <div v-else-if="mode == 'write'">
      <b-row style="margin-bottom: 5px;">
        <b-col cols=6><span>Identificador único: </span></b-col>
        <b-col><b-form-input v-model="name" :state="nameState" @input.native="nameStateAux" placeholder="Nombre de la casilla" :formatter="formatName" size="sm" @blur="updateAux"/></b-col>
      </b-row>
      <b-row style="margin-bottom: 5px;">
        <b-col><span>Nombre para la lectura: </span></b-col>
        <b-col><b-form-input v-model="title" type="text" placeholder="Título" :formatter="formatTitle" @blur="save" size="sm"/></b-col>
      </b-row>
      <hr>
      <b-form-group v-if="mode == 'write'">
        <span>Tipo de contenido: </span>
        <b-form-radio-group id="radio-type" v-model="type" :options="typeOptions" buttons button-variant="outline-primary" size="sm" @change="changeType"/>
      </b-form-group>
      <b-row>
        <b-col cols=6>
          <span v-if="type == 'string'">Valor por defecto: </span>
          <span v-else-if="type == 'number'">Valor por defecto: </span>
        </b-col>
        <b-col>
          <b-form-input v-if="type == 'string'" v-model="defaultValue" type="text" placeholder="Texto por defecto" :formatter="formatString" @blur="updateAux" size="sm"/>
          <b-form-input v-else-if="type == 'number'" v-model="defaultValue" type="number" placeholder="Número por defecto" :formatter="formatNumber" @blur="updateAux" size="sm"/>
        </b-col>
      </b-row>
    </div>
    <div v-else-if="mode == 'modifyWrite'">
      <b-row style="margin-bottom: 5px;">
        <b-col cols=4><span>Modificar la casilla: </span></b-col>
        <b-col><b-form-select id="select-read" v-model="name" :options="aux" @change="save"/></b-col>
      </b-row>
      <b-row style="margin-bottom: 5px;">
        <b-col><span>Nombre para la lectura: </span></b-col>
        <b-col><b-form-input v-model="title" type="text" placeholder="Título" :formatter="formatTitle" @blur="save" size="sm"/></b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'customBox',
  props: {
    auxCustomBoxesData: Array,
    auxName: String,
    auxMode: String, // Leer, escribir
    auxType: String, // Número, letras
    auxValue: String,
    auxDefaultValue: String, // Si vacío, 'valor por defecto'
    auxTitle: String,
    auxPrevText: String,
    auxNextText: String,
    index: Number
  },
  data () {
    return {
      aux: [],
      name: '',
      oldName: '', // Usado para buscar en el array de casillas personalizadas del editor
      mode: 'write',
      oldMode: 'write', // Si hacemos blur de los botones, al pulsarlos de nuevo se ejecutan las funciones asociadas a ellos, por lo que es necesario controlarlo, que es de lo que se encarga esta variable
      modeOptions: [{ value: 'read', text: 'Leer' }, { value: 'write', text: 'Escribir' }, { value: 'modifyWrite', text: 'Modificar escribir' }],
      modeOptionsDisabled: [{ value: 'read', text: 'Leer', disabled: true }, { value: 'write', text: 'Escribir' }, { value: 'modifyWrite', text: 'Modificar escribir', disabled: true }],
      type: 'string',
      oldType: 'string', // Si hacemos blur de los botones, al pulsarlos de nuevo se ejecutan las funciones asociadas a ellos, por lo que es necesario controlarlo, que es de lo que se encarga esta variable
      typeOptions: [{ value: 'string', text: 'Texto' }, { value: 'number', text: 'Número' }],
      value: '',
      defaultValue: '',
      title: '',
      prevText: '',
      nextText: '',
      validName: true
    }
  },
  watch: {
    auxCustomBoxesData () {
      this.refresh()
    },
    auxName () {
      this.refresh()
    },
    auxMode () {
      this.refresh()
    },
    auxType () {
      this.refresh()
    },
    auxValue () {
      this.refresh()
    },
    auxDefaultValue () {
      this.refresh()
    },
    auxTitle () {
      this.refresh()
    },
    auxPrevText () {
      this.refresh()
    },
    auxNextText () {
      this.refresh()
    },
    index () {
      this.refresh()
    }
  },
  computed: {
    nameState () {
      for (var i = 0; i < this.aux.length; ++i) {
        if (this.name === '' || (this.name === this.aux[i].value && this.name !== this.oldName)) return false
      }
      if (this.aux.length === 0 && this.name === '') return false
      return true
    }
  },
  mounted () {
    this.refresh()
    this.nameStateAux()
  },
  methods: {
    refresh () {
      this.aux = []
      this.name = this.auxName
      this.oldName = this.auxName
      this.mode = this.auxMode
      this.oldMode = this.auxMode
      this.type = this.auxType
      this.oldType = this.auxType
      this.value = this.auxValue
      this.defaultValue = this.auxDefaultValue
      this.title = this.auxTitle
      this.prevText = this.auxPrevText
      this.nextText = this.auxNextText
      this.deepClone()
      this.hardRefresh()
      this.nameStateAux()
    },
    hardRefresh () {
      if (this.auxCustomBoxesData.length <= 0 && (this.mode === 'read' || this.mode === 'modifyWrite')) {
        this.name = ''
        this.oldName = ''
        this.mode = 'write'
        this.type = 'string'
        this.value = ''
      } else if (this.auxCustomBoxesData.length > 0 && (this.mode === 'read' || this.mode === 'modifyWrite')) {
        this.oldName = ''
        var change = true
        for (var i = 0; i < this.aux.length && change; ++i) {
          if (this.name === this.aux[i].value) change = false
        }
        if (change) this.name = this.aux[0].value
      }
      this.save()
    },
    deepClone () {
      if (this.mode === 'write') {
        for (var i = 0; i < this.auxCustomBoxesData.length; ++i) {
          if (this.name !== this.auxCustomBoxesData[i].name) this.aux.push({ value: this.auxCustomBoxesData[i].name, text: this.auxCustomBoxesData[i].name })
        }
      } else if (this.mode === 'read' || this.mode === 'modifyWrite') {
        for (var j = 0; j < this.auxCustomBoxesData.length; ++j) {
          this.aux.push({ value: this.auxCustomBoxesData[j].name, text: this.auxCustomBoxesData[j].name })
        }
      }
    },
    nameStateAux () {
      if (this.mode === 'write') {
        for (var i = 0; i < this.aux.length; ++i) {
          if (this.name === '' || (this.name === this.aux[i].value && this.name !== this.oldName)) {
            this.validName = false
            return false
          }
        }
        if (this.aux.length === 0 && this.name === '') {
          this.validName = false
          return false
        }
      }
      this.validName = true
      return true
    },
    checkMode (value) {
      if (value === 'read' && this.oldMode !== 'read') {
        this.validName = true
        this.$emit('read', this.oldName)
        this.value = ''
        this.defaultValue = ''
        this.title = ''
        this.name = this.aux[0].value
        this.prevText = ''
        this.nextText = ''
        this.oldName = ''
        this.mode = 'read'
        this.oldMode = 'read'
        if (this.auxCustomBoxesData.length === 0) {
          this.mode = 'write'
          this.name = ''
          this.type = 'string'
          this.value = ''
          this.defaultValue = ''
          this.validName = false
        }
        this.save()
      } else if (value === 'write' && this.oldMode !== 'write') {
        this.name = ''
        if (this.validName) this.$emit('write', this.name, this.type, this.value, this.defaultValue)
        this.oldName = this.name
        this.type = 'string'
        this.value = ''
        this.defaultValue = ''
        this.title = ''
        this.prevText = ''
        this.nextText = ''
        this.mode = 'write'
        this.oldMode = 'write'
        this.validName = false
        this.save()
      } else if (value === 'modifyWrite' && this.oldMode !== 'modifyWrite') {
        this.validName = true
        this.$emit('read', this.oldName)
        this.value = ''
        this.defaultValue = this.aux[0].defaultValue
        this.title = ''
        this.name = this.aux[0].value
        this.prevText = ''
        this.nextText = ''
        this.oldName = ''
        this.mode = 'modifyWrite'
        this.oldMode = 'modifyWrite'
        if (this.auxCustomBoxesData.length === 0) {
          this.mode = 'write'
          this.name = ''
          this.type = 'string'
          this.value = ''
          this.defaultValue = ''
          this.validName = false
        }
        this.save()
      }
    },
    updateAux () {
      if (this.oldName !== '') {
        this.saveSafe()
        if (this.validName) {
          this.$emit('update', this.oldName, this.name, this.type, this.value, this.defaultValue)
          this.oldName = this.name
        } else this.name = this.oldName
      } else {
        this.saveSafe()
        if (this.validName) {
          this.$emit('write', this.name, this.type, this.value, this.defaultValue)
        } else this.name = this.oldName
      }
      this.nameStateAux()
    },
    changeType (value) {
      if (value === 'string' && this.oldType === 'number') {
        this.defaultValue = ''
        this.oldType = 'string'
      } else if (value === 'number' && this.oldType === 'string') {
        this.defaultValue = 0
        this.oldType = 'number'
      }
      this.saveLimited(value)
      this.$emit('update', this.oldName, this.name, value, this.value, this.defaultValue)
    },
    findValues () {
      var found = false
      for (var i = 0; i < this.auxCustomBoxesData.length && !found; ++i) {
        if (this.auxCustomBoxesData[i].name === this.name) {
          this.defaultValue = this.auxCustomBoxesData[i].defaultValue
          this.type = this.auxCustomBoxesData[i].type
          found = true
        }
      }
    },
    formatName (value) {
      return String(value).substring(0, 20)
    },
    formatString (value) {
      return String(value).substring(0, 30)
    },
    formatNumber (value) {
      if (value === '') return 0
      return parseInt(String(value).substring(0, 4))
    },
    formatTitle (value) {
      return String(value).substring(0, 50)
    },
    formatText (value) {
      return String(value).substring(0, 1000)
    },
    save () {
      if (this.mode === 'modifyWrite') this.findValues()
      else if (this.type === 'number') this.defaultValue = this.defaultValue.toString()
      if (this.title === '') this.title = this.name
      this.$emit('save', this.name, this.mode, this.type, this.value, this.defaultValue, this.title, this.prevText, this.nextText, this.index)
    },
    saveSafe () {
      if (this.type === 'number') this.defaultValue = this.defaultValue.toString()
      if (this.validName) this.$emit('save', this.name, this.mode, this.type, this.value, this.defaultValue, this.title, this.prevText, this.nextText, this.index)
    },
    saveLimited (type) {
      if (type === 'number') this.defaultValue = this.defaultValue.toString()
      this.$emit('saveLimited', this.mode, type, this.value, this.defaultValue, this.index)
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
</style>
