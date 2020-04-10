<template>
  <div class="create" >
    <b-card>
      <div class="d-flex justify-content-start">
        <h4>Crear biblioteca</h4>
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
      <div class="d-flex justify-content-end">
        <b-button variant="outline-secondary" @click="cancelButton()">Cancelar</b-button>
        <b-button variant="dark" @click="modalCreate = true" :disabled="this.name.length <= 0 || checkNames() || !checkDescription()">Crear</b-button>
      </div>

      <b-modal id="modal-create" v-model="modalCreate" hide-footer hide-header>
        <div class="d-block text-center">
          <p>¿Está seguro que desea crear el libro con esos datos?</p>
        </div>
        <div class="d-flex justify-content-center">
          <b-button id="button-modal-return" class="mt-1" variant="outline-secondary" block @click="modalCreate = false">Volver Atrás</b-button>
          <b-button id="button-modal-accept" class="mt-1" variant="primary" block @click="createButton()">Confirmar</b-button>
        </div>
      </b-modal>
    </b-card>
  </div>
</template>

<script>

import { librariesCollection } from '../firebase.js'
import { store } from '@/store/index.js'

export default {
  name: 'CreateLibrary',
  data () {
    return {
      name: '',
      description: '',
      privacy: 'public',
      librariesNamesList: [],
      modalCreate: false
    }
  },
  mounted () {
    var userNick = store.state.userNick
    librariesCollection.where('nick', '==', userNick).get().then(snapshot => { snapshot.forEach(doc => { this.librariesNamesList.push({ name: doc.data().name }) }) })
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
      let nameAux = this.name
      let nameLength = this.name.length
      if (nameAux.length > 50) {
        nameLength -= 50
        this.name = nameAux.slice(0, -nameLength)
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
    async createButton () {
      var userNick = store.state.userNick
      this.modalCreate = false
      await librariesCollection.add({
        name: this.name,
        description: this.description,
        privacy: this.privacy,
        nick: userNick,
        user_id: store.state.userID,
        array_keys: []
      })
      this.$emit('create')
    },
    cancelButton () {
      this.modalCreate = false
      this.$emit('cancel')
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

<style>
#modal-create {
  margin: 40%;
  margin-top: 180px;
  font-size: 20px;
  max-width: 300px;
}
#button-modal-accept {
  width: 100px;
}
#button-modal-return {
  width: 200px;
}
</style>
