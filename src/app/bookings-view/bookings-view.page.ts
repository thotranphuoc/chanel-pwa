import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { iBooking } from '../interfaces/booking.interface';
import { SetgetService } from '../services/setget.service';
import { ModalController, NavController, ActionSheetController } from '@ionic/angular';
import { AppointmentEditPage } from '../appointment-edit/appointment-edit.page';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { Subscription } from 'rxjs';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-bookings-view',
  templateUrl: './bookings-view.page.html',
  styleUrls: ['./bookings-view.page.scss'],
})
export class BookingsViewPage implements OnInit, OnDestroy {
  data: any;
  USER: iUser;
  STATES: string[];
  BOOKINGS: iBooking[] = [];
  // sub: Subscription;
  constructor(
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private crudService: CrudService,
    private localService: LocalService,
    private setGetService: SetgetService,
    private appService: AppService
  ) {
    this.data = this.setGetService.getPar();
    if (typeof (this.data) !== 'undefined') {
      this.STATES = this.data.STATES;
      this.USER = this.localService.USER;
    } else {
      this.navCtrl.navigateRoot('/home')
    }

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
        let _BOOKINGS = res.BOOKINGS;
        this.BOOKINGS = this.appService.arraySortByName(_BOOKINGS, 'B_DATE');
      })
      .catch(err => {
        console.log(err);
      })
  }

  async modalAppointmentEdit(selectedDay: iDay, Slot: iSlot, index: number, isOnCalendar: boolean, BOOKING: iBooking) {
    let modal: any = null;
    if (isOnCalendar) {
      modal = await this.modalController.create({
        component: AppointmentEditPage,
        componentProps: { selectedDay: selectedDay, Slot: Slot, index: index, isOnCalendar: isOnCalendar, BOOKING: BOOKING }
      });
    } else {
      modal = await this.modalController.create({
        component: AppointmentEditPage,
        componentProps: { selectedDay: selectedDay, Slot: Slot, index: index, isOnCalendar: isOnCalendar, BOOKING: BOOKING }
      });
    }
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  async actionSheet(BOOKING: iBooking) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: null,
      buttons: [{
        text: 'Xem Booking',
        icon: 'create',
        handler: () => {
          console.log('Xem booking');
          this.viewEditBooking(BOOKING);
        }
      }, {
        text: 'Xem lịch sữ tác động',
        icon: 'time',
        handler: () => {
          console.log('Xem lịch sữ tác động');
          this.viewEditBooking(BOOKING);
        }
      }, {
        text: 'Quay lại',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
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
        if (index > -1) {
          this.modalAppointmentEdit(DAY, SLOT, index, true, BOOKING);
        } else {
          console.log('something went wrong')
          this.modalAppointmentEdit(null, null, index, false, BOOKING);
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
