<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-tabs>
        <v-tab>Item One</v-tab>
        <v-tab>Item Two</v-tab>
        <v-tab>Item Three</v-tab>
      </v-tabs>
      <v-card>
        <p>あいう</p>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lsng="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class index extends Vue {

}
</script>
