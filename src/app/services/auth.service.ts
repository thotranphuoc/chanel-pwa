import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';
import { LocalService } from './local.service';
import { iProfile } from '../interfaces/profile.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(
    private httpClient: HttpClient,
    private localService: LocalService
  ) { }

  accountSignInWithGmail() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result: any) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(token, user)
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  accountLoginWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    return new Promise((resolve, reject)=>{
      firebase.auth().signInWithPopup(provider).then(function (result: any) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(result);
        resolve({token: token, user: user, result: result })
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        reject({errorCode: errorCode, errorMessage: errorMessage,email: email, credential: credential })
      });
    })
  }

  accountSignUp(username, password) {
    return firebase.auth().createUserWithEmailAndPassword(username, password)
  }

  accountSignIn(username, password) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(username, password).then((res) => {
        console.log(res);
        this.localService.ACCOUNT.isSigned;
        this.localService.ACCOUNT.currentUser = firebase.auth().currentUser;
        // return Promise.resolve()
        let UID = firebase.auth().currentUser.uid;
        return this.profileGet_FB(UID)
      })
        .then((res) => {
          resolve(res);
        })
        .catch(err => reject(err))
    })


  }

  profileGet_FB(ID) {
    return new Promise((resolve, reject) => {
      firebase.firestore().doc('PROFILES/' + ID).get()
        .then((res) => {
          if (res.exists) {
            let PRO = <iProfile>res.data();
            this.localService.PROFILE = PRO;
            resolve({ PROFILE: PRO })
          }else{
            resolve({PROFILE: null})
          }
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
  accoutnCurrentUser() {
    this.localService.ACCOUNT.currentUser = firebase.auth().currentUser;
    return firebase.auth().currentUser;
  }

  isSigned() {
    if (firebase.auth().currentUser) return true
    return false;
  }

  accountSignOut() {
    return firebase.auth().signOut();
  }

  accountProfileUpdate() {
    firebase.auth().currentUser
  }

  getCurrentUser() {
    return firebase.auth().currentUser
  }

  profileGet() {
    let UID = this.getCurrentUser().uid;
    return this.profileGet_FB(UID);
  }

  accountLogin(email: string, passwd: string){
    return firebase.auth().signInWithEmailAndPassword(email, passwd)
    // .then((user)=>{
    //   console.log(user);
    // })
    // .catch(err=>{
    //   console.log(err);
    // })
  }

  accountRegister(email: string, passwd: string){
    return firebase.auth().createUserWithEmailAndPassword(email, passwd);
  }

  
}
