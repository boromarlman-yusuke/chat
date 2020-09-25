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
            v-if="isSetting(item)"
          >
          </v-card>

          <v-card
            color="basil"
            flat
            v-if="isNewSend(item)"
          >
            <v-btn-toggle
              v-model="selectedGender"
              mandatory
            >
              <v-btn value="男">男</v-btn>
              <v-btn value="男女">男/女</v-btn>
              <v-btn value="女">女</v-btn>
            </v-btn-toggle>
            <v-textarea
              name="input-7-1"
            ></v-textarea>
             <v-btn color="primary">Primary</v-btn>
          </v-card>
          
          <v-card
            color="basil"
            flat
            v-if="isRecieve(item)"
          >
          </v-card>
        
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from '@/plugins/firebase';
import { getModule } from "vuex-module-decorators";
import IndexState from '@/store/index';

@Component
export default class index extends Vue {
  private indexModule = getModule(IndexState, this.$store);

  private tab: string = "";
  private items = ["設定", "新規", "受信一覧"];
  private text = "あいうえお";

  private name = "";
  private email = "";

  private selectedGender = "男女";

  isSetting(item: string) {
    if(item === "設定") return true;
    return false;
  }

  isNewSend(item: string) {
    if(item === "新規") return true;
    return false;
  }

  isRecieve(item: string) {
    if(item === "受信設定") return true;
    return false;
  }

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
