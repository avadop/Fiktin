<template>
  <div class="libros">
    <h3>En esta página podemos acceder a las distintas interacciones con los libros</h3>
    <button @click="crearLibro">Crear libro</button>
    <p v-if="libros.length === 0">Todavia no tienes ningun libro creado. Pulsa <router-link to="/crearLibro">aquí</router-link> para crear uno.</p>
    <p v-else>Tienes {{ libros.length }} libros creados.</p>
<!--     <ul id="listaLibros">
      <li v-for="libro in listaLibros">{{ libro.nombre }}</li>
    </ul> -->
  </div>
</template>

<script>
import router from '../router/index.js'
export default {
  name: 'listaLibros',
  data () {
    return {
      libros: [
        // {
        //   label: 'Chuches',
        //   comprado: false,
        // },
        // {
        //   label: 'Chocolate',
        //   comprado: true,
        // },
        // {
        //   label: 'Patatillas',
        //   comprado: false,
        // },
      ]
    }
  },
  methods: {
    crearLibro: function () {
      router.push('/crearLibro')
    }
  }
}
</script>

<style scoped>
  .login {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 20%;
    cursor: pointer;
  }
  p {
    margin-top:40px;
    font-size: 13px;
  }
  p a {
    text-decoration: inderline;
    cursor: pointer;
  }
</style>
