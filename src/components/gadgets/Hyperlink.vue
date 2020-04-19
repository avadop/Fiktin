<template>
  <div>
    <b-card>
      <div class="d-block text-center">
        <h5>Edite su hipervínculo</h5>
      </div>
      <b-container fluid class="col">
        <label>Hipervínculo</label>
        <b-form-input
          type="text"
          v-model="hyperlinkText"
          :state="hyperlinkText.length >= 3 && hyperlinkText.length <= 100"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Enlace del hipervínculo"
        ></b-form-input>
        <b-form-invalid-feedback v-if="mainText.length >= 100" id="input-live-feedback">
          Superada longitud máxima de 100 caracteres
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="mainText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
      <b-container fluid class="col">
        <label>Texto principal</label>
        <b-form-textarea
          v-model="mainText"
          :state="mainText.length <= 1000 && mainText.length > 0"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que se mostrará..."
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
      <div class="d-flex justify-content-center">
        <b-button variant="outline-secondary" @click="preview = !preview">Previsulizar</b-button>
        <b-button id="button-modal-accept" class="mt-1" variant="dark" block @click="createButton" :disabled="hyperlinkText.length > 100 || hyperlinkText.length < 0 || mainText.length > 1000 || mainText.length < 0">Confirmar</b-button>
      </div>
      <b-card v-show="preview">
        <h5>Previsualización</h5>
        <a :href="hyperlinkText" target="_blank">{{mainText}}</a>
      </b-card>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'hyperlinkText',
  props: {
    mainTextAux: String,
    hyperlinkTextAux: String,
    index: Number,
    lastPressed: Number
  },
  data () {
    return {
      mainText: this.mainTextAux,
      hyperlinkText: this.hyperlinkTextAux,
      preview: false
    }
  },
  watch: {
    mainTextAux: function () {
      this.refresh()
    },
    hyperlinkTextAux: function () {
      this.refresh()
    },
    index: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.mainText = this.mainTextAux
      this.hyperlinkText = this.hyperlinkTextAux
    },
    createButton: async function () {
      this.$emit('html', this.mainText, this.hyperlinkText, this.index)
    }
  }
}
</script>
