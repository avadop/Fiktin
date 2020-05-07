<template>
  <div>
    <b-card>
      <div class="d-flex justify-content-start">
        <h6 class="title">Edite su hipervínculo</h6>
        <b-button class="ml-auto" variant="outline-info" @click="preview = !preview"><b-icon icon="eye"/></b-button>
      </div>
      <div v-show="preview">
        <hr>
        <a :href="hyperlinkText" target="_blank">{{mainText}}</a>
        <hr>
      </div>
      <b-container fluid class="col">
        <label>Hipervínculo</label>
        <b-form-input
          type="text"
          v-model="hyperlinkText"
          :state="hyperlinkText.length >= 3 && hyperlinkText.length <= 200"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="Enlace del hipervínculo"
          @change="save()"
        ></b-form-input>
        <b-form-invalid-feedback v-if="mainText.length >= 200" id="input-live-feedback">
          Superada longitud máxima de 200 caracteres
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
          :formatter="limit"
          @change="save()"
        ></b-form-textarea>
        <span v-if="mainText.length > 900" style="color: red;">Estas cerca del limite de caracteres, llevas {{ this.mainText.length}} /1000</span>
        <b-form-invalid-feedback v-else-if="mainText.length < 0" id="input-live-feedback">
          No se puede dejar este campo vacio
        </b-form-invalid-feedback>
      </b-container>
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
    save: async function () {
      var htmlText = '<a href="' + this.hyperlinkText + '" target="_blank">' + this.mainText + '</a>'
      this.$emit('html', htmlText, this.mainText, this.hyperlinkText, this.index)
    },
    limit (value) {
      return String(value).substring(0, 1000)
    }
  }
}
</script>

<style>
.title {
  font-weight: bold;
}
</style>
