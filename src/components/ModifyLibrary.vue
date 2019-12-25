<template>
  <div class="create" @click.stop >
    <textarea v-if="name.length===0" class="modelName" :class="{red: name.length===0}" v-model="name" placeholder="Nombre" @keydown.space.prevent @input="characterLimitName" @paste="characterLimitName"/>
    <textarea v-else v-model="name" class="modelName" :class="{red: checkNames()}" placeholder="Nombre" @input="characterLimitName" @paste="characterLimitName"/>
    <span> {{getNameTam}} / 50 </span>
    <br><br>
    <textarea v-if="description.length===0" class="modelDesc" v-model="description" placeholder="Descripción" @keydown.space.prevent @keydown.enter.prevent @input="characterLimitDescription" @paste="characterLimitDescription"/>
    <textarea v-else v-model="description" class="modelDesc" :class="{red: !checkDescription()}" placeholder="Descripción" @keydown.enter.prevent @input="characterLimitDescription" @paste="characterLimitDescription"/>
    <span> {{getDescriptionTam}} / 300</span>
    <br><br>
    <span>¿Cómo deseas la privacidad de tu biblioteca?</span>
    <br>
    <input type="radio" id="public" value="public" v-model="privacy" >
    <label for="uno">Pública: La podrá ver todo el mundo</label>
    <br>
    <input type="radio" id="private" value="private" v-model="privacy">
    <label for="Dos">Privada: Solo la podrás ver tú</label>
    <br><br>
    <button class="button" @click="modifyButton()" :disabled="this.name.length <= 0 || checkNames() || !checkDescription()">Guardar</button>
    <button class="button" @click="cancelButton()">Descartar cambios</button>
  </div>
</template>

<script>

import { librariesCollection } from '../firebase.js'

export default {
  name: 'CreateLibrary',
  props: {
    index: Number,
    nameAux: String,
    descriptionAux: String,
    privacyAux: String,
    id: String
  },
  data () {
    return {
      name: this.nameAux,
      description: this.descriptionAux,
      privacy: this.privacyAux,
      librariesNamesList: []
    }
  },
  mounted () {
    librariesCollection.where('nick', '==', '1').get().then(snapshot => { snapshot.forEach(doc => { if (doc.data().name !== this.nameAux) this.librariesNamesList.push({ name: doc.data().name }) }) })
  },
  computed: {
    getNameTam () {
      return this.name.length
    },
    getDescriptionTam () {
      return this.description.length
    }
  },
  methods: {
    characterLimitName () {
      let nameAux2 = this.name
      let nameLength = this.name.length
      if (nameAux2.length > 50) {
        nameLength -= 50
        this.name = nameAux2.slice(0, -nameLength)
      }
    },
    characterLimitDescription () {
      let descAux = this.description
      let descLength = this.description.length
      if (descAux.length > 300) {
        descLength -= 300
        this.description = descAux.slice(0, -descLength)
      }
    },
    checkNames () {
      let coincidence = false
      // Comprobamos si el usuario ya tiene una biblioteca con este nombre
      for (let i = 0; i < this.librariesNamesList.length; ++i) {
        if (this.name === this.librariesNamesList[i].name) {
          coincidence = true
          break
        }
      }
      // Comprobamos si tiene espacios al final
      if (!coincidence) {
        if (this.name[this.name.length - 1] === ' ') coincidence = true
      }
      return coincidence
    },
    checkDescription () {
      // Comprobamos la longitud
      if (this.description.length > 0) {
        // Comprobamos que no haya espacios al final
        if (this.description[this.description.length - 1] === ' ') return false
        // Comprobamos que no haya intros al pegar un párrafo
        for (let i = 0; i < this.description.length; ++i) {
          if (this.description[i] === '\n') {
            return false
          }
        }
      }
      return true
    },
    modifyButton () {
      if (this.nameAux !== this.name || this.descriptionAux !== this.description || this.privacyAux !== this.privacy) {
        librariesCollection.doc(this.id).update({
          name: this.name,
          description: this.description,
          privacy: this.privacy,
          nick: '1'
        }).then(() => {
          this.$emit('modify')
        })
      } else this.$emit('modify')
    },
    cancelButton () {
      this.$emit('cancel', -1)
    }
  }
}
</script>

<style scoped>
.create {
  padding: 10px;
  cursor: default;
}

.red {
  border-style: solid;
  border-width: 1px;
  border-color: #DE8F8F;
}

.modelName {
  width: 75%;
  height: 15px;
  resize: none;
}

.modelDesc {
  width: 75%;
  height: 75px;
  resize: none;
}

.button {
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid darkgreen;
  margin-right: 5px;
}
</style>
