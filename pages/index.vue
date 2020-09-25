<template>
  <v-layout>
    <v-flex>
      <div class="container">
        <p class="title is-1 is-spaced">user: {{ $store.getters.getUserName }}</p>
        <v-btn class="button is-primary is-rounded" @click="login">
          ログイン
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from "vuex-module-decorators";
import firebase from '@/plugins/firebase';
import IndexState from '@/store/index';

@Component
export default class index extends Vue {
  private indexModule = getModule(IndexState, this.$store);

  login() {
    this.indexModule.login();
    this.$router.push('/main');
  }
  
}
</script>
