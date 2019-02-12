import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';
import { LocalService } from './local.service';
import { iProfile } from '../interfaces/profile.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { from, Subscription, Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { CrudService } from './crud.service';
import { iUser } from '../interfaces/user.interface';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  CUSTOMERS: any = [];
  public isSigned: boolean = false;
  FBUSER;
  currentLoginedUser: Subscription

  authChange = new Subject<boolean>();
  userChange = new Subject<iUser>();
  public isAuthenticated: boolean = false;
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private localService: LocalService,
    private afa: AngularFireAuth,
    private crudService: CrudService
  ) {
    // this.isUserSigned();
  }

  initAuthListener() {
    this.afa.authState.subscribe((user) => {
      if (user) {
        console.log('user logged in');
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.crudService.userGet(user.uid).subscribe(user => {
          let USER = <iUser>user.data();
          this.localService.USER = USER;
          this.userChange.next(USER);
        })
      } else {
        console.log('user not login');
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigateByUrl('/account');
        this.userChange.next(null);
        this.localService.USER = null;
      }
    })
  }

  signInWithAfAuth(email: string, passwd: string) {
    return this.afa.auth.signInWithEmailAndPassword(email, passwd)
  }

  signOutWithAfAuth() {
    return this.afa.auth.signOut();
  }

  accountCreate(email: string, passwd: string) {
    return this.afa.auth.createUserWithEmailAndPassword(email, passwd)
  }
  // isUserSigned() {
  //   this.afa.authState.subscribe(user => {
  //     console.log(user);
  //     this.isSigned = user ? true : false;
  //     this.FBUSER = user;
  //     return this.crudService.userGet(user.uid).subscribe(USER=>{
  //       let loginedUser = <iUser>USER.data();
  //       this.currentUserLogined(loginedUser);
  //     })
  //   });
  // }

  currentUserLogined(USER) {
    Observable.create((observer) => {
      observer.next(USER)
    })
  }
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
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithPopup(provider).then(function (result: any) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(result);
        resolve({ token: token, user: user, result: result })
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        reject({ errorCode: errorCode, errorMessage: errorMessage, email: email, credential: credential })
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
            this.localService.PROFILE_DEFAULT = PRO;
            resolve({ PROFILE: PRO })
          } else {
            resolve({ PROFILE: null })
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

  // isSigned() {
  //   if (firebase.auth().currentUser) return true
  //   return false;
  // }

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

  accountLogin(email: string, passwd: string) {
    return firebase.auth().signInWithEmailAndPassword(email, passwd)
    // .then((user)=>{
    //   console.log(user);
    // })
    // .catch(err=>{
    //   console.log(err);
    // })
  }

  accountRegister(email: string, passwd: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, passwd);
  }


  getCustomer() {
    return firebase.firestore().collection('CUSTOMERS').get()
  }

  getUser() {
    return firebase.firestore().collection('USERS').get()
  }

  getFacialCabin() {
    return firebase.firestore().collection('FACIAL_CABIN').get()
  }



}
