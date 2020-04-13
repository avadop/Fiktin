<template>
  <div>
     <b-modal id="modal-picture" hide-footer hide-header>
        <div class="d-block text-center">
          <p>¿Está seguro que desea crear el libro con esos datos?</p>
        </div>
        <div class="d-flex justify-content-center">
          <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="cancelar()">Cancelar</b-button>
          <b-button id="button-modal-accept" class="mt-1" variant="primary" block @click="createButton">Confirmar</b-button>
        </div>
      </b-modal>
  </div>
</template>

<script>
export default {
  name: 'pictureGadget',
  props: {
    index: Number
  },
  mounted () {
    this.$bvModal.show('modal-picture')
  },
  methods: {
    saveSelection (evt) {
      var src = evt.target.innerHTML
      var plainText = src
      var htmlText = ('<h3> PICTURE </h3>')
      this.$emit('html', plainText, htmlText, this.index)
    },
    createButton () {
      window.alert('imagen añadida')
      this.$bvModal.hide('modal-picture')
    },
    cancelar () {
      this.$bvModal.hide('modal-picture')
      this.$emit('cancel-picture')
    }
  }
}
</script>

<style scoped>
.editme {
  outline: 0px solid transparent;
  cursor: text;
  display: block;
  min-height: 28px;
}
</style>
