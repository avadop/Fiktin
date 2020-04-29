<template>
  <div>
    <div v-if="mode == 'read'">
      <span>{{ prevText }}</span>
      <span class="textColor">{{ valueShow }}</span>
      <span>{{ nextText }}</span>
    </div>
    <div v-else-if="mode == 'write'" class="write">
      <div style="margin-bottom: 3px;">
        <span style="font-size: 24px;">{{ title }}: </span>
      </div>
      <b-form-input v-if="type == 'string'" v-model="writeVar" @input.native="updateValue" placeholder="Introduce un texto" :formatter="formatString" size="sm"/>
      <b-form-input v-else-if="type == 'number'" type="number" v-model="writeVar" @input.native="updateValue" placeholder="Introduce número" :formatter="formatNumber" size="sm"/>
      <div style="margin-top: 5px;" v-if="defaultValue.length > 0">
        <span style="font-size: 14px;">Valor por defecto: <span class="textColor">{{ defaultValue }}</span>.</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'customBoxReading',
  props: {
    name: String,
    mode: String,
    type: String,
    value: String,
    defaultValue: String,
    title: String,
    prevText: String,
    nextText: String,
    customBoxes: Array
  },
  data () {
    return {
      valueShow: '',
      writeVar: '',
      index: -1
    }
  },
  watch: {
    customBoxes () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      var end = false
      for (var i = 0; i < this.customBoxes.length && !end; ++i) {
        if (this.name === this.customBoxes[i].name) {
          if (this.mode === 'read') {
            if (this.customBoxes[i].value !== '') this.valueShow = this.customBoxes[i].value
            else this.valueShow = this.customBoxes[i].defaultValue
          }
          this.index = i
          end = true
        }
      }
    },
    formatString (value) {
      return String(value).substring(0, 30)
    },
    formatNumber (value) {
      if (value === '') return 0
      return parseInt(String(value).substring(0, 4))
    },
    updateValue () {
      this.$emit('saveWrite', this.writeVar, this.index)
    }
  }
}
</script>

<style scoped>
.textColor {
  color: blueviolet;
}
.write {
  border: 1px solid gray;
  padding: 10px;
  margin-bottom: 5px;
}
</style>
