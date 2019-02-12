import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { NavParams, ModalController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';

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
  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private crudService: CrudService,
  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    this.Slot = this.data.Slot;
    this.Day = this.data.selectedDay;
  }

  ngOnInit() {
    this.crudService.bookingGet(this.Slot.BOOK_ID)
      .subscribe(docSnap => {
        console.log(docSnap);
        let BOOKING = <iBooking>docSnap.data();
        console.log(BOOKING);
        this.BOOKING = BOOKING;
      })
  }

  updateBooking() {
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


}
