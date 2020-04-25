<template>
  <div>
    <span>{{ mainText }}<span @click="openPopupTextModal = !openPopupTextModal" style="cursor: pointer; color: #0a8df4;"> [...]</span></span>
    <b-modal v-model="openPopupTextModal" hide-footer hide-header>
        <p>{{popupText}}</p>
        <div v-html="htmlText"/>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'popupTextReading',
  props: {
    mainText: String,
    popupText: String,
    htmlText: String
  },
  data () {
    return {
      openPopupTextModal: false
    }
  }
}
</script>
