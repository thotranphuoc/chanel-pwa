import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  BOOKINGS: Observable<any[]>;
  constructor(private afs: AngularFirestore) {

  }

  getBookings() {
    this.BOOKINGS = this.afs.collection('BOOKINGS').valueChanges();
    return this.BOOKINGS;
  }
}
