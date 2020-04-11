<template>
  <b-modal id="bv-modal-example" size="sm" hide-header hide-footer centered @hide="noClosing">
    <div style="text-align:center;">
      <h1>Cargando</h1>
      <b-spinner label="Spinning"/>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'loadingModal',
  mounted () {
    this.$bvModal.show('bv-modal-example')
  },
  methods: {
    noClosing (evt) {
      evt.preventDefault()
    }
  }
}
</script>
