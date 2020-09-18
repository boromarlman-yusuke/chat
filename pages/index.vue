<template>
  <v-layout>
    <v-flex>
      <v-tabs
        v-model="tab"
        background-color="transparent"
        color="basil"
        grow
      >
        <v-tab
          v-for="item in items"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="item in items"
          :key="item"
        >
          <v-card
            color="basil"
            flat
          >
            <v-card-text>{{ text }}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <label>
        <span>
          お名前:
        </span>
        <input
          type="text"
          v-model="name"
        >
      </label>
      <label>
        <span>
          email:
        </span>
        <input
          type="text"
          v-model="email"
        >
      </label>
      <button
        type="button"
        @click="submit"
      >
        送信
      </button>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from '@/plugins/firebase';

@Component
export default class index extends Vue {

  private tab: string = "";
  private items = ["設定", "新規", "受信一覧"];
  private text = "あいうえお";

  private name = "";
  private email = "";

  submit() {
    const db = firebase.firestore();
    let dbUsers = db.collection('users');
    dbUsers
      .add({
        name: this.name,
        email: this.email,
      })
      .then(ref => {
        console.log('Add ID: ', ref.id)
      })
  }

}
</script>
