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
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  USER: Observable<any[]>;
  constructor(
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private appService: AppService
  ) {

  }

  ionViewWillEnter() {
    this.customersAllGet();
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

  usersGetALL() {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('USERS').get()
        .then((qSnap) => {
          let USERS: iUser[] = [];
          qSnap.forEach(docSnap => {
            let USER = <iUser>docSnap.data();
              // CUSTOMER['Book'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, null);
              // CUSTOMER['Cancel'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, "CANCELED");
              // CUSTOMER['Complete'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, "COMPLETED");
            if(USER.U_ROLE=="Specialist" || USER.U_ROLE=="BA" || USER.U_ROLE=="Admin" || USER.U_ROLE=="Manager")
              USERS.push(USER);
          })
          resolve({ USERS: USERS })
        })
        .catch(err => reject(err))
    })
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

  customerUpdateAfterBookingChange(BOOKING: iBooking) {
    let CID = BOOKING.B_CUSTOMER_ID;
    let DATA = {};
    let CUSTOMER = BOOKING.B_CUSTOMER;
    CUSTOMER.C_LAST_B_ID = BOOKING.B_ID;
    CUSTOMER.C_LAST_B_DATE = BOOKING.B_DATE;
    CUSTOMER.C_LAST_B_SLOT = BOOKING.B_SLOT;
    if (BOOKING.B_SUBLIMAGE) {
      CUSTOMER.C_LASTUSE_SUBLIMAGE = this.appService.getCurrentDateFormat1();
      CUSTOMER.C_isSUBLIMAGE = true;
    }

    CUSTOMER.C_BOOK_STATE = BOOKING.B_STATUS;
    CUSTOMER.C_PERFUME = BOOKING.B_PERFUME
    CUSTOMER.C_MAKEUP = BOOKING.B_MAKEUP;
    CUSTOMER.C_CSCU = BOOKING.B_CSCU;
    CUSTOMER.C_SUBLIMAGE = BOOKING.B_SUBLIMAGE;
    CUSTOMER.C_LELIFT = BOOKING.B_LELIFT;
    CUSTOMER.C_FASHION = BOOKING.B_FASHION;

    // let YYYYMMDD = this.appService.getCurrentDateFormat3(); 
    let ID = BOOKING.B_ID;
    CUSTOMER.C_BOOKINGS[ID] = {
      ID: ID,
      STATE: BOOKING.B_STATUS,
      DATE: BOOKING.B_DATE
    }
    // CUSTOMER.C_BOOKINGS[YYYYMMDD] = BOOKING.B_ID;

    // if (BOOKING.B_SUBLIMAGE) {
    //   DATA = {
    //     C_isSUBLIMAGE: true,
    //     C_LAST_B_ID: BOOKING.B_ID,
    //     C_LAST_B_DATE: BOOKING.B_DATE,
    //     C_LAST_B_SLOT: BOOKING.B_SLOT,
    //     C_BOOK_STATE: BOOKING.B_STATUS
    //   }
    // } else {
    //   DATA = {
    //     C_LAST_B_ID: BOOKING.B_ID,
    //     C_LAST_B_DATE: BOOKING.B_DATE,
    //     C_LAST_B_SLOT: BOOKING.B_SLOT,
    //     C_BOOK_STATE: BOOKING.B_STATUS
    //   }
    // }
    console.log(CUSTOMER);
    this.customerUpdate(CUSTOMER);
  }

  customersGet() {
    return this.afs.collection('CUSTOMERS').get();
  }

  customersAllGet1() {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('CUSTOMERS').get()
        .then((qSnap) => {
          let CUSTOMERS: iCustomer[] = [];
          qSnap.forEach(docSnap => {
            let CUSTOMER = <iCustomer>docSnap.data();
              // CUSTOMER['Book'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, null);
              // CUSTOMER['Cancel'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, "CANCELED");
              // CUSTOMER['Complete'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, "COMPLETED");
            console.log(CUSTOMER);
            CUSTOMERS.push(CUSTOMER);
          })
          resolve({ CUSTOMERS: CUSTOMERS })
        })
        .catch(err => reject(err))
    })
  }

  customersAllGet() {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('CUSTOMERS').get()
        .then((qSnap) => {
          let CUSTOMERS: iCustomer[] = [];
          qSnap.forEach(docSnap => {
            let CUSTOMER = <iCustomer>docSnap.data();
              // CUSTOMER['Book'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, null);
              // CUSTOMER['Cancel'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, "CANCELED");
              // CUSTOMER['Complete'] = this.countBookingsOfCustomerID(CUSTOMER.C_ID, "COMPLETED");
            //console.log(CUSTOMER);
            CUSTOMERS.push(CUSTOMER);
          })
          resolve({ CUSTOMERS: CUSTOMERS })
        })
        .catch(err => reject(err))
    })
  }

countBookingsOfCustomerID(C_ID: string, STATE: string) {
    let num=0;
    this.bookingsOfCustomerGet(C_ID)
    .subscribe(qSnap => {
      qSnap.forEach(qDocSnap => {
        let BOOKING = <iBooking>qDocSnap.data();
        if (STATE){
          if(BOOKING.B_STATUS === STATE)
            num++;
        }
        else
        {
          num++;
        }
      })
      console.log(num);
      return num;
    })
    console.log(num);
    
  }

  namePhoneIDUpdate() {
    this.afs.doc('NamePhoneID')
  }



  customerGetByPhone(PhoneNumber: string) {
    return this.afs.collection('CUSTOMERS', ref => ref.where('C_PHONE', '==', PhoneNumber)).get();
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


  // createBooking(booking: iBooking) {
  //   console.log(booking);
  //   let BOOK = booking
  //   return new Promise((resolve, reject) => {
  //     this.afs.collection('BOOKINGS').add(booking)
  //       .then((res) => {
  //         BOOK.B_ID = res.id;
  //         return res.update({ B_ID: res.id })
  //       })
  //       .then(() => {
  //         resolve({ MSG: 'Thêm thành công' })
  //       })
  //       .catch((err) => reject(err))
  //   })
  // }

  bookingCreateWithNewCustomer(BOOKING: iBooking, CUSTOMER: iCustomer) {
    return new Promise((resolve, reject) => {
      let _CUSTOMER: iCustomer;
      this.customerCreate(CUSTOMER)
        .then((res1: any) => {
          _CUSTOMER = res1.CUSTOMER;
          BOOKING.B_CUSTOMER = _CUSTOMER;
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

  /**
   * 
   * 1- create booking
   * 2- update Customer info
   * 3- update calendar 
   */
  bookingCreate(BOOKING: iBooking) {
    return new Promise((resolve, reject) => {
      this.afs.collection('BOOKINGS').add(BOOKING)
        .then((res) => {
          BOOKING.B_ID = res.id;
          return res.update({ B_ID: res.id })
        })
        .then(() => {
          // update last booking and isSublimage for customer
          return this.customerUpdateAfterBookingChange(BOOKING);
        })
        .then(() => {
          // update calendars after booking change
          return this.dayUpdateAfterBookingChange(BOOKING);
        })
        .then(() => {
          resolve({ MSG: 'Đặt hẹn thành công', BOOKING: BOOKING });
          this.sendNotification2Manager(BOOKING);
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

  bookingsOfCustomerGet(CUSTOMER_ID: string) {
    return this.afs.collection('BOOKINGS', ref => ref.where('B_CUSTOMER_ID', '==', CUSTOMER_ID)).get();
  }

  bookingsOfUserGet(USER_ID: string) {
    return this.afs.collection('BOOKINGS', ref => ref.where('B_BA_BOOK_ID', '==', USER_ID)).get();
  }

  //Update 1 booking
  bookUpdate(Book: iBooking) {
    return this.afs.doc(`BOOKINGS/${Book.B_ID}`).update(Book);
  }

  bookingUpdate(BOOKING: iBooking) {
    return new Promise((resolve, reject) => {
      let index = BOOKING.B_DAY.Slots.map(slot => slot.SLOT).indexOf(BOOKING.B_SLOT);
      BOOKING.B_DAY.Slots[index].STATUS = BOOKING.B_STATUS;
      let DaySelect: iDay = BOOKING.B_DAY;
      console.log(DaySelect);
      if(BOOKING.B_STATUS==='AVAILABLE')
      {
        this.afs.doc('BOOKINGS/' + BOOKING.B_ID).delete()

        .then(() => {
          // update last booking and isSublimage for customer
          //return this.customerUpdateAfterBookingChange(BOOKING);
          return this.afs.doc('CUSTOMERS/' + BOOKING.B_CUSTOMER_ID + '/C_BOOKINGS/'+BOOKING.B_ID).delete();
        })
        .then(() => {
          // update calendars after booking change
          //return this.dayUpdateAfterBookingChange(BOOKING);
          //console.log(index);
          //console.log(BOOKING.B_DAY.Slots[index]);
          BOOKING.B_DAY.Slots[index].BOOK_ID='';
          BOOKING.B_DAY.Slots[index].STATUS = 'AVAILABLE';
          //console.log(BOOKING.B_DAY.Slots[index]);
          console.log(BOOKING.B_DAY);
          //return true;
          return this.dayUpdateAfterBookingChangeEmpty(BOOKING);
          //return this.dayUpdateSlot(BOOKING.B_DAY,BOOKING.B_DAY.Slots[index], index);
        })
        .then(() => {
          resolve({ MSG: 'Cập nhật thành công', BOOKING: BOOKING });
          this.sendNotification2Manager(BOOKING)
        })
        .catch((err) => reject(err));
      }
      else
      {
        this.afs.doc('BOOKINGS/' + BOOKING.B_ID).update(BOOKING)
        .then(() => {
          // update last booking and isSublimage for customer
          return this.customerUpdateAfterBookingChange(BOOKING);
        })
        .then(() => {
          // update calendars after booking change
          return this.dayUpdateAfterBookingChange(BOOKING);
        })
        .then(() => {
          resolve({ MSG: 'Cập nhật thành công', BOOKING: BOOKING });
          this.sendNotification2Manager(BOOKING)
        })
        .catch((err) => reject(err));
      }
    })
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

  calendarSlotGet(YYYYMMDD: string) {
    return firebase.firestore().doc('CALENDARS/' + YYYYMMDD.substr(0, 6)).get();
  }

  calendarDayGet(YYYYMMDD: string) {
    let fullday = YYYYMMDD.split("-")
    console.log(fullday);
    let yearmonthtime = fullday[0] + fullday[1];
    let YYYYMMDD_ = fullday[0] + fullday[1] + fullday[2];
    return this.afs.doc('CALENDARS/' + yearmonthtime).valueChanges()
    //return this.afs.collection('CALENDARS', ref => ref.where(YYYYMMDD_ + '', '==', YYYYMMDD_ + '')).get();
  }

  calendarMonthGetPromise(YYYYMM: string) {
    return firebase.firestore().doc('CALENDARS/' + YYYYMM).get();
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
  dayUpdateSlot(Day: iDay,SLOT:iSlot, index:number) {
    let DateId = Day.DateId
    let monthstr = Day.DateId.substr(0, 6);
    let day2Update = {};
    day2Update[DateId].Slots[index]=SLOT;
    console.log(day2Update);
    return this.afs.collection('CALENDARS').doc(monthstr).update(day2Update);
  }

  dayUpdateAfterBookingChange(BOOKING: iBooking) {
    return new Promise((resolve, reject) => {
      this.slotsOfDateGet(BOOKING.B_DAY.DateId)
        .then((res: any) => {
          let Day: iDay = res.DAY;
          let index = Day.Slots.map(Slot => Slot.SLOT).indexOf(BOOKING.B_SLOT);
          if(BOOKING.B_BA_BOOK.U_ROLE ==='BA' || BOOKING.B_BA_BOOK.U_ROLE ==='Admin' || BOOKING.B_BA_BOOK.U_ROLE ==='Manager')
          {
            Day.Slots[index].BAS_ID=BOOKING.B_BA_BOOK.U_ID; 
          }
          Day.Slots[index].STATUS = BOOKING.B_STATUS;
          Day.Slots[index].BOOK_ID = BOOKING.B_ID;
          console.log(Day);
          return this.dayUpdate(Day);
        })
        .then((res) => {
          resolve();
        })
        .catch(err => reject())
    })
  }

  dayUpdateAfterBookingChangeEmpty(BOOKING: iBooking) {
    return new Promise((resolve, reject) => {
      this.slotsOfDateGet(BOOKING.B_DAY.DateId)
        .then((res: any) => {
          let Day: iDay = res.DAY;
          let index = Day.Slots.map(Slot => Slot.SLOT).indexOf(BOOKING.B_SLOT);
          Day.Slots[index].STATUS = BOOKING.B_STATUS;
          Day.Slots[index].BOOK_ID = '';
          console.log(Day);
          return this.dayUpdate(Day);
        })
        .then((res) => {
          resolve();
        })
        .catch(err => reject())
    })
  }

  slotsOfDateGet(DateStr: string) {
    return new Promise((resolve, reject) => {
      firebase.firestore().doc('CALENDARS/' + DateStr.substr(0, 6)).get().then(docSnap => {
        let MONTH = docSnap.data();
        let DAY: iDay = MONTH[DateStr];
        resolve({ DAY: DAY });
      })
        .catch(err => {
          reject(err);
        })
    })
  }

  slotOfDateUpdate(DateStr: string, Slot: iSlot) {
    return new Promise((resolve, reject) => {
      this.slotsOfDateGet(DateStr)
        .then((res: any) => {
          let DAY: iDay = res.DAY;
          let SLOTS = DAY.Slots;
          let index = SLOTS.map(SLOT => SLOT.SLOT).indexOf(Slot.SLOT);
          DAY[index] = Slot;
          return this.dayUpdate(DAY)
        })
        .then(() => {
          resolve()
        })
        .catch(err => { reject(err) })
    })
  }


  dayUpdateAfterBookingChangex(BOOKING: iBooking) {
    console.log(BOOKING);
    let Day = BOOKING.B_DAY;
    let index = Day.Slots.map(Slot => Slot.SLOT).indexOf(BOOKING.B_SLOT);
    Day.Slots[index].STATUS = BOOKING.B_STATUS;
    Day.Slots[index].BOOK_ID = BOOKING.B_ID;
    console.log(Day);
    return this.dayUpdate(Day);
  }


  bookingsGetWithStateObservable(STATE: string, USER: iUser) {
    switch (USER.U_ROLE) {
      case 'Admin':
        // this.afs.collection('BOOKINGS').valueChanges().
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

  bookingsAllGet() {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('BOOKINGS').get()
        .then(qSnap => {
          let BOOKINGS = [];
          qSnap.forEach(qDoc => {
            let BOOKING = <iBooking>qDoc.data();
            BOOKINGS.push(BOOKING);
          })
          resolve({ BOOKINGS: BOOKINGS });
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  bookingsFromToGet(FROM: string, TO: string) {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('BOOKINGS')
        .where('B_DATE', '<=', TO)
        .where('B_DATE', '>=', FROM)
        .get()
        .then(qSnap => {
          let BOOKINGS = [];
          qSnap.forEach(qDoc => {
            let BOOKING = <iBooking>qDoc.data();
            BOOKINGS.push(BOOKING);
          })
          resolve({ BOOKINGS: BOOKINGS });
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  tokensGet() {
    return this.afs.collection('TOKENS').get();
  }

  tokenUpdate4User(UID: string, TOKEN: string) {
    let DATA = {
      TOKEN: TOKEN,
      UID: UID
    }
    return this.afs.doc('TOKENS/' + UID).set(DATA);
  }

  Msg2SendAdd(MESSAGE: any) {
    this.afs.collection('MESSAGES2SEND').add(MESSAGE);
  }

  sendNotification2Manager(BOOKING: iBooking) {
    // just create MESSAGES2SEND/doc
    if (BOOKING.B_STATUS == 'DRAFT') {
      this.tokensGet().subscribe(qSnap => {
        qSnap.forEach(doc => {
          let TOKEN = doc.data();
          let MSG2SEND = {
            msg: 'Có booking cần duyệt. Khách: ' + BOOKING.B_CUSTOMER_NAME,
            token: TOKEN.TOKEN
          }
          this.Msg2SendAdd(MSG2SEND);
        })
      })
    }
  }
}


