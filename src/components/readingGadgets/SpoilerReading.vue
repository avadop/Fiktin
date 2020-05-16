<template>
  <div class="spoiler" style="word-wrap: break-word;" v-html="htmlTextAux"/>
</template>

<script>
export default {
  name: 'spoiler',
  props: {
    htmlTextAux: String
  }
}
</script>

<style scoped>
.spoiler {
  background-color: rgb(61, 61, 61);
  color: rgb(61, 61, 61);
  min-height: 24px;
}
.spoiler:hover {
  color: white;
}
</style>
