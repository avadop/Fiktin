<template>
  <div>
    <p @click="show = !show" style="cursor: pointer;">{{ mainText }} <b-icon v-if="!show" icon="caret-down-fill"/><b-icon v-else icon="caret-up-fill"/></p>
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
