import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { iUser } from '../interfaces/user.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iFacialCabin } from '../interfaces/facialcabin.interface';
import { iBooking } from '../interfaces/booking.interface';
import { pipe } from '@angular/core/src/render3';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  USER: Observable<any[]>;
  constructor(private afs: AngularFirestore,

  ) {

  }

  getUSERS() {
    this.USER = this.afs.collection('USERS').valueChanges();
    return this.USER;
  }

  userCreate(user: iUser) {
    return this.afs.doc('USERS/' + user.U_ID).set(user);
  }

  userGet(UserID: string) {
    return this.afs.doc(`USERS/${UserID}`).get()
  }

  userUpdate(User: iUser) {
    return this.afs.doc(`USERS/${User.U_ID}`).update(User);
  }

  usersGet() {
    return this.afs.collection('USERS').get();
  }




  customerCreate(customer: iCustomer) {
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
          resolve({ MSG: 'create success', CUSTOMER: CUS })
        })
        .catch((err) => reject(err))
    })
  }

  customerUpdate(customer: iCustomer) {
    return this.afs.doc('CUSTOMERS/' + customer.C_ID).update(customer);
  }

  customersGet() {
    return this.afs.collection('CUSTOMERS').get();
  }

  namePhoneIDUpdate() {
    this.afs.doc('NamePhoneID')
  }



  customerGetByPhone(PhoneNumber: string) {
    return this.afs.collection('CUSTOMERS', ref => ref.where('C_PHONE', '==', PhoneNumber))
  }

  createFacialCabin(facialcabin: iFacialCabin) {
    console.log(facialcabin);
    let FAC = facialcabin
    return new Promise((resolve, reject) => {
      this.afs.collection('FACIAL_CABIN').add(facialcabin)
        .then((res) => {
          FAC.F_ID = res.id;
          return res.update({ F_ID: res.id })
        })
        .then(() => {
          resolve({ MSG: 'create success' })
        })
        .catch((err) => reject(err))
    })


    //var time_tmp = Number(new Date().getTime());
    //facialcabin.F_ID=time_tmp.toString();
    //return this.afs.doc('FACIAL_CABIN/'+facialcabin.F_ID).set(facialcabin);
  }

  updateFacialCabin(facialcabin: iFacialCabin) {
    return this.afs.doc('FACIAL_CABIN/' + facialcabin.F_ID).update(facialcabin);
  }


  createBooking(booking: iBooking) {
    console.log(booking);
    let BOOK = booking
    return new Promise((resolve, reject) => {
      this.afs.collection('BOOKINGS').add(booking)
        .then((res) => {
          BOOK.B_ID = res.id;
          return res.update({ B_ID: res.id })
        })
        .then(() => {
          resolve({ MSG: 'create success' })
        })
        .catch((err) => reject(err))
    })
  }

  bookingCreateWithNewCustomer(BOOKING: iBooking, CUSTOMER: iCustomer) {
    return new Promise((resolve, reject) => {
      let _CUSTOMER: iCustomer;
      this.customerCreate(CUSTOMER)
        .then((res1: any) => {
          _CUSTOMER = res1.CUSTOMER;
          BOOKING.B_CUSTOMER_ID = _CUSTOMER.C_ID;
          BOOKING.B_CUSTOMER_NAME = _CUSTOMER.C_NAME;
          BOOKING.B_CUSTOMER_PHONE = _CUSTOMER.C_PHONE;
          return this.bookingCreate(BOOKING);
        })
        .then((res2) => {
          console.log(res2);
          resolve({ MSG: 'new booking done', BOOKING: BOOKING, CUSTOMER: _CUSTOMER })
        })
        .catch(err => {
          reject(err);
        })
    })
  }


  bookingCreateWithExistingCustomer(BOOKING: iBooking) {
    return this.bookingCreate(BOOKING);
  }

  bookingCreate(BOOKING: iBooking) {
    return new Promise((resolve, reject) => {
      this.afs.collection('BOOKINGS').add(BOOKING)
        .then((res) => {
          BOOKING.B_ID = res.id;
          return res.update({ B_ID: res.id })
        })
        .then(() => {
          resolve({ MSG: 'Booking created successfully', BOOKING: BOOKING });
        })
        .catch((err) => reject(err));
    })
  }

  bookingGet(ID: string) {
    return this.afs.doc('BOOKINGS/' + ID).get()
    // .then((res)=>{
    //   let BOOKING = <iBooking>res.data();

    // })
  }

  bookingUpdate(BOOKING: iBooking) {
    return this.afs.doc('BOOKINGS/' + BOOKING.B_ID).update(BOOKING)
  }

  calendarUpdate(BOOKING: iBooking) {
    return this.afs.doc('BOOKINGS/' + BOOKING.B_ID).update(BOOKING)
  }

  calendarMonthCreate(MONTH: string, data: any) {
    return this.afs.doc('CALENDARS/' + MONTH).set(data)
  }

  calendarMonthGet(Month: string, Year: string) {
    let MonthStr = Month.length < 2 ? '0' + Month : Month;
    let str = Year + MonthStr;
    return this.afs.doc('CALENDARS/' + str).valueChanges()
  }

  dayUpdate(Day: iDay) {
    let DateId = Day.DateId
    let month = Day.DateId.substr(0, 6);
    let day2Update = {};
    day2Update[DateId] = Day;
    console.log(day2Update);
    return this.afs.collection('CALENDARS').doc(month).update(day2Update);
  }
  
}


