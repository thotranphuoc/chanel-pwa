import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor( private afs: AngularFirestore) { }

  sendNotification2User(SUID: string, DUID: string, MSG: string){
    return this.afs.doc('NOTI/'+DUID).update({MSG: MSG})
  }

  
}
