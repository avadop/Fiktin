<template>
  <div class="new-user">
      <p> Introduce tus datos para crear un usuario </p>
      <label>Nickname</label>
      <br>
      <input v-model="newNick" type="text" placeholder="Maririta26"> <br>
      <label>Nombre</label>
      <br>
      <input v-model="newName" type="text" placeholder="Maria Martinez"> <br>
      <label>Email</label>
      <br>
      <input v-model="newEmail" type="text" placeholder="email@fiktin.com"> <br>
      <label>Contraseña</label>
      <br>
      <input v-model="newPassword" type="text" placeholder="123456"><br>
    <button class="btn"> Crear</button>
  </div>
</template>

<script>
export default {
  name: 'NewUser',
  props: {
    newNick: {
      type: String,
      default: ''
    },
    newName: {
      type: String,
      default: ''
    },
    newEmail: {
      type: String,
      default: ''
    },
    newPassword: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.btn {
    margin: 5px;
}
</style>
