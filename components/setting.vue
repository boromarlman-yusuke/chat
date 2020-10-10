<template>
  <v-layout>
    <v-flex>

      <v-text-field
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="氏名"
        required
      ></v-text-field>
      <v-text-field
        v-model="age"
        :rules="nameRules"
        label="年齢"
        required
      ></v-text-field>
      <v-divider></v-divider>
      <v-btn-toggle
        v-model="selectedGender"
        mandatory
      >
        <v-btn value="男">男</v-btn>
        <v-btn value="男女">男/女</v-btn>
        <v-btn value="女">女</v-btn>
      </v-btn-toggle>
      <v-divider></v-divider>
      <v-select
        v-model="select"
        :items="items"
        :rules="[v => !!v || 'Item is required']"
        label="場所"
        required
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        @click="save"
      >
        Save
      </v-btn>

      <v-snackbar
        v-model="hasSaved"
        :timeout="2000"
        absolute
        bottom
        left
      >
        Your profile has been updated
      </v-snackbar>

    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import firebase from '@/plugins/firebase';
import { getModule } from "vuex-module-decorators";
import IndexState from '@/store/index';

@Component
export default class index extends Vue {
  private selectedGender = "男女";
  private items: string[] = 
  [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4'
  ]

}
</script>
