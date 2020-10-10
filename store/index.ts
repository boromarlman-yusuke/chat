import { Mutation, Action, VuexModule, Module } from "vuex-module-decorators";
import firebase from '@/plugins/firebase';

@Module({name: "login-module" })
export default class IndexState extends VuexModule {
  

  private userUid = "";
  private userName = "";
  private userGender = "";
  private errorMessage = "";
  private roomId = "";

  
  @Mutation
  public setUserUid(userUid: string) {
    this.userUid = userUid;
  }

  @Mutation
  public setUserName(userName: string) {
    this.userName = userName;
  }

  @Mutation
  public setGender(userGender: string) {
    this.userGender = userGender;
  }

  @Mutation
  public setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  @Mutation
  public setRoomId(roomId: string) {
    this.roomId = roomId;
  }


  @Action
  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const isFirstLogin = result.additionalUserInfo!.isNewUser;
      if (isFirstLogin) {

      } else {

      }

      const userData = {
        id: result.user!.uid,
        name: result.user!.displayName,
        gender: "男" // TODO:選択できるようにする
      };

      firebase.firestore().collection('users').doc(result.user!.uid).set(userData);
      this.setUserUid(userData.id!);
      this.setUserName(userData.name!);

    }).catch(error => {
      this.setErrorMessage = error.message;
    })
  }

  get UserUid() {
    return this.userUid;
  }

  get UserName() {
    return this.userName;
  }

  get UserGender() {
    return this.userGender;
  }

  get RoomId() {
    return this.roomId;
  }

}
