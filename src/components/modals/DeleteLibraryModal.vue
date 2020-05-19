<template>
  <b-modal id="bv-modal-example" title="Eliminar biblioteca" centered @hide="cancelButton" no-close-on-backdrop>
    <span>¿Seguro que deseas eliminar la biblioteca {{ name }}?</span>
    <template v-slot:modal-footer>
      <b-button size="mt-1" variant="primary" @click="cancelButton" style="font-size: 16px;">No</b-button>
      <b-button size="mt-1" variant="outline-danger" @click="deleteButton" style="font-size: 16px;">Sí</b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'deleteLibraryModal',
  props: {
    name: String,
    id: String
  },
  mounted () {
    this.$bvModal.show('bv-modal-example')
  },
  methods: {
    cancelButton () {
      this.$emit('cancel', -1)
    },
    deleteButton () {
      this.$emit('delete', this.id)
    }
  }
}
</script>

<style scoped>

</style>
