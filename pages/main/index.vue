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
              v-model="message"
              name="input-7-1"
            ></v-textarea>
             <v-btn
               color="primary"
               @click="send"
             >Primary
             </v-btn>
          </v-card>
          
          <v-card
            color="basil"
            flat
            v-if="isRecieve(item)"
          >
            <v-list two-line subheader>

              <v-list-item
                v-for="(item) in overViewList"
                :key="item.latestMessageTimeStamp"
                @click="openRoom(item)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.latestMessageTimeStamp"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.latestMessage"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

            </v-list>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import firebase from '@/plugins/firebase';
import { getModule } from "vuex-module-decorators";
import IndexState from '@/store/index';

interface User {
  id: string;
  name: string;
  gender: string;
};

interface Overview {
  roomId: string;
  gender: string;
  name: string;
  latestMessageTimeStamp: any;
  latestMessage: string;
}

@Component
export default class index extends Vue {
  private indexModule = getModule(IndexState, this.$store);

  private tab: string = "";
  private items = ["設定", "新規", "受信一覧"];
  private text = "あいうえお";

  private name = "";
  private email = "";

  private selectedGender = "男女";
  private message = "";
  
  @Watch("tab")
  async updateOverviewList() {
    if (this.tab == "2") {
      await this.getOverview();
    }
  }

  isSetting(item: string) {
    if(item === "設定") return true;
    return false;
  }

  isNewSend(item: string) {
    if(item === "新規") return true;
    return false;
  }

  isRecieve(item: string) {
    if(item === "受信一覧") return true;
    return false;
  }

  getOptions = {
    source: 'cache'
  };

  overViewList: Overview[] = [];

  async getOverview() {
    this.overViewList = [];

    const db = firebase.firestore();
    await db.collection("rooms").doc(this.indexModule.UserUid).collection("havingRooms").where("enable", "==", true)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          this.overViewList.push({
            roomId: data.roomId,
            gender: data.gender,
            name: data.name,
            latestMessageTimeStamp: data.latestMessageTimeStamp.toDate().toLocaleString("ja"),
            latestMessage: data.latestMessage
          });
        })
      })
  }

  openRoom(room: Overview) {
    this.indexModule.setRoomId(room.roomId);
    this.$router.push('/main/chatRoom');
  }
  
  user: User = {
    id: "",
    name: "",
    gender: ""
  };

  target: User = {
    id: "",
    name: "",
    gender: ""
  };

  users: User[] = [];
  sentTargets: string[] = [];
  roomId: string = "";
  latestMessageTimeStamp = firebase.firestore.FieldValue.serverTimestamp();

  init() {
    this.user = {
      id: "",
      name: "",
      gender: ""
    };
    this.target = {
      id: "",
      name: "",
      gender: ""
    }
    this.users = [];
    this.sentTargets = [];
    this.roomId = "";
  }
  

  async send() {
    // 画面から
    // 性別を取得する
    console.log(this.selectedGender);
    
    // メッセージを取得する
    console.log(this.message);

    // 送信対象の相手リストを性別を指定して取得する
    await this.collectUnsentTargetList();

    // 送信済みの相手リストを取得する
    await this.collectSentTargetList();
    
    // シャッフル
    this.shuffle();
    console.log("シャッフルきてる");
    
    // 送信相手を決定する
    this.choiceTarget();
    console.log("送信相手を決定きてる");

    // <fireStoreに保存する>
    // roomIdを作成する
    this.createUniqueStr();
    console.log("roomIdを作成きてる");

    // 相手のroomを作成する
    // 自分のroomを作成する
    this.latestMessageTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
    this.createTargetRoom();
    this.createMyRoom();
    console.log("room作成きてる");

    // messagesに作成する
    this.createMessage();
    console.log("messagesきてる");

    // 初期化
    this.init();
  }

  async collectUnsentTargetList() {
    console.log("in:collectUnsentTargetList");
    const db = firebase.firestore();
    await db.collection("users").where("gender", "==", this.selectedGender)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if(data.id !== this.indexModule.UserUid) {
            this.users.push({
              id: data.id,
              name: data.name,
              gender: data.gender
            });
          }
        })
      })
    console.log("out:collectUnsentTargetList");
  }

  async collectSentTargetList() {
    console.log("in:collectSentTargetList");
    const db = firebase.firestore();
    await db.collection("rooms").doc(this.indexModule.UserUid).collection("havingRooms").where("enable", "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          this.sentTargets.push(data.sessionedUserId);
        })
      }).catch(function(error) {
        console.log("Error getting collectSentTargetList:", error);
      });
    console.log("out:collectSentTargetList");
  }

  shuffle() {
    for (let i = this.users.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.users[i], this.users[j]] = [this.users[j], this.users[i]];
    }
  }

  choiceTarget() {
    console.log("in:choiceTarget");
    for (var user of this.users) {
      const target: string | undefined = this.sentTargets.find(s => s === user.id)
      if(target === undefined || target === "") {
        this.target = user;
        break;
      }
    }
    console.log("out:choiceTarget");
  }

  async createTargetRoom() {
    console.log("相手room作成");    
    // 相手room作成
    const db = firebase.firestore();
    const target = db.collection('rooms').doc(this.target.id).collection("havingRooms").doc(this.indexModule.UserUid);
    await target
      .set({
        enable: true,
        roomId: this.roomId,
        name: this.target.name,
        gender: this.target.gender,
        latestMessage: this.message,
        latestMessageTimeStamp: this.latestMessageTimeStamp
      })
  }

  async createMyRoom() {
    console.log("自分room作成");
    // 自分room作成
    const db = firebase.firestore();
    const me = db.collection('rooms').doc(this.indexModule.UserUid).collection("havingRooms").doc(this.target.id);
    
    await me
      .set({
        enable: true,
        roomId: this.roomId,
        name: this.target.name,
        gender: this.target.gender,
        latestMessage: this.message,
        latestMessageTimeStamp: this.latestMessageTimeStamp
      })
  }

  async createMessage() {
    const db = firebase.firestore();
    let dbUsers = db.collection('contents').doc(this.roomId).collection("messages");
    await dbUsers
      .add({
        message: this.message,
        userId: this.indexModule.UserUid,
        latestMessageTimeStamp: this.latestMessageTimeStamp
      })
  }

  /**
   * UUID作成
   */
  createUniqueStr(myStrong?: number) {
    let strong = 1000;
    if (myStrong) strong = myStrong;
    this.roomId = new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
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
