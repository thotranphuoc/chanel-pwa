import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { AppService } from '../services/app.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { Subscription } from 'rxjs';
import { SetgetService } from '../services/setget.service';
import { AppointmentCalendarEditNewPage } from '../appointment-calendar-edit-new/appointment-calendar-edit-new.page';
import { LoadingService } from '../loading.service';
import { SearchPage } from '../search/search.page';
import { iEvent } from '../interfaces/event.interface';
import { DbService } from '../services/db.service';
@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage implements OnInit {
  _BOOKING: iBooking;
  BOOKING: iBooking;
  data: any;
  Day: iDay;
  Slot: iSlot;
  index: number;
  USER: iUser;
  sub1: Subscription;
  sub2: Subscription;
  BAs: iUser[] = [];
  selectedBA: iUser;
  isPast:any= false;
  RIGHTS = {
    Admin: [{ VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    Manager: [{ VI: 'CHỜ DUYỆT', EN: 'DRAFT' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    Specialist: [{ VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }],
    BA: [{ VI: 'HUỶ BỎ', EN: 'CANCELED' }],
    BAS: [{ VI: 'HUỶ BỎ', EN: 'CANCELED' }],
    FA: [{ VI: 'HUỶ BỎ', EN: 'CANCELED' }],
  }
  isStateChanged: boolean = false;
  isEventViewed: boolean = false;
  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private crudService: CrudService,
    private appService: AppService,
    private localService: LocalService,
    public modalController: ModalController,
    private setGetService: SetgetService,
    private loadingService: LoadingService,
    private dbService: DbService,
  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    if (this.data.isOnCalendar) {
      this.Slot = this.data.Slot;
      this.Day = this.data.selectedDay;
    }
    this.USER = this.localService.USER;
  }

  ngOnDestroy() {
    if (typeof (this.sub1) !== 'undefined') this.sub1.unsubscribe();
    if (typeof (this.sub2) !== 'undefined') this.sub2.unsubscribe();
  }

  ngOnInit() {
    console.log('ngOnInit');
    if (this.data.isOnCalendar) {
      this.sub1 = this.crudService.bookingGet(this.Slot.BOOK_ID)
        .subscribe(docSnap => {
          console.log(docSnap);
          let BOOKINGS = <iBooking>docSnap.data();
          console.log(BOOKINGS);
          this.BOOKING = BOOKINGS;
          this._BOOKING = Object.assign({}, BOOKINGS);
          this.selectedBA = this.BOOKING.B_BA_SELL;
        })
    } else {
      let BOOKING = this.data.BOOKING;
      console.log(BOOKING);
      this.BOOKING = BOOKING;
      this._BOOKING = Object.assign({}, BOOKING);
      this.selectedBA = this.BOOKING.B_BA_SELL;
    }
    this.getBAs();
  }

  updateBooking() {
    if (this.BOOKING.B_STATUS == 'COMPLETED' && !(this.USER.U_ROLE == 'Specialist' || this.USER.U_ROLE == 'Manager')) {
      this.appService.alertConfirmationShow('Opps', 'Bạn không có quyền close Booking');
      return;
    }
    this.doUpdateBooking();
  }

  doUpdateBooking() {
    this.loadingService.presentLoading();
    // update Specialist when setting completed
    if (this.BOOKING.B_STATUS == 'COMPLETED' && this.isStateChanged) {
      this.BOOKING.B_SPECIALIST = this.USER;
      this.BOOKING.B_SPECIALIST_ID = this.USER.U_ID;
      this.BOOKING.B_SPECIALIST_NAME = this.USER.U_FULLNAME;

      this.dbService.logAdd(this.USER.U_ID, this.USER.U_FULLNAME,this.USER.U_ROLE,'Update status COMPLETED for Customer ' + this.BOOKING.B_CUSTOMER_NAME + ' day ' + this.Day.date + ' slot ' + this.BOOKING.B_SLOT)
          .then((res) => {
            console.log('Update log');
            console.log(res);
            //return this.updateScoreAndLevel()
          })
          .catch(err => {
            console.log(err);
          })

    }
    // update User who cancel booking
    if (this.BOOKING.B_STATUS == 'CANCELED' && this.isStateChanged) {
      this.BOOKING.B_CANCELED_BY_USER = this.USER;

      this.dbService.logAdd(this.USER.U_ID, this.USER.U_FULLNAME,this.USER.U_ROLE,'Update status CANCELED for Customer ' + this.BOOKING.B_CUSTOMER_NAME + ' day ' + this.Day.date + ' slot ' + this.BOOKING.B_SLOT)
          .then((res) => {
            console.log('Update log');
            console.log(res);
            //return this.updateScoreAndLevel()
          })
          .catch(err => {
            console.log(err);
          })
    }
    if (this.BOOKING.B_STATUS == 'DRAFT' && this.isStateChanged) {
        this.BOOKING.B_DAY.isDraff=true;
      }
    let EVENT: iEvent = {
      E_ACTION_EN: this.BOOKING.B_STATUS,
      E_ACTION_VI: this.BOOKING.B_STATUS_VI,
      E_BY_FNAME: this.USER.U_FULLNAME,
      E_BY_UID: this.USER.U_ID,
      E_TIME: this.appService.getCurrentDateAndTime()
    }
    if (!this.BOOKING.B_EVENTS) {
      this.BOOKING['B_EVENTS'] = [];
    }
    if (this.isStateChanged) {
      this.BOOKING.B_EVENTS.push(EVENT);
    }
    this.crudService.bookingUpdate(this.BOOKING)
      .then(res => {
        console.log(res);

    //  this.dbService.logAdd(this.USER.U_ID, this.USER.U_FULLNAME,this.USER.U_ROLE,'Update for Customer ' + this.BOOKING.B_CUSTOMER_NAME + ' day ' + this.Day.date + ' slot ' + this.BOOKING.B_SLOT)
    // .then((res) => {
    //   console.log('Update log');
    //   console.log(res);
    //   //return this.updateScoreAndLevel()
    // })
    // .catch(err => {
    //   console.log(err);
    // })
        this.doDismiss(null);
        this.loadingService.loadingDissmiss();
      })
      .catch(err => {
        console.log(err);
        this.loadingService.loadingDissmiss();
      })
  }

  doDismiss(data: any) {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({ BOOKING: this.BOOKING, isCancel: false, data: data });
    }).catch(err => { console.log(err) });
  }

  doCancel() {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({ BOOKING: this.BOOKING, isCancel: true });
    }).catch(err => { console.log(err) });
  }


  async changeTimeSlot() {
    this.doCancel();
    console.log('Chay chon thay doi ngay');
    // const modal = await this.modalController.create({
    //   component: AppointmentCalendarEditPage,
    //   componentProps: { selectedDay: this.Day, Slot: this.Slot, index: this.index, BOOKING: this.BOOKING }
    // });
    const modal = await this.modalController.create({
      component: AppointmentCalendarEditNewPage,
      componentProps: { selectedDay: this.Day, Slot: this.Slot, index: this.index, BOOKING: this.BOOKING }
    });
    await modal.present();
    const data: any = await modal.onDidDismiss();
    console.log(data);
    this.Day = data.Day;
    this.Slot = data.Slot;
    this.index = data.index;
    this.BOOKING = data.BOOKING;
  }

  getBAs() {
    this.sub2 = this.crudService.usersGet().subscribe(qSnap => {
      let USERS = [];
      qSnap.forEach(docSnap => {
        let USER = <iUser>docSnap.data();
        USERS.push(USER);
      })
      this.BAs = USERS.filter(U => (U.U_ROLE == 'Specialist' || U.U_ROLE == 'BAS')).sort((a, b) => {
        if (a.U_NAME > b.U_NAME) return 1;
        if (a.U_NAME < b.U_NAME) return -1;
        return 0;
      });
      console.log(this.BAs);
    })
  }

  async setTotal() {
    const alert = await this.alertCtrl.create({
      header: 'Tổng',
      inputs: [
        {
          name: 'total',
          type: 'number',
          placeholder: 'Nhập tổng số tiền ...'
        }
      ],
      buttons: [
        {
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Chấp nhận',
          handler: (data) => {
            console.log('Confirm Ok', data);
            this.BOOKING.B_TOTAL = data.total;
          }
        }
      ]
    });

    await alert.present();
  }
  async setBASelling() {
    const modal = await this.modalController.create({
      component: SearchPage,
      componentProps: { BAs: this.BAs }
    });
    await modal.present();
    const res: any = await modal.onDidDismiss();
    console.log(res);
    if (res && typeof (res) !== 'undefined') {
      let BA_SALE = res.data.selectedBA;
      if (BA_SALE) {
        this.BOOKING.B_BA_SELL = BA_SALE;
        this.BOOKING.B_BA_SELL_ID = BA_SALE.U_ID;
        this.BOOKING.B_BA_SELL_NAME = BA_SALE.U_FULLNAME;
      }
    }
  }

  async setBookingStatus() {
    if (this.USER.U_ROLE == 'Specialist' && this.BOOKING.B_STATUS == 'COMPLETED') return;
    let STATES = this.RIGHTS[this.USER.U_ROLE];
    let INPUTS = [];

    STATES.forEach(STATE => {
      let INP = {
        name: 'radio1',
        type: 'radio',
        label: STATE.VI,
        value: STATE,
      }
      INPUTS.push(INP);
    })
    const alert = await this.alertCtrl.create({
      header: 'TRẠNG THÁI',
      inputs: INPUTS,
      buttons: [
        {
          text: 'Quay lại',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Chấp nhận',
          handler: (data: any) => {
            console.log(data);
            if (this._BOOKING.B_STATUS !== data.EN) {
              this.isStateChanged = true
              this.BOOKING.B_STATUS = data.EN;
              this.BOOKING.B_STATUS_VI = data.VI;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  isDisabled2UpdateBooking() {
    console.log(this.isPast);
    
    if (!this.BOOKING) return false;
    if (this.USER.U_ROLE !== 'Manager' && this.BOOKING.B_STATUS == 'DRAFT') return true;
    if (this.USER.U_ROLE !== 'Manager' && this.USER.U_ROLE !== 'Specialist' && this.BOOKING.B_STATUS == 'COMPLETED') return true;
    if (this.isCheckPastday())
    {
      if (this.USER.U_ROLE === 'Manager' || this.USER.U_ROLE === 'Admin')
        return false
      else
        return true;
    } 
    return false;
  }

  isCheckPastday() {
    let TODAY = this.getTodayString();
    //console.log(Number(TODAY) > Number(this.BOOKING.B_DAY.DateId));
    return (Number(TODAY) > Number(this.BOOKING.B_DAY.DateId));
  }

  getTodayString() {
    let date_to_parse = new Date();
    let year = date_to_parse.getFullYear().toString();
    let month = (date_to_parse.getMonth() + 1).toString();
    let finalMonth = month.length > 2 ? month : '0' + month
    let day = date_to_parse.getDate().toString();
    let finalDay = day.length < 2 ? '0' + day : day;
    let TODAY = year + finalMonth + finalDay;
    //console.log(TODAY);
    return TODAY;
  }


  isDisabled2ChangeState() {
    if (!this.BOOKING) return false;
    if (this.USER.U_ROLE !== 'Manager' && this.BOOKING.B_STATUS == 'DRAFT') return true;
    if (this.USER.U_ROLE !== 'Manager' && this.USER.U_ROLE !== 'Specialist' && this.BOOKING.B_STATUS == 'COMPLETED') return true;
    if (this.BOOKING.B_STATUS == 'CANCELED') return true;
    return false;
  }

  isChangeSlotDisabled() {
    if (!this.BOOKING) return false;
    if (this.BOOKING.B_STATUS == 'COMPLETED' || this.BOOKING.B_STATUS == 'EXPIRED') return true;
    return false;
  }

  viewEvent() {
    console.log(this.isEventViewed);
    this.isEventViewed = !this.isEventViewed;
  }


}
