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
  Day: iDay;
  Slot: iSlot;
  index: number;
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
  ) { 
    this.data = this.navPar.data;
    console.log(this.data);
    this.Slot = this.data.Slot;
    this.Day = this.data.selectedDay;
    this.index = this.data.index;
    this.BOOKING = this.data.BOOKING;
    this.USER = this.localService.USER;
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
        console.log(newdays);
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
    if(SLOT.STATUS !=='AVAILABLE') return;
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

  doChangeSlot(DAY: iDay, SLOT: iSlot, index: number) {
    let PROS = [];
    SLOT.STATUS = this.Slot.STATUS;
    SLOT.BOOK_ID = this.Slot.BOOK_ID;
    DAY.Slots[index] = SLOT;

    this.selectedDay = DAY;
    this.selectedSlot = SLOT;
    this.selectedIndex = index;

    let oldDay = Object.assign({},this.Day);
    oldDay.Slots[this.index].BOOK_ID = '';
    oldDay.Slots[this.index].STATUS = 'AVAILABLE';

    let Year = DAY.DateId.substr(0, 4)
    let Month = DAY.DateId.substr(4, 2)
    let date = DAY.DateId.substr(6, DAY.DateId.length - 6);
    let finalDate = date.length > 1 ? date : '0' + date;
    this.BOOKING.B_DAY = this.selectedDay;
    this.BOOKING.B_DATE = Year + '-' + Month + '-' + finalDate;
    this.BOOKING.B_SLOT = SLOT.SLOT;
    console.log(this.BOOKING, this.selectedDay, oldDay)
    if (DAY.DateId == oldDay.DateId) {
      console.log('Same day');
      DAY.Slots[this.index].STATUS = 'AVAILABLE';
      DAY.Slots[this.index].BOOK_ID = '';
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
        console.log()
      }).catch(err => {
        console.log(err);
        this.doCancel();
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
