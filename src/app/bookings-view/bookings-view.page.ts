import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { iBooking } from '../interfaces/booking.interface';
import { SetgetService } from '../services/setget.service';
import { ModalController } from '@ionic/angular';
import { AppointmentEditPage } from '../appointment-edit/appointment-edit.page';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings-view',
  templateUrl: './bookings-view.page.html',
  styleUrls: ['./bookings-view.page.scss'],
})
export class BookingsViewPage implements OnInit, OnDestroy {
  USER: iUser;
  STATES: string[];
  BOOKINGS: iBooking[] = [];
  // sub: Subscription;
  constructor(
    private modalController: ModalController,
    private crudService: CrudService,
    private localService: LocalService,
    private setGetService: SetgetService
  ) {
    this.STATES = this.setGetService.getPar().STATES;
    this.USER = this.localService.USER;
  }

  ngOnInit() {
    this.getBookings();
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    // console.log('did unsubscribe');
  }
  getBookings() {
    this.crudService.bookingsOfUserWithStatesGet(this.USER, this.STATES)
      .then((res: any) => {
        console.log(res);
        this.BOOKINGS = res.BOOKINGS;
      })
      .catch(err => {
        console.log(err);
      })
  }

  async modalAppointmentEdit(selectedDay: iDay, Slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentEditPage,
      componentProps: { selectedDay: selectedDay, Slot: Slot, index: index }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  viewEditBooking(BOOKING: iBooking) {
    console.log(BOOKING);
    // get Day
    let YYYYMM = BOOKING.B_DATE.substr(0, 4) + BOOKING.B_DATE.substr(5, 2);
    let YYYYMMDD = YYYYMM + BOOKING.B_DATE.substr(8, 2)
    console.log(YYYYMM);
    this.crudService.calendarMonthGetPromise(YYYYMM)
      .then(res => {
        let MONTHOBJ = res.data();
        console.log(MONTHOBJ);
        let DAY: iDay = MONTHOBJ[YYYYMMDD];
        let index = DAY.Slots.map(Slot => Slot.BOOK_ID).indexOf(BOOKING.B_ID);
        let SLOT = DAY.Slots[index];
        console.log(DAY, SLOT, index);
        if(index>-1){
          this.modalAppointmentEdit(DAY, SLOT, index);
        }else{
          console.log('something went wrong')
        }
      })
      .catch((err) => {
        console.log(err);
      })
    // .subscribe(res=>{
    //   console.log(res);
    //   let DAY: iDay = res[YYYYMMDD];
    //   let index = DAY.Slots.map(Slot=> Slot.BOOK_ID).indexOf(BOOKING.B_ID);
    //   let SLOT = DAY.Slots[index];
    //   console.log(DAY, SLOT, index);
    //   this.modalAppointmentEdit(DAY, SLOT, index);
    // })
    // // sub.unsubscribe();
    // this.openAppointmentModa(Day, SLOT, index);
  }
}
