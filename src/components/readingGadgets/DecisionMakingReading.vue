<template>
  <div style="margin-bottom: 15px;">
    <b-form-radio-group v-model="selected" :options="options" @change="change" stacked/>
  </div>
</template>

<script>
export default {
  name: 'decisionMakingReading',
  props: {
    choices: Array
  },
  data () {
    return {
      selected: '',
      options: []
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.options = []
      for (var i = 0; i < this.choices.length; ++i) {
        this.options.push({ value: this.choices[i].action, html: this.choices[i].htmlText })
      }
    },
    change (value) {
      this.$emit('chose', value)
    }
  }
}
</script>
