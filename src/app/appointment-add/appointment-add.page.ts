import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { LocalService } from '../services/local.service';
import { iFacial } from '../interfaces/ifacial.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iUser } from '../interfaces/user.interface';
import { CrudService } from '../services/crud.service';
import { ModalController, NavController, NavParams, AlertController } from '@ionic/angular';
import { iFacialCabin } from '../interfaces/facialcabin.interface';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { AppService } from '../services/app.service';
import { CalendarService } from '../services/calendar.service';
@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.page.html',
  styleUrls: ['./appointment-add.page.scss'],
})
export class AppointmentAddPage implements OnInit {
  BOOKING: iBooking;
  FACIALCABIN: iFacialCabin;
  CUSTOMER: iCustomer;
  USER: iUser;
  // ALERTADD: string = '';
  SEARCHED_CUSTOMERS = [];
  isSearched = false;
  data: any;
  Day: iDay;
  Slot: iSlot;
  index: number;
  searchPhoneStr: string;

  constructor(
    private navCtrl: NavController,
    private navPar: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private crudService: CrudService,
    private appService: AppService,
    private calendarService: CalendarService
  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    this.Day = this.data.selectedDay;

    var date_to_parse = new Date();
    var year = date_to_parse.getFullYear().toString();
    var month = (date_to_parse.getMonth() + 1).toString();
    var day = date_to_parse.getDate().toString();

    if (!this.Day) {
      this.Day = {
        Date: day,
        DateId: year + (month.length > 2 ? month : '0' + month) + day,
        Slots: [],
      }
    }
    else {
      this.Slot = this.data.Slot;
      this.index = this.data.index;
    }

    // this.FACIALCABIN = this.localService.FACIALCABIN_DEFAULT;
    // this.CUSTOMER = this.localService.CUSTOMER_DEFAULT;
    // this.USER = this.localService.USER_DEFAULT;

    // this.BOOKING.B_FACIAL = this.FACIALCABIN;
    // this.BOOKING.B_CUSTOMER = this.CUSTOMER;
    // this.BOOKING.B_STAFF = this.USER;
  }

  ngOnInit() {
    this.BOOKING = Object.assign({}, this.localService.BOOKING_DEFAULT);
    this.BOOKING.B_SLOT = this.Slot ? this.Slot.SLOT : '10:30'
    this.BOOKING.B_DATE = this.formatDate(this.Day.DateId);

    this.CUSTOMER = Object.assign({}, this.localService.CUSTOMER_DEFAULT);
    console.log(this.BOOKING);
  }



  formatDate(DateId: string) {
    let year = DateId.substr(0, 4);
    let month = DateId.substr(4, 2);
    let date = DateId.substr(6, DateId.length - 6);
    let finalDate = date.length < 2 ? '0' + date : date;
    return year + '-' + month + '-' + finalDate;
  }

  async confirmBookTimesInMonth() {
    let MSG = 'KH đã đặt lịch hẹn ngày ' + this.CUSTOMER.C_LAST_B_DATE + '. Bạn có chắc tiếp tục không?'
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: MSG,
      buttons: [
        {
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.doCancel();
          }
        }, {
          text: 'Chấp nhận',
          handler: () => {
            console.log('Confirm Okay');
            this.doAddAppointment();
          }
        }
      ]
    });

    await alert.present();
  }

  preCheckAddNewAppointment() {
    if (this.isAllowed2BookTimesInMonth()) {
      this.doAddAppointment();
      this.BOOKING.B_STATUS = 'BOOKED';
    } else {
      this.BOOKING.B_STATUS = 'DRAFT';
      this.confirmBookTimesInMonth();
    }

  }

  isFullFilled() {
    if (
      !this.BOOKING.B_CUSTOMER_NAME ||
      !this.BOOKING.B_CUSTOMER_PHONE
    ) {
      return false;
    }
    return true;
  }

  doAddAppointment() {
    this.BOOKING.B_CREATED_TIME = new Date().toISOString();
    this.CUSTOMER.C_NAME = this.BOOKING.B_CUSTOMER_NAME;
    this.CUSTOMER.C_PHONE = this.BOOKING.B_CUSTOMER_PHONE;
    let currentUser = this.localService.USER;

    // update BA_BOOK info
    this.BOOKING.B_BA_BOOK_ID = currentUser.U_ID;
    this.BOOKING.B_BA_BOOK_NAME = currentUser.U_NAME;
    this.BOOKING.B_BA_BOOK = currentUser;
    // this.BOOKING.B_STATUS = 'BOOKED';
    console.log(this.BOOKING);
    if (this.BOOKING.B_isNewCustomer) {
      this.createBookingWithNewCustomer();
    } else {
      this.createBookingWithExistingCustomer();
    }
  }

  createBookingWithExistingCustomer() {
    let newBooking: iBooking;
    this.crudService.bookingCreateWithExistingCustomer(this.BOOKING)
      .then((res: any) => {
        newBooking = res.BOOKING;
        console.log(newBooking);
        this.resetData();
        this.doUpdateCalendarsForDay(newBooking);
      })
      .then(() => {
        this.doDismiss(newBooking);
      })
      .catch((err) => {
        console.log(err);
        // this.ALERTADD = 'Add new Booking fail';
      })
  }

  createBookingWithNewCustomer() {
    let newBooking: iBooking;
    this.crudService.bookingCreateWithNewCustomer(this.BOOKING, this.CUSTOMER)
      .then((res: any) => {
        newBooking = res.BOOKING;
        console.log(newBooking);
        this.resetData();
        this.doUpdateCalendarsForDay(newBooking);
      })
      .then(() => {
        this.doDismiss(newBooking);
      })
      .catch((err) => {
        console.log(err);
        // this.ALERTADD = 'Add new Booking fail';
      })
  }

  doUpdateCalendarsForDay(newBooking: iBooking) {
    // alert booking success;
    this.appService.toastWithOptionsShow('Thành công!');
    // update CALENDARS/DATE/{}
    this.Day.Slots[this.index].BOOK_ID = newBooking.B_ID;
    this.Day.Slots[this.index].STATUS = newBooking.B_STATUS;
    return this.crudService.dayUpdate(this.Day)
  }

  doCancel() {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({ BOOKING: this.BOOKING, isCancel: true });
    }).catch(err => { console.log(err) });
  }

  doDismiss(data: any) {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({ BOOKING: this.BOOKING, isCancel: false, data: data });
    }).catch(err => { console.log(err) });
  }

  // changeNewCustomer() {
  //   this.BOOKING.B_1stTIME = this.BOOKING.B_isNewCustomer;
  // }


  searchPhone(phone: string) {
    this.searchPhoneStr = phone;
    this.isSearched = true;
    console.log(this.searchPhoneStr);
    this.SEARCHED_CUSTOMERS = [];
    let phoneStr = this.searchPhoneStr.trim();
    if (phoneStr.length < 1) return;
    this.crudService.customerGetByPhone(phoneStr)
      .get().subscribe((qSnap) => {
        console.log(qSnap);
        qSnap.forEach(docSnap => {
          let CUSTOMER = <iCustomer>docSnap.data();
          console.log(CUSTOMER)
          this.SEARCHED_CUSTOMERS.push(CUSTOMER);
        })
      })
  }

  selectCustomer(CUSTOMER: iCustomer) {
    this.CUSTOMER = CUSTOMER;
    this.isSearched = false;
    this.searchPhoneStr = '';
    this.BOOKING.B_CUSTOMER = CUSTOMER;
    this.BOOKING.B_CUSTOMER_ID = CUSTOMER.C_ID;
    this.BOOKING.B_CUSTOMER_NAME = CUSTOMER.C_NAME;
    this.BOOKING.B_CUSTOMER_PHONE = CUSTOMER.C_PHONE;
    this.BOOKING.B_CUSTOMER_VIPCODE = CUSTOMER.C_VIPCODE;
    if (!this.isAllowed2BookTimesInMonth()) {
      let dateStr = this.calendarService.convertDate(this.CUSTOMER.C_LAST_B_DATE)
      this.appService.alertConfirmationShow('Oops', 'KH đã đặt lịch hẹn ngày ' + dateStr);
    }
  }

  isAllowed2BookTimesInMonth() {
    let lastBookYYYYMM = this.CUSTOMER.C_LAST_B_DATE.substr(0, 7)
    let bookingYYYYMM = this.BOOKING.B_DATE.substr(0, 7)
    return lastBookYYYYMM !== bookingYYYYMM
  }


  resetData() {
    this.CUSTOMER = this.localService.CUSTOMER_DEFAULT;
    this.BOOKING = this.localService.BOOKING_DEFAULT;
  }

}
