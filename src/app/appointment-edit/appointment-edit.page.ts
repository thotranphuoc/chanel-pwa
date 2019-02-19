import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { NavParams, ModalController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { AppService } from '../services/app.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { AppointmentCalendarEditPage } from '../appointment-calendar-edit/appointment-calendar-edit.page';
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
  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
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

  ngOnInit() {
    console.log('ngOnInit');
    this.crudService.bookingGet(this.Slot.BOOK_ID)
      .subscribe(docSnap => {
        console.log(docSnap);
        let BOOKING = <iBooking>docSnap.data();
        console.log(BOOKING);
        this.BOOKING = BOOKING;
      })
  }

  updateBooking() {
    if (this.BOOKING.B_STATUS == 'COMPLETED' && this.BOOKING.B_TOTAL < 1) {
      this.appService.alertConfirmationShow('Opps', 'Nhập số tiền trước khi close Booking');
      return;
    }

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

}
