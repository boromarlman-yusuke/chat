
<template>
  <v-container fluid style="padding: 0;">
    <!-- <div class="chat-container" v-on:scroll="onScroll" ref="chatContainer" > -->
    <div class="chat-container">
      <div class="message" v-for="(message,index) in messages" v-bind:key="index" :class="{own: message.userId == myUserId}">
        <div class="username" v-if="index>0 && messages[index-1].userId != message.userId">{{message.name + "  " + message.timestamp }}</div>
        <div class="username" v-if="index == 0">{{message.name + "  " + message.timestamp }}</div>
        <div style="margin-top: 5px"></div>
          <div class="content">
            <div v-html="message.content"></div>
          </div>
        </div>
      </div>

      <v-textarea
        solo
        label="Solo textarea"
        v-model="content"
      ></v-textarea>
        <!-- <input type="text" placeholder="Type here..." v-on:keyup.enter="sendMessage" v-model="content"> -->
      <v-btn
          depressed
          color="primary"
          @click="createMessage()"
        >送信
      </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import firebase from '@/plugins/firebase';
import { getModule } from "vuex-module-decorators";
import IndexState from '@/store/index';

interface Message {
  userId: string,
  name: string,
  content: string,
  timestamp: string
}


@Component
export default class index extends Vue {
  private indexModule = getModule(IndexState, this.$store);
  private myUserId = this.indexModule.UserUid;
  private messages: Message[] =  [];
  private content: string = "";
  private targetName = "a";
  private myName = "i";

  async created() {
    const db = firebase.firestore();
    await db.collection("contents").doc(this.indexModule.RoomId).collection("messages").orderBy("latestMessageTimeStamp")
      .onSnapshot((querySnapshot) => {
        this.messages = [];
        querySnapshot.forEach((doc) => {
          
          const data = doc.data();
          console.log(data.latestMessageTimeStamp.toDate().toLocaleString("ja"));
          
          this.messages.push({
            userId: data.userId,
            name: data.name,
            content: data.message,
            timestamp: data.latestMessageTimeStamp.toDate().toLocaleString("ja")
          });
        })
      })
  }

  async createMessage() {
    const db = firebase.firestore();
    let dbUsers = db.collection('contents').doc(this.indexModule.RoomId).collection("messages");
    await dbUsers
      .add({
        message: this.content,
        name: this.indexModule.UserName,
        userId: this.indexModule.UserUid,
        latestMessageTimeStamp: firebase.firestore.FieldValue.serverTimestamp()
      })
  }
}
</script>

<style scoped>
.typer{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);
}
.typer input[type=text]{
  position: absolute;
  left: 2.5rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}


.chat-container{
  box-sizing: border-box;
  height: calc(100vh - 15rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}

.message{
  margin-bottom: 3px;
}
.message.own{
  text-align: right;
}
.message.own .content{
  background-color: lightskyblue;
}
.chat-container .username{
  font-size: 18px;
  font-weight: bold;
}
.chat-container .content{
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display:inline-block;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
  max-width: 50%;
  word-wrap: break-word;
  }
@media (max-width: 480px) {
  .chat-container .content{
    max-width: 60%;
  }
}

</style>
