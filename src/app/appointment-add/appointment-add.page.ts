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
import { LoadingService } from '../loading.service';
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
  selectedCUSTOMER: iCustomer = null;
  isSearched = false;
  data: any;
  Day: iDay;
  Slot: iSlot;
  index: number;
  searchPhoneStr: string;
  isCustomerExistingChecked: boolean = false;
  isFirstTimeUsedApp: boolean = false;
  constructor(
    private navCtrl: NavController,
    private navPar: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private crudService: CrudService,
    private appService: AppService,
    private calendarService: CalendarService,
    private loadingService: LoadingService,
  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    this.Day = this.data.selectedDay;

    var date_to_parse = new Date();
    var year = date_to_parse.getFullYear().toString();
    var month = (date_to_parse.getMonth() + 1).toString();
    var day = date_to_parse.getDate().toString();
    let _month = month.length > 2 ? month : '0' + month;
    let _day = day.length > 2 ? month : '0' + month;
    if (!this.Day) {
      this.Day = {
        Date: day,
        DateId: year + _month + _day,
        Slots: [],
        date: _month + '/' + _day,
        isThePast: false
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

    // update Specialist
    this.BOOKING.B_SPECIALIST_ID = this.Slot.SPE_ID;
    this.BOOKING.B_SPECIALIST_NAME = this.Slot.SPE_NAME
    this.getSpecialistInfo(this.Slot.SPE_ID);

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

  doAddBooking() {
    if (!this.isCustomerExistingChecked) {
      this.checkIfCustomerExisting();
    } else {
      this.preCheckAddNewAppointment();
    }
  }

  async makeConfirm1(MSG: string) {
    console.log(this.BOOKING, MSG);
    // let LAST_B_DATE = this.calendarService.convertDate(this.CUSTOMER.C_LAST_B_DATE);
    // let MSG = 'KH đã đặt lịch hẹn ngày ' + LAST_B_DATE + '. Bạn có chắc tiếp tục không?'
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận!',
      message: MSG,
      buttons: [
        {
          text: 'Không',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // this.doCancel();
          }
        }, {
          text: 'Có',
          handler: () => {
            console.log('Confirm Okay');
            this.doAddAppointment();

          }
        }
      ]
    });

    await alert.present();
  }

  // preCheckAddNewAppointment() {
  //   let MSG = ''
  //   if (this.isNotBooking2TimesInMonth() && this.CUSTOMER.C_isSUBLIMAGE && this.BOOKING.B_SUBLIMAGE) {
  //     this.doAddAppointment();
  //     this.BOOKING.B_STATUS = 'BOOKED';
  //     this.BOOKING.B_STATUS_VI = 'ĐÃ ĐẶT';
  //   } else {
  //     this.BOOKING.B_STATUS = 'DRAFT';
  //     this.BOOKING.B_STATUS_VI = 'CHỜ DUYỆT';
  //     this.CUSTOMER.C_BOOK_STATE = 'DRAFT';
  //     if (!this.isNotBooking2TimesInMonth())
  //       MSG += '- Khách đã book trong tháng. <br/>'
  //     if (!this.CUSTOMER.C_isSUBLIMAGE)
  //       MSG += '- Khách chưa là KH Sublimage. <br/>';
  //     if (!this.BOOKING.B_SUBLIMAGE)
  //       MSG += '- Bạn chưa chọn dịch vụ Sublimage. <br/>'

  //     MSG += '<br/>Bạn có chắc tiếp tục không?'
  //     console.log(MSG);
  //     console.log(this.isNotBooking2TimesInMonth(), this.CUSTOMER.C_isSUBLIMAGE, this.BOOKING.B_SUBLIMAGE)
  //     this.confirmBookTimesInMonth(MSG);
  //   }
  // }

  // New rule after meeting 2019/03/08
  preCheckAddNewAppointment() {
    console.log(this.CUSTOMER, this.BOOKING);
    let MSG = ''
    // khi KH sub book 2 lan trong thang
    this.BOOKING.B_STATUS = 'BOOKED';
    this.BOOKING.B_STATUS_VI = 'ĐÃ ĐẶT';
    this.CUSTOMER.C_BOOK_STATE = 'BOOKED';
    // Khách sub book lần 2 trong tháng
    if (this.isBooking2TimesInMonth(this.CUSTOMER, this.BOOKING) && this.CUSTOMER.C_isSUBLIMAGE) {
      this.BOOKING.B_STATUS = 'DRAFT';
      this.BOOKING.B_STATUS_VI = 'CHỜ DUYỆT';
      this.CUSTOMER.C_BOOK_STATE = 'DRAFT';
      let NAME = '<strong>' + this.CUSTOMER.C_NAME + '</strong>'
      MSG += 'Khách ' + NAME + ' Sublimage book lần 2 trong tháng. <br/>'
    }

    // Khách thường book lần thứ 2
    if (!this.CUSTOMER.C_isSUBLIMAGE && this.CUSTOMER.C_PHONE.length > 0) {
      this.BOOKING.B_STATUS = 'DRAFT';
      this.BOOKING.B_STATUS_VI = 'CHỜ DUYỆT';
      this.CUSTOMER.C_BOOK_STATE = 'DRAFT';
      let NAME = '<strong>' + this.CUSTOMER.C_NAME + '</strong>'
      MSG += 'Khách ' + NAME + ' book lần 2. <br/>'
    }

    if (
      !this.BOOKING.B_PERFUME &&
      !this.BOOKING.B_MAKEUP &&
      !this.BOOKING.B_CSCU &&
      !this.BOOKING.B_SUBLIMAGE &&
      !this.BOOKING.B_LELIFT &&
      !this.BOOKING.B_FASHION) {
      MSG = 'Bạn vui lòng chọn phân nhóm Khách hàng. <br/>'
      this.appService.alertShow('Chú ý', null, MSG);
      return;
    }
    MSG += '<br/>Bạn có chắc tiếp tục không?'

    this.makeConfirm1(MSG);

    // if (this.isNotBooking2TimesInMonth() && this.BOOKING.B_SUBLIMAGE) {
    //   this.doAddAppointment();
    //   this.BOOKING.B_STATUS = 'BOOKED';
    //   this.BOOKING.B_STATUS_VI = 'ĐÃ ĐẶT';
    // } else {
    //   this.BOOKING.B_STATUS = 'DRAFT';
    //   this.BOOKING.B_STATUS_VI = 'CHỜ DUYỆT';
    //   this.CUSTOMER.C_BOOK_STATE = 'DRAFT';
    //   if (!this.isNotBooking2TimesInMonth())
    //     MSG += '- Khách đã book trong tháng. <br/>'
    //   if (!this.CUSTOMER.C_isSUBLIMAGE)
    //     MSG += '- Khách chưa là KH Sublimage. <br/>';
    //   if (!this.BOOKING.B_SUBLIMAGE)
    //     MSG += '- Bạn chưa chọn dịch vụ Sublimage. <br/>'

    //   MSG += '<br/>Bạn có chắc tiếp tục không?'
    //   console.log(MSG);
    //   console.log(this.isNotBooking2TimesInMonth(), this.CUSTOMER.C_isSUBLIMAGE, this.BOOKING.B_SUBLIMAGE)
    //   this.confirmBookTimesInMonth(MSG);
    // }
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

  checkIfCustomerExisting() {
    this.isCustomerExistingChecked = true;
    this.crudService.customerGetByPhone(this.BOOKING.B_CUSTOMER_PHONE).subscribe(qSnap => {
      console.log(qSnap);
      if (qSnap.empty) {
        console.log('customer info not exit');
        // this.createBookingWithNotExistingCustomer();
        this.isFirstTimeUsedApp = true;
        this.preCheckAddNewAppointment();
      } else {
        this.isFirstTimeUsedApp = false;
        let CUSTOMERS = [];
        qSnap.forEach(docSnap => {
          let CUSTOMER = <iCustomer>docSnap.data();
          CUSTOMERS.push(CUSTOMER);
        })
        this.CUSTOMER = CUSTOMERS[0];
        console.log(this.CUSTOMER);
        this.BOOKING.B_CUSTOMER = this.CUSTOMER;
        this.BOOKING.B_CUSTOMER_ID = this.CUSTOMER.C_ID;
        this.BOOKING.B_CUSTOMER_NAME = this.CUSTOMER.C_NAME;
        this.BOOKING.B_CUSTOMER_PHONE = this.CUSTOMER.C_PHONE;
        this.BOOKING.B_CUSTOMER_VIPCODE = this.CUSTOMER.C_VIPCODE;
        this.BOOKING.B_PERFUME = typeof (this.CUSTOMER.C_PERFUME) == 'undefined' ? false : this.CUSTOMER.C_PERFUME;
        this.BOOKING.B_MAKEUP = typeof (this.CUSTOMER.C_MAKEUP) == 'undefined' ? false : this.CUSTOMER.C_MAKEUP;
        this.BOOKING.B_CSCU = typeof (this.CUSTOMER.C_CSCU) == 'undefined' ? false : this.CUSTOMER.C_CSCU;
        this.BOOKING.B_SUBLIMAGE = typeof (this.CUSTOMER.C_SUBLIMAGE) == 'undefined' ? false : this.CUSTOMER.C_SUBLIMAGE;
        this.BOOKING.B_LELIFT = typeof (this.CUSTOMER.C_LELIFT) == 'undefined' ? false : this.CUSTOMER.C_LELIFT;
        this.BOOKING.B_FASHION = typeof (this.CUSTOMER.C_FASHION) == 'undefined' ? false : this.CUSTOMER.C_FASHION;
        let NAME = '<strong>' + this.CUSTOMER.C_NAME + '</strong>'
        let Message = 'Thông tin khách ' + NAME + ' đã được cập nhật.<br/><br/>' + 'Vui lòng kiểm tra trước khi tạo lịch hẹn'
        this.appService.alertShow('Chú ý:', null, Message);
      }
    })
  }


  doAddAppointment() {
    this.BOOKING.B_CREATED_TIME = new Date().toISOString();
    this.CUSTOMER.C_NAME = this.BOOKING.B_CUSTOMER_NAME;
    this.CUSTOMER.C_PHONE = this.BOOKING.B_CUSTOMER_PHONE;
    this.CUSTOMER.C_VIPCODE = this.BOOKING.B_CUSTOMER_VIPCODE;
    this.CUSTOMER.C_isNewCustomer = this.BOOKING.B_isNewCustomer
    let currentUser = this.localService.USER;

    // update BA_BOOK info
    this.BOOKING.B_BA_BOOK_ID = currentUser.U_ID;
    this.BOOKING.B_BA_BOOK_NAME = currentUser.U_NAME;
    this.BOOKING.B_BA_BOOK = currentUser;


    // Update Slot;
    this.BOOKING.B_DAY = this.Day;
    console.log(this.BOOKING);

    if (this.isFirstTimeUsedApp) {
      this.createBookingWithNotExistingCustomer();
    } else {
      this.createBookingWithExistingCustomer();
    }
  }

  getSpecialistInfo(ID: string) {
    this.crudService.userGet(ID).subscribe(res => {
      let USER = <iUser>res.data();
      console.log(USER);
      this.BOOKING.B_SPECIALIST_NAME = USER.U_FULLNAME;
      this.BOOKING.B_SPECIALIST = USER;
    })
  }

  createBookingWithExistingCustomer() {
    this.loadingService.presentLoading()
    let newBooking: iBooking;
    this.crudService.bookingCreateWithExistingCustomer(this.BOOKING)
      // .then((res: any) => {
      //   newBooking = res.BOOKING;
      //   console.log(newBooking);
      //   this.resetData();
      //   return this.doUpdateCalendarsForDay(newBooking);
      // })
      // .then((res)=>{
      //   console.log(this.CUSTOMER);
      //   return this.crudService.customerUpdate(this.CUSTOMER);
      // })
      .then(() => {
        this.loadingService.loadingDissmiss();
        this.doDismiss(newBooking);
      })
      .catch((err) => {
        console.log(err);
        this.loadingService.loadingDissmiss();
        // this.ALERTADD = 'Add new Booking fail';
      })
  }

  createBookingWithNotExistingCustomer() {
    this.loadingService.presentLoading()
    console.log(this.BOOKING, this.CUSTOMER);
    let newBooking: iBooking;
    this.crudService.bookingCreateWithNewCustomer(this.BOOKING, this.CUSTOMER)
      .then((res: any) => {
        newBooking = res.BOOKING;
        console.log(newBooking);
        this.resetData();
        // this.doUpdateCalendarsForDay(newBooking);

        this.loadingService.loadingDissmiss();
        this.doDismiss(newBooking);
      })
      // .then(() => {
      //   this.doDismiss(newBooking);
      //   this.loadingService.loadingDissmiss();
      // })
      .catch((err) => {
        console.log(err);
        this.loadingService.loadingDissmiss();
        // this.ALERTADD = 'Add new Booking fail';
      })
  }

  // doUpdateCustomer(CUSTOMER: iCustomer, BOOKING: iBooking) {
  //   if (BOOKING.B_SUBLIMAGE) {
  //     CUSTOMER.C_isSUBLIMAGE = true;
  //     CUSTOMER.C_LAST_B_ID = BOOKING.B_ID;
  //     CUSTOMER.C_LAST_B_DATE = BOOKING.B_DATE;
  //     CUSTOMER.C_LAST_B_SLOT = BOOKING.B_SLOT;
  //     CUSTOMER.C_BOOKINGS.push({ ID: BOOKING.B_ID, DATE: BOOKING.B_DATE, SLOT: BOOKING.B_SLOT });
  //   }
  // }



  doUpdateCalendarsForDay(newBooking: iBooking) {
    // alert booking success;

    // this.appService.toastWithOptionsShow('Thành công!');
    this.appService.toastShow('Thành công!', 3000);
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

  searchPhone(phone: string) {
    this.searchPhoneStr = phone;
    this.isSearched = true;
    console.log(this.searchPhoneStr);
    this.SEARCHED_CUSTOMERS = [];
    let phoneStr = this.searchPhoneStr.trim();
    if (phoneStr.length < 1) return;
    this.crudService.customerGetByPhone(phoneStr)
      .subscribe((qSnap) => {
        console.log(qSnap);
        qSnap.forEach(docSnap => {
          let CUSTOMER = <iCustomer>docSnap.data();
          console.log(CUSTOMER)
          this.SEARCHED_CUSTOMERS.push(CUSTOMER);
        })
      })
  }

  selectCustomer(CUSTOMER: iCustomer) {
    this.selectedCUSTOMER = CUSTOMER
    this.CUSTOMER = CUSTOMER;
    this.isSearched = false;
    this.searchPhoneStr = '';
    this.BOOKING.B_CUSTOMER = this.CUSTOMER;
    this.BOOKING.B_CUSTOMER_ID = this.CUSTOMER.C_ID;
    this.BOOKING.B_CUSTOMER_NAME = this.CUSTOMER.C_NAME;
    this.BOOKING.B_CUSTOMER_PHONE = this.CUSTOMER.C_PHONE;
    this.BOOKING.B_CUSTOMER_VIPCODE = this.CUSTOMER.C_VIPCODE;
    this.BOOKING.B_PERFUME = typeof (this.CUSTOMER.C_PERFUME) == 'undefined' ? false : this.CUSTOMER.C_PERFUME;
    this.BOOKING.B_MAKEUP = typeof (this.CUSTOMER.C_MAKEUP) == 'undefined' ? false : this.CUSTOMER.C_MAKEUP;
    this.BOOKING.B_CSCU = typeof (this.CUSTOMER.C_CSCU) == 'undefined' ? false : this.CUSTOMER.C_CSCU;
    this.BOOKING.B_SUBLIMAGE = typeof (this.CUSTOMER.C_SUBLIMAGE) == 'undefined' ? false : this.CUSTOMER.C_SUBLIMAGE;
    this.BOOKING.B_LELIFT = typeof (this.CUSTOMER.C_LELIFT) == 'undefined' ? false : this.CUSTOMER.C_LELIFT;
    this.BOOKING.B_FASHION = typeof (this.CUSTOMER.C_FASHION) == 'undefined' ? false : this.CUSTOMER.C_FASHION;
    if (this.isBooking2TimesInMonth(this.CUSTOMER, this.BOOKING)) {
      let dateStr = this.calendarService.convertDate(this.CUSTOMER.C_LAST_B_DATE)
      this.appService.alertShow('Chú ý', null, 'KH đã đặt lịch hẹn ngày ' + dateStr);
    }
    this.isCustomerExistingChecked = true;
  }

  isNotBooking2TimesInMonth() {
    let lastBookYYYYMM = this.CUSTOMER.C_LAST_B_DATE.substr(0, 7)
    let bookingYYYYMM = this.BOOKING.B_DATE.substr(0, 7)
    return lastBookYYYYMM !== bookingYYYYMM
  }

  isBooking2TimesInMonth(CUSTOMER: iCustomer, BOOKING: iBooking) {
    let lastBookYYYYMM = CUSTOMER.C_LAST_B_DATE.substr(0, 7)
    let bookingYYYYMM = BOOKING.B_DATE.substr(0, 7)
    return lastBookYYYYMM == bookingYYYYMM
  }

  isSublimageCustomerAndBook2TimesInMonth(CUSTOMER: iCustomer, BOOKING: iBooking) {
    if (this.isBooking2TimesInMonth(CUSTOMER, BOOKING) && CUSTOMER.C_isSUBLIMAGE) {
      return true;
    }
  }



  resetData() {
    this.CUSTOMER = this.localService.CUSTOMER_DEFAULT;
    this.BOOKING = this.localService.BOOKING_DEFAULT;
  }



}
