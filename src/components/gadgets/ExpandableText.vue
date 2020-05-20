<template>
  <div>
    <b-card>
      <div class="d-flex justify-content-start">
        <h6 class="title">Edite su texto expandible</h6>
        <b-button style="font-size: 16px;" class="ml-auto" variant="outline-info" v-b-tooltip.hover title="Previsualizar gadget" @click="preview = !preview"><b-icon icon="eye"/></b-button>
      </div>
      <div v-show="preview">
        <hr>
        <p @click="show = !show" style="cursor: pointer;">{{ mainText }} <b-icon v-if="!show" icon="caret-down-fill"/><b-icon v-else icon="caret-up-fill"/></p>
        <p class="container" v-show="show">{{expandedText}}</p>
        <hr>
      </div>
      <b-container fluid class="col">
        <label>Texto principal</label>
        <b-form-textarea
          v-model="mainText"
          :state="mainText.length <= 2000 && mainText.length > 0"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que quieres que se muestre..."
          rows="3"
          max-rows="6"
          :formatter="limit"
          @change="save()"
        ></b-form-textarea>
        <span v-if="mainText.length > 1900" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.mainText.length}} /2000</span>
        <b-form-invalid-feedback v-else-if="mainText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
      <b-container fluid class="col">
        <label>Texto expandible</label>
        <b-form-textarea
          v-model="expandedText"
          :state="expandedText.length <= 2000 && expandedText.length > 0"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que se mostrara al expandir..."
          rows="3"
          max-rows="6"
          :formatter="limit"
          @change="save()"
        ></b-form-textarea>
        <span v-if="expandedText.length > 1900" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.expandedText.length}} /2000</span>
        <b-form-invalid-feedback v-else-if="expandedText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'expandableText',
  props: {
    mainTextAux: String,
    expandedTextAux: String,
    index: Number,
    lastPressed: Number
  },
  data () {
    return {
      mainText: this.mainTextAux,
      expandedText: this.expandedTextAux,
      show: false,
      preview: false
    }
  },
  watch: {
    mainTextAux: function () {
      this.refresh()
    },
    expandedTextAux: function () {
      this.refresh()
    },
    index: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.mainText = this.mainTextAux
      this.expandedText = this.expandedTextAux
    },
    save: async function () {
      this.$emit('html', this.mainText, this.expandedText, this.index)
    },
    limit (value) {
      return String(value).substring(0, 2000)
    }
  }
}
</script>

<style scoped>
.container {
  vertical-align: top;
  height: auto !important;
  background-color: #dfdfdf;
  border-radius: 5px;
}
.title {
  font-weight: bold;
}
</style>
