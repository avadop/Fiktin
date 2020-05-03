<template>
  <div>
    <div class="d-flex justify-content-start">
      <span class="clickable" v-html="htmlText" @click="change()"/>
      <span>
        <b-icon class="h4 clickable" variant="info" style="margin-left: 10px;" v-if="htmlText.length !== 13" icon="box-arrow-right" @click="change()"/>
        <b-icon class="h4 clickable" variant="info" v-else icon="box-arrow-right" @click="change()"/>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'changeSectionReading',
  props: {
    htmlText: String,
    next: String
  },
  methods: {
    change () {
      this.$emit('change', this.next)
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
