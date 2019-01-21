import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import {iUser} from '../interfaces/user.interface';
import {iCustomer} from '../interfaces/customer.interface';
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
    return this.afs.doc('CUSTOMERS/'+customer.C_ID).set(customer);
  }

  updateCustomer(customer: iCustomer)
  {
    return this.afs.doc('CUSTOMERS/'+customer.C_ID).update(customer);
  }



}
