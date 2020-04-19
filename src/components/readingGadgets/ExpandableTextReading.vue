<template>
  <div>
    <p @click="show = !show" style="cursor: pointer;">{{ mainText }}</p>
    <p class="container" v-show="show">{{expandedText}}</p>
  </div>
</template>

<script>
export default {
  name: 'expandableTextReading',
  props: {
    mainText: String,
    expandedText: String
  },
  data () {
    return {
      show: false
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
