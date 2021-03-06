import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { Subscription } from 'rxjs';
import { CrudService } from '../services/crud.service';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { LocalService } from '../services/local.service';
import { iBooking } from '../interfaces/booking.interface';
import { iUser } from '../interfaces/user.interface';
import { LoadingService } from '../loading.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-appointment-calendar-edit-new',
  templateUrl: './appointment-calendar-edit-new.page.html',
  styleUrls: ['./appointment-calendar-edit-new.page.scss'],
})
export class AppointmentCalendarEditNewPage implements OnInit {
  DaysInM1 = [];
  DaysInM2 = [];
  selectedDay: iDay = null;
  selectedSlot: iSlot = null;
  selectedIndex: number = null;
  month1Subscription: Subscription;
  month2Subscription: Subscription;
  BOOKING: iBooking;
  data: any;
  OLD_Day: iDay;
  OLD_SLOT: iSlot;
  OLD_index: number;
  USER: iUser;
  TODAY: string;
  currentYYYYMM: string;
  nextYYYYMM: string;
  STATES = [{ VI: 'TRỐNG', EN: 'Available' }, { VI: 'ĐÃ ĐẶT', EN: 'Booked' }, { VI: 'HOÀN THÀNH', EN: 'Completed' }, { VI: 'HUỶ BỎ', EN: 'Canceled' }, { VI: 'HẾT HẠN', EN: 'Expired' }, { VI: 'CHỜ DUYỆT', EN: 'Draft' }, { VI: 'KHOÁ', EN: 'Blocked' }];
  StateOfDay = ['Chưa có Booking', 'Đã có booking', 'Đầy booking'];
  constructor(
    public modalController: ModalController,
    private alertController: AlertController,
    private calendarService: CalendarService,
    private crudService: CrudService,
    private localService: LocalService,
    private navPar: NavParams,
    private loadingService: LoadingService,
    private dbService: DbService
  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    this.OLD_SLOT = this.data.Slot;
    this.OLD_Day = this.data.selectedDay;
    this.OLD_index = this.data.index;
    this.BOOKING = this.data.BOOKING;
    this.USER = this.localService.USER;
    console.log('thay doi slot');
    console.log(this.USER);
    
  }

  ngOnInit() {
    this.initCalendar();
  }

  ngOnDestroy() {
    this.month1Subscription.unsubscribe();
    this.month2Subscription.unsubscribe();
  }


  initCalendar() {
    this.TODAY = this.calendarService.getTodayString();
    this.currentYYYYMM = this.TODAY.substr(0, 6);
    this.nextYYYYMM = this.calendarService.getNextMonth(this.currentYYYYMM);
    let _35Days1: iDay[] = this.calendarService.create35DaysOfMonth(this.currentYYYYMM);
    let _35Days2: iDay[] = this.calendarService.create35DaysOfMonth(this.nextYYYYMM);
    console.log(_35Days1, _35Days2);
    this.month1Subscription = this.crudService.calendarMonthGet(this.currentYYYYMM)
      .subscribe(data => {
        console.log(data)
        let newdays = _35Days1.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM1 = this.calendarService.addAdditionalProsIntoDaysInMonth(newdays);
      });

    this.month2Subscription = this.crudService.calendarMonthGet(this.nextYYYYMM)
      .subscribe(data => {
        console.log(data)
        let newdays = _35Days2.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM2 = this.calendarService.addAdditionalProsIntoDaysInMonth(newdays);
      });

  }

  // START FROM HERE
  selectSlotInList(Day: iDay, SLOT: iSlot, index: number) {
    if (!(SLOT.STATUS == 'AVAILABLE' || SLOT.STATUS == 'CANCELED')) return;
    if (Day.isThePast) return;
    let _date = Day.DateId.substr(6, 2) + '/' + Day.DateId.substr(4, 2) + '/' + Day.DateId.substr(0, 4);
    let _slot = SLOT.SLOT;
    let MSG = 'Bạn chắc muốn đổi sang slot ' + _date + ' ' + _slot + ' ?';
    this.presentAlertConfirm('Xác nhận!', MSG, Day, SLOT, index);
    console.log(Day, SLOT, index)
  }

  async presentAlertConfirm(HEADER, MSG, Day, SLOT, index) {
    const alert = await this.alertController.create({
      header: HEADER,
      message: MSG,
      buttons: [
        {
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Chấp nhận',
          handler: () => {
            console.log('Confirm Okay');
            this.doChangeSlot(Day, SLOT, index);
          }
        }
      ]
    });
    await alert.present();
  }

  doChangeSlot(NEW_DAY: iDay, NEW_SLOT: iSlot, NEW_index: number) {
    this.loadingService.presentLoading();
    let PROS = [];
    NEW_SLOT.STATUS = this.OLD_SLOT.STATUS;
    NEW_SLOT.BOOK_ID = this.OLD_SLOT.BOOK_ID;
    NEW_DAY.Slots[NEW_index] = NEW_SLOT;

    this.selectedDay = NEW_DAY;
    this.selectedSlot = NEW_SLOT;
    this.selectedIndex = NEW_index;

    let oldDay = Object.assign({}, this.OLD_Day);
    oldDay.Slots[this.OLD_index].BOOK_ID = '';
    oldDay.Slots[this.OLD_index].STATUS = 'AVAILABLE';

    let Year = NEW_DAY.DateId.substr(0, 4)
    let Month = NEW_DAY.DateId.substr(4, 2)
    let date = NEW_DAY.DateId.substr(6, NEW_DAY.DateId.length - 6);
    let finalDate = date.length > 1 ? date : '0' + date;
    this.BOOKING.B_DAY = this.selectedDay;
    this.BOOKING.B_DATE = Year + '-' + Month + '-' + finalDate;
    this.BOOKING.B_SLOT = NEW_SLOT.SLOT;
    console.log(this.BOOKING, this.selectedDay, oldDay)


    if (NEW_DAY.DateId == oldDay.DateId) {
      console.log('Same day');
      NEW_DAY.Slots[this.OLD_index].STATUS = 'AVAILABLE';
      NEW_DAY.Slots[this.OLD_index].BOOK_ID = '';
      let p1 = this.crudService.dayUpdate(NEW_DAY);
      let p3 = this.crudService.bookingUpdate(this.BOOKING);
      PROS.push(p1);
      PROS.push(p3);
    } else {
      // let p1 = this.crudService.dayUpdate(DAY);
      let p2 = this.crudService.dayUpdate(oldDay);
      let p3 = this.crudService.bookingUpdate(this.BOOKING);
      // PROS.push(p1);
      PROS.push(p2);
      PROS.push(p3);
    }
    Promise.all(PROS)
      .then((res) => {
        console.log(res);
        this.doCancel();
        
        this.dbService.logAdd(this.USER.U_ID, this.USER.U_FULLNAME,this.USER.U_ROLE,'Update booking change slots from ' + this.OLD_Day.DateId + ' at ' + this.OLD_SLOT.SLOT + ' to ' + this.BOOKING.B_DAY.DateId + ' slot ' + this.BOOKING.B_SLOT)
        .then((res) => {
          console.log('Update log');
          console.log(res);
          //return this.updateScoreAndLevel()
        })
        .catch(err => {
          console.log(err);
        })


        console.log();
        this.loadingService.loadingDissmiss();
      }).catch(err => {
        console.log(err);
        this.doCancel();
        this.loadingService.loadingDissmiss();
      })
  }

  doChangeSlotx(NEW_DAY: iDay, NEW_SLOT: iSlot, NEW_index: number) {
    this.loadingService.presentLoading();
    let PROS = [];
    NEW_SLOT.STATUS = this.OLD_SLOT.STATUS;
    NEW_SLOT.BOOK_ID = this.OLD_SLOT.BOOK_ID;
    NEW_DAY.Slots[NEW_index] = NEW_SLOT;

    this.selectedDay = NEW_DAY;
    this.selectedSlot = NEW_SLOT;
    this.selectedIndex = NEW_index;

    let oldDay = Object.assign({}, this.OLD_Day);
    oldDay.Slots[this.OLD_index].BOOK_ID = '';
    oldDay.Slots[this.OLD_index].STATUS = 'AVAILABLE';

    let Year = NEW_DAY.DateId.substr(0, 4)
    let Month = NEW_DAY.DateId.substr(4, 2)
    let date = NEW_DAY.DateId.substr(6, NEW_DAY.DateId.length - 6);
    let finalDate = date.length > 1 ? date : '0' + date;
    this.BOOKING.B_DAY = this.selectedDay;
    this.BOOKING.B_DATE = Year + '-' + Month + '-' + finalDate;
    this.BOOKING.B_SLOT = NEW_SLOT.SLOT;
    console.log(this.BOOKING, this.selectedDay, oldDay)
    if (NEW_DAY.DateId == oldDay.DateId) {
      console.log('Same day');
      NEW_DAY.Slots[this.OLD_index].STATUS = 'AVAILABLE';
      NEW_DAY.Slots[this.OLD_index].BOOK_ID = '';
      // let p1 = this.crudService.dayUpdate(DAY);
      let p3 = this.crudService.bookingUpdate(this.BOOKING);
      // PROS.push(p1);
      PROS.push(p3);
    } else {
      // let p1 = this.crudService.dayUpdate(DAY);
      let p2 = this.crudService.dayUpdate(oldDay);
      let p3 = this.crudService.bookingUpdate(this.BOOKING);
      // PROS.push(p1);
      PROS.push(p2);
      PROS.push(p3);
    }
    Promise.all(PROS)
      .then((res) => {
        console.log(res);
        this.doCancel();
        console.log();
        this.loadingService.loadingDissmiss();
      }).catch(err => {
        console.log(err);
        this.doCancel();
        this.loadingService.loadingDissmiss();
      })
  }

  doCancel() {
    // this.modalController.dismiss();
    this.modalController.getTop()
      .then(res => {
        console.log(res);
        if (typeof (res) !== 'undefined') res.dismiss({ BOOKING: this.BOOKING, Day: this.selectedDay, Slot: this.selectedSlot, index: this.selectedIndex });
      })
      .catch(err => { console.log(err) });
  }
}
