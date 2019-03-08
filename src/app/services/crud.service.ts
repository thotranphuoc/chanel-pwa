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
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  USER: Observable<any[]>;
  constructor(
    private afs: AngularFirestore,
    private alertCtrl: AlertController
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
          resolve({ MSG: 'Thêm thành công', CUSTOMER: CUS })
        })
        .catch((err) => reject(err))
    })
  }

  customerUpdate(customer: iCustomer) {
    return this.afs.doc('CUSTOMERS/' + customer.C_ID).update(customer);
  }

  customerUpdateLastBookingAndSublimage(BOOKING: iBooking) {
    let CID = BOOKING.B_CUSTOMER_ID;
    let DATA = {};
    if (BOOKING.B_SUBLIMAGE) {
      DATA = {
        C_isSUBLIMAGE: true,
        C_LAST_B_ID: BOOKING.B_ID,
        C_LAST_B_DATE: BOOKING.B_DATE,
        C_LAST_B_SLOT: BOOKING.B_SLOT,
        C_BOOK_STATE: BOOKING.B_STATUS
      }
    } else {
      DATA = {
        C_LAST_B_ID: BOOKING.B_ID,
        C_LAST_B_DATE: BOOKING.B_DATE,
        C_LAST_B_SLOT: BOOKING.B_SLOT,
        C_BOOK_STATE: BOOKING.B_STATUS
      }
    }
    return this.afs.doc('CUSTOMERS/' + CID).update(DATA)
  }

  customersGet() {
    return this.afs.collection('CUSTOMERS').get();
  }

  customersBookingGet(C_ID: string) {
    return this.afs.collection('BOOKINGS', ref => ref.where('B_CUSTOMER_ID', '==', C_ID)).get();
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
          resolve({ MSG: 'Thêm thành công' })
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
          resolve({ MSG: 'Đặt hẹn hoàn tất', BOOKING: BOOKING, CUSTOMER: _CUSTOMER })
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
          // update last booking and isSublimage for customer
          return this.customerUpdateLastBookingAndSublimage(BOOKING);
        })
        .then(() => {
          resolve({ MSG: 'Đặt hẹn thành công', BOOKING: BOOKING });
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

  calendarMonthCreate(YYYYMM: string, data: any) {
    // this.afs.doc('CALENDARS/' + YYYYMM).get().toPromise().then(res=>{
    //   if(res.exists)
    // })
    return this.afs.doc('CALENDARS/' + YYYYMM).set(data)
  }



  calendarMonthGet(YYYYMM: string) {
    return this.afs.doc('CALENDARS/' + YYYYMM).valueChanges()
  }

  calendarDayGet(YYYYMMDD: string) {
    let fullday=YYYYMMDD.split("-")
    console.log(fullday);
    let yearmonthtime = fullday[0]+fullday[1];
    let YYYYMMDD_=fullday[0]+fullday[1]+fullday[2];
    return this.afs.doc('CALENDARS/' + yearmonthtime).valueChanges()
    //return this.afs.collection('CALENDARS', ref => ref.where(YYYYMMDD_ + '', '==', YYYYMMDD_ + '')).get();
  }

  calendarMonthGetPromise(YYYYMM: string){
    return firebase.firestore().doc('CALENDARS/'+ YYYYMM).get();
  }

  calendarMonthUpdate(YYYYMM: string, data: any) {
    return this.afs.doc('CALENDARS/' + YYYYMM).update(data)
  }

  dayUpdate(Day: iDay) {
    let DateId = Day.DateId
    let monthstr = Day.DateId.substr(0, 6);
    let day2Update = {};
    day2Update[DateId] = Day;
    console.log(day2Update);
    return this.afs.collection('CALENDARS').doc(monthstr).update(day2Update);
  }

  bookingsGetWithState(STATE: string, USER: iUser) {

    switch (USER.U_ROLE) {
      case 'Admin':
        return firebase.firestore().collection('BOOKINGS')
          .where('B_STATUS', '==', STATE)
          .get();
      case 'Manager':
        return firebase.firestore().collection('BOOKINGS')
          .where('B_STATUS', '==', STATE)
          .get();
      case 'Specialist':
        return firebase.firestore().collection('BOOKINGS')
          .where('B_STATUS', '==', STATE)
          .where('B_SPECIALIST_ID', '==', USER.U_ID)
          .get();
      case 'BA':
        return firebase.firestore().collection('BOOKINGS')
          .where('B_STATUS', '==', STATE)
          .where('B_BA_BOOK_ID', '==', USER.U_ID)
          .get();
      case 'BAS':
        return firebase.firestore().collection('BOOKINGS')
          .where('B_STATUS', '==', STATE)
          .where('B_BA_SELL_ID', '==', USER.U_ID)
          .get();
      case 'BA':
        return firebase.firestore().collection('BOOKINGS')
          .where('B_STATUS', '==', STATE)
          .where('B_BA_BOOK_ID', '==', USER.U_ID)
          .get();
      default:
        break;
    }
  }

  bookingsOfUserWithStatesGet(USER: iUser, STATES: string[]) {
    // console.log(USER, STATES);
    return new Promise((resolve, reject) => {
      let BOOKINGS = [];
      let Pros = Array(STATES.length);
      STATES.forEach((STATE, i) => {
        Pros[i] = this.bookingsGetWithState(STATE, USER)
          .then(qSnap => {
            let _BOOKINGS = [];
            qSnap.forEach(doc => {
              let _Booking = <iBooking>doc.data();
              // console.log(pat);
              _BOOKINGS.push(_Booking);
            })
            BOOKINGS = BOOKINGS.concat(_BOOKINGS);
          })
      })
      Promise.all(Pros)
        .then(res => {
          console.log(res);
          resolve({ BOOKINGS: BOOKINGS });
        })
        .catch(err => {
          reject(err);
        })
    })

  }
}


