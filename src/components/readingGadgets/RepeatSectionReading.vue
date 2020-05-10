<template>
  <div class="d-flex justify-content-start">
    <span class="clickable" v-html="htmlText" @click="change()"/>
    <span>
      <b-icon class="h4 clickable" variant="info" style="margin-left: 10px;" v-if="htmlText.length !== 13" icon="arrow-repeat" @click="change()"/>
      <b-icon class="h4 clickable" variant="info" v-else icon="arrow-repeat" @click="change()"/>
    </span>
  </div>
</template>

<script>
export default {
  name: 'repeatSectionReading',
  props: {
    htmlText: String,
    actual: String
  },
  methods: {
    change () {
      this.$emit('change', this.actual)
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
</style>
