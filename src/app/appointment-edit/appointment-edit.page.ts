import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { AppService } from '../services/app.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { AppointmentCalendarEditPage } from '../appointment-calendar-edit/appointment-calendar-edit.page';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage implements OnInit {
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
  RIGHTS = {
    Admin: [{ VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    Manager: [{ VI: 'TẠM', EN: 'DRAFT' }, { VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    Specialist: [{ VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    BA: [{ VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    BAS: [{ VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
    FA: [{ VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
  }

  // RIGHTS = {
  //   Admin: [{ VI: 'TẠM', EN: 'DRAFT' }, { VI: 'TRỐNG', EN: 'AVAILABLE' }, { VI: 'ĐÃ ĐẶT', EN: 'BOOKED' }, { VI: 'HOÀN THÀNH', EN: 'COMPLETED' }, { VI: 'HUỶ BỎ', EN: 'CANCELED' }, { VI: 'HẾT HẠN', EN: 'EXPIRED' }],
  //   Manager: ['DRAFT', 'AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELED', 'EXPIRED'],
  //   Specialist: ['AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELED', 'EXPIRED'],
  //   BA: ['AVAILABLE', 'BOOKED', 'CANCELED', 'EXPIRED'],
  //   FA: ['AVAILABLE', 'BOOKED', 'CANCELED', 'EXPIRED']
  // }
  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private crudService: CrudService,
    private appService: AppService,
    private localService: LocalService,
    public modalController: ModalController,

  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    this.Slot = this.data.Slot;
    this.Day = this.data.selectedDay;
    this.USER = this.localService.USER;
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.sub1 = this.crudService.bookingGet(this.Slot.BOOK_ID)
      .subscribe(docSnap => {
        console.log(docSnap);
        let BOOKING = <iBooking>docSnap.data();
        console.log(BOOKING);
        this.BOOKING = BOOKING;
        this.selectedBA = this.BOOKING.B_BA_SELL;
      })
    this.getBAs();
  }

  updateBooking() {
    // if (this.BOOKING.B_STATUS == 'COMPLETED' && this.BOOKING.B_TOTAL < 1) {
    //   this.appService.alertConfirmationShow('Opps', 'Nhập số tiền trước khi close Booking');
    //   return;
    // }

    if (this.BOOKING.B_STATUS == 'COMPLETED' && !(this.USER.U_ROLE == 'Specialist' || this.USER.U_ROLE == 'Manager')) {
      this.appService.alertConfirmationShow('Opps', 'Bạn không có quyền close Booking');
      return;
    }
    this.doUpdateBooking();
  }

  doUpdateBooking() {
    this.crudService.bookingUpdate(this.BOOKING)
      .then(res => {
        console.log(res);
        // update CALENDARS/DATE/{}
        return this.doUpdateCalendarsForDay(this.BOOKING);
      })
      .then(() => {
        this.doDismiss(null);
      })
      .catch(err => {
        console.log(err);
      })
  }

  doUpdateCalendarsForDay(Booking: iBooking) {
    // update CALENDARS/DATE/{}
    this.Day.Slots[this.index].STATUS = Booking.B_STATUS;
    return this.crudService.dayUpdate(this.Day)
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
    const modal = await this.modalController.create({
      component: AppointmentCalendarEditPage,
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
      this.BAs = USERS.filter(U => U.U_ROLE == 'BA').sort((a, b) => {
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
    let INPUTS = [];
    this.BAs.forEach(BA => {
      let INP = {
        name: 'radio1',
        type: 'radio',
        label: BA.U_NAME,
        value: BA,
      }
      INPUTS.push(INP);
    })
    const alert = await this.alertCtrl.create({
      header: 'BA bán hàng',
      inputs: INPUTS,
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
          handler: (data: iUser) => {
            console.log(data);
            this.BOOKING.B_BA_SELL = data;
            this.BOOKING.B_BA_SELL_ID = data.U_ID;
            this.BOOKING.B_BA_SELL_NAME = data.U_NAME;
          }
        }
      ]
    });

    await alert.present();
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
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Chấp nhận',
          handler: (data: any) => {
            console.log(data);
            this.BOOKING.B_STATUS = data.EN;
            this.BOOKING.B_STATUS_VI = data.VI;
          }
        }
      ]
    });

    await alert.present();
  }

  isDisabled() {
    let isDisabled = false;
    if (this.USER.U_ROLE !== 'Manager' && this.BOOKING.B_STATUS == 'DRAFT') isDisabled = true;
    if (this.USER.U_ROLE !== 'Manager' && this.USER.U_ROLE !== 'Specialist' && this.BOOKING.B_STATUS == 'COMPLETED') isDisabled = true;
    return isDisabled;
  }

  isChangeSlotDisabled() {
    let isDisabled = false;
    if (this.BOOKING.B_STATUS == 'COMPLETED' || this.BOOKING.B_STATUS == 'EXPIRED') isDisabled = true;
    return isDisabled;
  }


}
