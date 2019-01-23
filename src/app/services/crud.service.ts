import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import {iUser} from '../interfaces/user.interface';
import {iCustomer} from '../interfaces/customer.interface';
import {iFacialCabin} from '../interfaces/facialcabin.interface';
import {iBooking} from '../interfaces/booking.interface';
import { formatNumber } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  USER: Observable<any[]>;
  constructor(private afs: AngularFirestore,
    
    ) {

  }

  getUSER() {
    this.USER = this.afs.collection('USERS').valueChanges();
    return this.USER;
  }

  createUSER(user: iUser)
  {
    return this.afs.doc('USERS/'+user.U_ID).set(user);
  }



createCustomer(customer: iCustomer)
  {
    console.log(customer);
    //var time_tmp = Number(new Date().getTime());
    //customer.C_ID=time_tmp.toString();
    
    //return this.afs.doc('CUSTOMERS/'+customer.C_ID).set(customer);

    let CUS = customer
        return new Promise((resolve, reject) => {
          this.afs.collection('CUSTOMERS').add(customer)
                .then((res) => {
                  CUS.C_ID = res.id;
                    return res.update({ C_ID: res.id })
                })
                .then(() => {
                    resolve({ MSG: 'create success'})
                })
                .catch((err) => reject(err))
        })
  }

  updateCustomer(customer: iCustomer)
  {
    return this.afs.doc('CUSTOMERS/'+customer.C_ID).update(customer);
  }

  createFacialCabin(facialcabin: iFacialCabin)
  {
    console.log(facialcabin);
    let FAC = facialcabin
        return new Promise((resolve, reject) => {
          this.afs.collection('FACIAL_CABIN').add(facialcabin)
                .then((res) => {
                  FAC.F_ID = res.id;
                    return res.update({ F_ID: res.id })
                })
                .then(() => {
                    resolve({ MSG: 'create success'})
                })
                .catch((err) => reject(err))
        })


    //var time_tmp = Number(new Date().getTime());
    //facialcabin.F_ID=time_tmp.toString();
    //return this.afs.doc('FACIAL_CABIN/'+facialcabin.F_ID).set(facialcabin);
  }

  updateFacialCabin(facialcabin: iFacialCabin)
  {
    return this.afs.doc('FACIAL_CABIN/'+facialcabin.F_ID).update(facialcabin);
  }


  createBooking(booking: iBooking)
  {
    console.log(booking);
    let BOOK = booking
        return new Promise((resolve, reject) => {
          this.afs.collection('BOOKINGS').add(booking)
                .then((res) => {
                  BOOK.B_ID = res.id;
                    return res.update({ B_ID: res.id })
                })
                .then(() => {
                    resolve({ MSG: 'create success'})
                })
                .catch((err) => reject(err))
        })
  }

}
