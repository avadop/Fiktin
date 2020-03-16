<template>
  <div class="viewLibrary">
    <button class="buttonBack" @click="goBack()">Atrás</button>
    <h1>Patatillas con chorizo ricas ricas</h1>
    <h1>{{ book }}</h1>
  </div>
</template>

<script>
export default {
  name: 'editBook',
  props: {
    book: Object
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.viewLibrary {
  text-align: justify;
  margin-left: 30px;
}
.buttonBack {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
}
</style>
