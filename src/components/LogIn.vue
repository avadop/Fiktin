<template>
  <div class="log-in">
      <p> Log In </p>
      <label>Nickname</label> <br>
      <input v-model="nick" type="text" placeholder="Maririta26"> <br>
      <label>Contraseña</label> <br>
      <input v-model="password" type="text" placeholder="123456"><br>
    <button class="btn" @click="navigateToUser"> Sign In</button>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  props: {
    nick: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    }
  },
  methods: {
    navigateToUser: function () {
      this.$router.push('/home')
    }
  }
}
</script>

<style>
.btn {
    margin: 5px;
}
</style>
