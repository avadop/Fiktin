<template>
  <div class="create" >
    <span> Título del libro </span>
    <input v-model="title" class="model" placeholder="Título del libro"/>
    <br><br>
    <span>¿Cuál quiere que sea el nombre que aparezca como autor?</span>
    <br>
    <input type="radio" id="nombre" value="Nombre" v-model="author">
    <label for="one"> Nombre de usuario</label>
    <br>
    <input type="radio" id="nick" value="Nick" v-model="author">
    <label for="two"> Nickname</label>
    <br><br>
    <span>Seleccione las etiquetas con las que identifique su obra</span>
    <br>
    <input type="checkbox" id="accionAventura" value="AccionAventura" v-model="etiquetas">
    <label for="checkbox"> Acción y aventura</label>
    <br>
    <input type="checkbox" id="cienciaFiccion" value="CienciaFiccion" v-model="etiquetas">
    <label for="checkbox"> Ciencia ficción</label>
    <br>
    <input type="checkbox" id="comedia" value="Comedia" v-model="etiquetas">
    <label for="checkbox"> Comedia</label>
    <br>
    <input type="checkbox" id="crimen" value="Crimen" v-model="etiquetas">
    <label for="checkbox"> Crimen</label>
    <br>
    <input type="checkbox" id="drama" value="Drama" v-model="etiquetas">
    <label for="checkbox"> Drama</label>
    <br>
    <input type="checkbox" id="fantasia" value="Fantasia" v-model="etiquetas">
    <label for="checkbox"> Fantasia</label>
    <br><br>
    <textarea class="model" v-model="description" placeholder="Descripción"/>
    <br><br>
    <span>Seleccione una imagen como portada</span>
    <br>
    <input type="file" name="portada" @change="onFileSelected">
    <br><br>
    <button @click="createButton()" :disabled="this.title.length <= 0">Crear</button>
    <button @click="cancelButton()">Cancelar</button>
  </div>
</template>

<script>
export default {
  name: 'CreateLibro',
  data () {
    return {
      title: '',
      author: 'Nombre',
      etiquetas: [],
      description: '',
      portada: null
    }
  },
  computed: {
    getTitleTam () {
      return this.title.length
    },
    getDescriptionTam () {
      return this.description.length
    }
  },
  methods: {
    characterLimitTitle () {
      let titleAux = this.title
      let titleLength = this.title.length
      if (titleAux.length > 20) {
        titleLength -= 20
        this.title = titleAux.slice(0, -titleLength)
      }
    },
    characterLimitDescription () {
      let descAux = this.description
      let descLength = this.description.length
      if (descAux.length > 200) {
        descLength -= 200
        this.description = descAux.slice(0, -descLength)
      }
    },
    // checkTitles () {
    //   let coincidence = false
    //   // Comprobamos si el usuario ya tiene una biblioteca con este nombre
    //   for (let i = 0; i < this.librariesTitlesList.length; ++i) {
    //     if (this.title === this.librariesTitlesList[i]) {
    //       coincidence = true
    //       break
    //     }
    //   }
    //   // Comprobamos si tiene espacios al final
    //   if (!coincidence) {
    //     if (this.title[this.title.length - 1] === ' ') coincidence = true
    //   }
    //   return coincidence
    // },
    createButton () {
      this.$emit('create', this.title, this.author, this.etiquetas, this.description, this.imagen)
    },
    cancelButton () {
      this.$emit('cancel')
    },
    onFileSelected (event) {
      this.portada = event.target.files[0]
    }
  }
}
</script>

<style scoped>
.create {
  padding: 10px;
}

.frame {
  background-color: beige;
  border: 1px solid lightpink;
}
</style>
