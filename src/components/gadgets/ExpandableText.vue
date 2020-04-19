<template>
  <div>
    <b-modal v-if="(this.lastPressed === this.index)" id="modal-video" v-model="openModal" hide-footer hide-header no-close-on-backdrop>
      <div class="d-block text-center">
        <h5>Edite su texto expandible</h5>
      </div>
      <b-container fluid class="col">
        <label>Texto principal</label>
        <b-form-textarea
          v-model="mainText"
          :state="mainText.length <= 1000 && mainText.length > 0"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que quieres que se muestre..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-form-invalid-feedback v-if="mainText.length >= 1000" id="input-live-feedback">
          Superada longitud máxima de 1000 caracteres
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="mainText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
      <b-container fluid class="col">
        <label>Texto expandible</label>
        <b-form-textarea
          v-model="expandedText"
          :state="expandedText.length <= 1000 && expandedText.length > 0"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que se mostrara al expandir..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-form-invalid-feedback v-if="expandedText.length >= 1000" id="input-live-feedback">
          Superada longitud máxima de 1000 caracteres
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="expandedText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
      <div class="d-flex justify-content-center">
        <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="cancel()">Cancelar</b-button>
        <b-button id="button-modal-accept" class="mt-1" variant="dark" block @click="createButton" :disabled="mainText.length > 1000 || mainText.length < 0 || expandedText.length > 1000 || expandedText.length < 0">Confirmar</b-button>
      </div>
    </b-modal>
    <div>
      <p @click="show = !show" style="cursor: pointer;">{{ mainText }}</p>
      <p class="container" v-show="show">{{expandedText}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'expandableText',
  props: {
    mainTextAux: String,
    expandedTextAux: String,
    index: Number,
    openModal: Boolean,
    lastPressed: Number
  },
  data () {
    return {
      mainText: this.mainTextAux,
      expandedText: this.expandedTextAux,
      show: false
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
    createButton: async function () {
      this.$emit('html', this.mainText, this.expandedText, this.index)
    },
    cancel () {
      this.$emit('cancel')
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
</style>
