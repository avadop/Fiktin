<template>
  <div class="home">
    <div id="nav">
      <p> Los siguientes nombres se pueden clicar (aunque no hagan nada) </p>
      <span @click="setOptionToHome"> Home </span>
      <span @click="setOptionToBooks"> Libros </span>
       <span @click="setOptionToLibrary"> Bibliotecas </span>
      <span @click="setOptionToUser"> Usuario </span>
    </div>
    <div v-if="option === 0"></div>
    <div v-if="option === 1"></div>
    <div v-if="option === 2"></div>
    <div v-if="option === 3">
      <User/>
    </div>
  </div>
</template>

<script>

import User from '@/components/User.vue'

export default {
  name: 'start',
  components: {
    User
  },
  props: {
    option: {
      type: Number,
      default: 0
    }
  },

  methods: {
    switchCreate: function () {
      this.create = !this.create
    },
    setOptionToHome: function () {
      this.option = 0
    },
    setOptionToBooks: function () {
      this.option = 1
    },
    setOptionToLibrary: function () {
      this.option = 2
    },
    setOptionToUser: function () {
      this.option = 3
    }
  }
}

</script>
