import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/firestore';
import 'firebase/auth';
import { CrudService } from './crud.service';
import { LocalService } from './local.service';
import { iUser } from '../interfaces/user.interface';
@Injectable({
  providedIn: 'root'
})
export class FcmService {
  // ProjectPushNotificationKey = 'key=AAAAAFkN2v0:APA91bEATZgn1Z47ctfjyY2aaT_Cd1wvIYAnbZogl5UKxcRJsRFoGfe0VMvJwnxT82hJzHAsTw2Nef0SgWMGGV3V0vMZ_RgSNI1XpvdCA5mLOKckdlknNg3_bs1uyYhU8BfiHvc2GWwF';
  TOKEN: string = '';
  MESSAGE: string = '';
  NOTI: boolean = false;
  DATA: any = null;
  NOTIFICATION: string = 'ON';
  constructor(
    // private http: HttpClient
    private http: Http,
    private crudService: CrudService,
    private localService: LocalService
  ) { }

  initializePushNoti() {
    this.checkNotificationRegistered();
    this.requestPermissionAndGetTokenThenUpdate()
    let messaging = firebase.messaging();
    messaging.onMessage((payload: any) => {
      console.log('payload:', payload);
      this.DATA = [];
      if (payload.collapse_key == 'do_not_collapse') {
        this.DATA = payload.data;
      } else {
        this.DATA = null;
      }
    })
  }

  tokenCurrentGet() {
    firebase.messaging().getToken()
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          this.tokenUpdate4User(res);
        }, 4000);
      })
      // .then(res1 => {
      //   console.log(res1);
      // })
      .catch(err => {
        console.log(err);
      })
  }

  tokenUpdate4User(TOKEN: string) {
    let USER: iUser = this.localService.USER;
    // let UID = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
    if (USER && USER.U_ROLE =='Manager') {
      this.crudService.tokenUpdate4User(USER.U_ID, TOKEN);
    } else {
      console.log('uid null or not manager');
    }
  }

  tokenCurrentDelete(TOKEN: string) {
    return firebase.messaging().deleteToken(TOKEN)
  }

  permissionRequest() {
    firebase.messaging().requestPermission()
      .then(() => {
        console.log('permission granted');
        this.tokenCurrentGet();
      })
      .catch((err) => {
        console.log('Permission denied', err);
      })
  }

  // messagePush(MESSAGE: string, TOKEN: string) {
  //   console.log(MESSAGE, TOKEN);
  //   setTimeout(() => {
  //     let headers = new Headers();
  //     let ProjectPushNotificationKey = 'key=AAAAAFkN2v0:APA91bEATZgn1Z47ctfjyY2aaT_Cd1wvIYAnbZogl5UKxcRJsRFoGfe0VMvJwnxT82hJzHAsTw2Nef0SgWMGGV3V0vMZ_RgSNI1XpvdCA5mLOKckdlknNg3_bs1uyYhU8BfiHvc2GWwF';
  //     headers.append('Content-Type', 'application/json');
  //     headers.append('Authorization', ProjectPushNotificationKey);
  //     let body = {
  //       to: TOKEN,
  //       data: {
  //         title: "Hi there",
  //         body: MESSAGE,
  //         click_action: "https://chanel-vn.firebaseapp.com"
  //       }
  //     }
  //     let URL = 'https://fcm.googleapis.com/fcm/send'
  //     this.http.post(URL, JSON.stringify(body), { headers: headers })
  //       .pipe(
  //         map((res: any) => res.json())
  //       )
  //       .subscribe((data) => {
  //         console.log(data);
  //         if (data.results[0].error) {
  //           console.log('Error:', data.results[0].error);
  //         } else {
  //           console.log('success');
  //         }
  //       })
  //   }, 2000);
  // }



  checkNotificationRegistered() {
    let uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
    firebase.firestore().doc('TOKENS/' + uid).get().then((docSnap) => {
      if (docSnap.exists) {
        this.NOTI = true;
        console.log(this.NOTI);
      } else {
        this.NOTI = false;
        console.log(this.NOTI);
        this.requestPermissionAndGetTokenThenUpdate()
      }
    })
  }

  requestPermissionAndGetTokenThenUpdate() {
    let message = firebase.messaging();
    message.requestPermission()
      .then(() => {
        return message.getToken()
      })
      .then((token) => {
        console.log('TOKEN:', token)
        this.TOKEN = token;
        // if (this.NOTI) {
        //   this.updateToken(token);
        // }
        this.updateToken(token);
      })
      .catch((err) => {
        this.MESSAGE = err;
        alert(this.MESSAGE);
      })
  }

  updateToken(TOKEN: string) {
    let uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null
    let data = {
      UID: uid,
      TOKEN: TOKEN
    }
    if (uid && TOKEN) {
      firebase.firestore().doc('TOKENS/' + uid).set(data)
        .then((res) => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  subscribeToken() {
    let uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
    if (uid) {
      let data = {
        UID: uid,
        TOKEN: this.TOKEN
      }
      firebase.firestore().doc('TOKENS/' + uid).set(data)
        .then(() => {
          this.NOTI = true;
          this.MESSAGE = null;
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      alert('Please login to subscribe Notification')
    }
  }

  unsubscribeToken() {
    this.deleteToken();
  }

  deleteToken() {
    let uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null
    if (uid) {
      firebase.firestore().doc('TOKENS/' + uid).delete().then(() => {
        this.NOTI = false;
        this.MESSAGE = 'Token just deleted from DB. You do not receive notification any more';
      })

    }
  }

  setNotification(STATE: string) {
    this.NOTIFICATION = STATE;
    console.log(STATE);

    if (STATE == 'OFF') {
      this.deleteToken();
    } else {
      this.requestPermissionAndGetTokenThenUpdate();
    }
  }
}
