<template>
  <div class="create" @click.stop >
    <div class="d-flex justify-content-start">
      <h4>Modificar biblioteca</h4>
    </div>
    <b-container class="row">
      <b-container class="col">
        <!-- nombre -->
        <b-container fluid class="row">
          <label>Nombre ({{getNameTam}} / 50)</label>
          <b-form-input
            v-if="name.length===0"
            type="text"
            v-model="name"
            :state="this.name.length > 0 && this.name.length <= 50"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Nombre"
            @keydown.space.prevent @keydown.enter.prevent @input="characterLimitName" @paste="characterLimitName"
          ></b-form-input>
          <b-form-input
            v-else
            type="text"
            v-model="name"
            :state="this.name.length > 0 && this.name.length <= 50"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Nombre"
            @keydown.enter.prevent @input="characterLimitName" @paste="characterLimitName"
          ></b-form-input>
          <b-form-invalid-feedback v-if='this.name.length <= 0' id="input-live-feedback">
            Introduce al menos 1 caracter
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-else id="input-live-feedback">
            Superada longitud máxima de 50 caracteres
          </b-form-invalid-feedback>
        </b-container>
        <br>
        <!-- privacidad -->
        <b-container fluid class="row">
          <label>¿Cómo deseas la privacidad de tu biblioteca?</label>
          <b-form-group>
            <b-form-radio value="public" v-model="privacy"> Pública: La podrá ver todo el mundo</b-form-radio>
            <b-form-radio value="private" v-model="privacy"> Privada: Solo la podrás ver tú</b-form-radio>
          </b-form-group>
        </b-container>
      </b-container>
      <!-- descripcion -->
      <b-container class="col">
        <b-row class="my-1">
          <b-container sm="3">
            <label>Descripción {{getDescriptionTam}} / 300</label>
            <b-form-textarea
              v-if="description.length===0"
              v-model="description"
              placeholder="Descripción"
              rows="3"
              max-rows="6"
              @keydown.space.prevent @keydown.enter.prevent @input="characterLimitDescription" @paste="characterLimitDescription"
            ></b-form-textarea>
            <b-form-textarea
              v-else
              v-model="description"
              :state="description.length <= 300"
              aria-describedby="input-live-help input-live-feedback"
              rows="3"
              max-rows="6"
              @keydown.enter.prevent @input="characterLimitDescription" @paste="characterLimitDescription"
            ></b-form-textarea>
            <b-form-invalid-feedback v-if="description.length >= 300" id="input-live-feedback">
              Superada longitud máxima de 300 caracteres
            </b-form-invalid-feedback>
          </b-container>
        </b-row>
      </b-container>
    </b-container>

    <!-- botones -->
    <div class="d-flex justify-content-end">
      <b-button variant="outline-secondary" @click="cancelButton()">Descartar cambios</b-button>
      <b-button variant="dark" @click="modifyButton()" :disabled="this.name.length <= 0 || checkNames() || !checkDescription()">Guardar</b-button>
    </div>
  </div>
</template>

<script>

import { librariesCollection } from '../firebase.js'
import { store } from '@/store/index.js'

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
    var userNick = store.state.userNick
    librariesCollection.where('nick', '==', userNick).get().then(snapshot => { snapshot.forEach(doc => { if (doc.data().name !== this.nameAux) this.librariesNamesList.push({ name: doc.data().name }) }) })
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
      var userNick = store.state.userNick
      if (this.nameAux !== this.name || this.descriptionAux !== this.description || this.privacyAux !== this.privacy) {
        librariesCollection.doc(this.id).update({
          name: this.name,
          description: this.description,
          privacy: this.privacy,
          nick: userNick
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
.btn-secondary {
    color: #fff;
    background-color: #838c95;
    border-color: #838c95;
}
</style>
