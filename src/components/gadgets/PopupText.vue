<template>
  <div>
    <b-card>
      <div class="d-block text-center">
        <h5>Edite su texto emergente</h5>
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
          v-model="popupText"
          :state="popupText.length <= 1000 && popupText.length > 0"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Introduce el texto que se mostrara al emergentemente..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-form-invalid-feedback v-if="popupText.length >= 1000" id="input-live-feedback">
          Superada longitud máxima de 1000 caracteres
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="popupText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
      <div class="d-flex justify-content-center">
        <b-button variant="outline-secondary" @click="preview = !preview">Previsulizar</b-button>
        <b-button id="button-modal-accept" class="mt-1" variant="dark" block @click="createButton" :disabled="mainText.length > 1000 || mainText.length < 0 || popupText.length > 1000 || popupText.length < 0">Confirmar</b-button>
      </div>
      <b-card v-show="preview">
        <span>{{ mainText }}<span @click="openPopupTextModal = !openPopupTextModal" style="cursor: pointer; color: #0a8df4;"> [...]</span></span>
        <b-modal v-model="openPopupTextModal" hide-footer hide-header>
          <p v-show="openPopupTextModal">{{popupText}}</p>
        </b-modal>
      </b-card>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'popupText',
  props: {
    mainTextAux: String,
    popupTextAux: String,
    index: Number,
    lastPressed: Number
  },
  data () {
    return {
      mainText: this.mainTextAux,
      popupText: this.popupTextAux,
      openPopupTextModal: false,
      preview: false
    }
  },
  watch: {
    mainTextAux: function () {
      this.refresh()
    },
    popupTextAux: function () {
      this.refresh()
    },
    index: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.mainText = this.mainTextAux
      this.popupText = this.popupTextAux
    },
    createButton: async function () {
      this.$emit('html', this.mainText, this.popupText, this.index)
    }
  }
}
</script>
