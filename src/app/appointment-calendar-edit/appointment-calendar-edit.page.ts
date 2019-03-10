import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { ModalController, AlertController, NavController, NavParams } from '@ionic/angular';
import { CustomerAddPage } from '../customer-add/customer-add.page';
import { AppointmentAddPage } from '../appointment-add/appointment-add.page';
import { CrudService } from '../services/crud.service';
import { Subscription, Observable } from 'rxjs';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';
import { LocalService } from '../services/local.service';
import { AppService } from '../services/app.service';
import { SlotsInDayPage } from '../slots-in-day/slots-in-day.page';
import { iBooking } from '../interfaces/booking.interface';
import { iUser } from '../interfaces/user.interface';
import { LoadingService } from '../loading.service';



@Component({
  selector: 'app-appointment-calendar-edit',
  templateUrl: './appointment-calendar-edit.page.html',
  styleUrls: ['./appointment-calendar-edit.page.scss'],
})
export class AppointmentCalendarEditPage implements OnInit, OnDestroy {
  WEEKSinMONTH1: any;
  WEEKSinMONTH2: any;
  MONTHS = [];
  DaysInM1 = [];
  DaysInM2 = [];
  segment = 'overall';
  selectedDay: iDay = null;
  selectedSlot: iSlot = null;
  selectedIndex: number = null;
  month1Subscription: Subscription;
  month2Subscription: Subscription;

  // STATES = ['AVAILABLE','BOOKED','CANCELED','COMPLETED','EXPIRED']
  STATES = [{ VI: 'TRỐNG', EN: 'Available' }, { VI: 'ĐÃ ĐẶT', EN: 'Booked' }, { VI: 'HOÀN THÀNH', EN: 'Completed' }, { VI: 'HUỶ BỎ', EN: 'Canceled' }, { VI: 'HẾT HẠN', EN: 'Expired' }, { VI: 'CHỜ DUYỆT', EN: 'Draft' }];

  BOOKING: iBooking;
  data: any;
  Day: iDay;
  Slot: iSlot;
  index: number;
  USER: iUser;
  TODAY: string;
  currentYYYYMM: string;
  nextYYYYMM: string;
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    public modalController: ModalController,
    private alertController: AlertController,
    private calendarService: CalendarService,
    private crudService: CrudService,
    private localService: LocalService,
    private appService: AppService,
    private navPar: NavParams,
    private loadingService: LoadingService

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
    this.loadingService.presentLoading();
    this.TODAY = this.calendarService.getTodayString();
    this.currentYYYYMM = this.TODAY.substr(0, 6);
    this.nextYYYYMM = this.calendarService.getNextMonth(this.currentYYYYMM);
    let Days1: any[] = this.calendarService.create35DaysOfMonth(this.currentYYYYMM);
    let Days2: any[] = this.calendarService.create35DaysOfMonth(this.nextYYYYMM);
    console.log(Days1, Days2);
    this.month1Subscription = this.crudService.calendarMonthGet(this.currentYYYYMM)
      .subscribe(data => {
        // let WEEKS = [];
        // this.MONTHS = [];
        console.log(data)
        let newdays = Days1.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM1 = this.getDaysInMonth(newdays);
        // let W1 = newdays.slice(0, 7);
        // let W2 = newdays.slice(7, 14);
        // let W3 = newdays.slice(14, 21);
        // let W4 = newdays.slice(21, 28);
        // let W5 = newdays.slice(28, 35);
        // WEEKS.push(W1, W2, W3, W4, W5);
        // this.WEEKSinMONTH1 = {
        //   WEEKS: WEEKS,
        //   MONTH: 'Jan',
        //   YEAR: '2019'
        // }
      });
    this.month2Subscription = this.crudService.calendarMonthGet(this.nextYYYYMM)
      .subscribe(data => {
        // let WEEKS = [];
        // this.MONTHS = [];
        console.log(data)
        let newdays = Days2.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM2 = this.getDaysInMonth(newdays);
        // let W1 = newdays.slice(0, 7);
        // let W2 = newdays.slice(7, 14);
        // let W3 = newdays.slice(14, 21);
        // let W4 = newdays.slice(21, 28);
        // let W5 = newdays.slice(28, 35);
        // WEEKS.push(W1, W2, W3, W4, W5);
        // this.WEEKSinMONTH2 = {
        //   WEEKS: WEEKS,
        //   MONTH: 'Feb',
        //   YEAR: '2019'
        // }
        this.loadingService.loadingDissmiss();
      });

  }

  getDaysInMonth(days: any[]) {
    // let temp = days.filter(item=> {
    //   return (item !==('undefined'|| null || ''));
    // });
    // temp.map(item=>{
    //   if(this.DaysInM1k)
    // })

    let newDays = [];
    days.forEach(day => {
      if (day !== ('undefined' || null || '')) {
        let Month = day.DateId.substr(4, 2)
        let date = day.DateId.substr(6, day.DateId.length - 6);
        let finalDate = date.length > 1 ? date : '0' + date;
        day['date'] = Month + '/' + finalDate;
        let isThePast = Number(this.TODAY) > Number(day.DateId);
        day['isThePast'] = isThePast;
        newDays.push(day);
      }
    })
    return newDays;
  }

  // segmentChanged(ev: CustomEvent) {
  //   console.log(ev);
  //   this.segment = ev.detail.value;
  //   console.log(this.segment);
  // }

  // selectDay(Day: iDay) {
  //   console.log(Day);
  //   // // this.presentModal();
  //   // this.presentAlertRadio(Day);
  //   this.selectedDay = Day;
  //   this.openSlotsInDayModal(Day);
  // }
  // selectSlot(selectedDay: iDay, slot: iSlot, index: number) {
  //   console.log(selectedDay, slot, index);
  //   this.selectedSlot = slot;
  //   // this.selectedSlot.STATUS = 'BOOKED';
  //   // this.selectedSlot.BOOK_ID = '1111';
  //   // this.crudService.dayUpdate(this.selectedDay)
  //   //   .then(res => console.log(res))
  //   //   .catch(err => console.log(err));
  //   this.openAppointmentModal(selectedDay, slot, index);
  // }

  // getColorOfDay(Day: any) {
  //   console.log(Day);
  //   if (Day.Data.number >= 2) return "color='danger'";
  //   return "color='success'";
  // }

  // async modalCustomerAdd() {
  //   const modal = await this.modalController.create({
  //     component: CustomerAddPage,
  //     componentProps: { value: '123' }
  //   });

  //   return await modal.present();
  // }

  // addNewAppointment() {
  //   console.log('fab button')
  //   this.modalAppointmentAdd(null, null, null);
  // }

  async modalAppointmentAdd(selectedDay: iDay, slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentAddPage,
      componentProps: { selectedDay: selectedDay, Slot: slot, index: index }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  // async modalAppointmentEdit(selectedDay: iDay, slot: iSlot, index: number) {
  //   const modal = await this.modalController.create({
  //     component: AppointmentEditPage,
  //     componentProps: { selectedDay: selectedDay, Slot: slot, index: index }
  //   });
  //   await modal.present();
  //   const data = await modal.onDidDismiss();
  //   console.log(data);
  // }


  // async presentAlertRadio(Day: any) {
  //   let INPUTS = [];
  //   Day.Data.forEach(slot => {
  //     let state = slot.BOOKED ? 'RESERVED' : 'AVAILABLE';
  //     let inp = {
  //       name: slot.SLOT,
  //       type: 'radio',
  //       label: slot.SLOT + ' -->' + state,
  //       value: slot,
  //       checked: false
  //     };
  //     INPUTS.push(inp);
  //   });
  //   const alert = await this.alertCtrl.create({
  //     header: 'Select slot',
  //     inputs: INPUTS,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: 'Ok',
  //         handler: (data) => {
  //           console.log('Confirm Ok', data);
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  selectSlotInList(Day: iDay, SLOT: iSlot, index: number) {
    // this.openAppointmentModal(Day, SLOT, index);
    let _date = Day.DateId.substr(6, 2) + '/' + Day.DateId.substr(4, 2) + '/' + Day.DateId.substr(0, 4);
    let _slot = SLOT.SLOT;
    let MSG = 'Bạn chắc muốn đổi sang slot ' + _date + ' ' + _slot + ' ?';
    this.presentAlertConfirm('Xác nhận!', MSG, Day, SLOT, index);
    console.log(Day, SLOT, index)
  }

  // openAppointmentModal(Day: iDay, SLOT: iSlot, index: number) {
  //   console.log(Day, SLOT);
  //   if (this.localService.USER) {
  //     if (SLOT.STATUS == 'AVAILABLE') {
  //       //this.modalAppointmentAdd(Day, SLOT, index);
  //       this.alertChangeShow('Confirm!', 'Are you sure Update...', Day, SLOT,index);

  //     } else {
  //       this.alertShow('Confirm!', 'Slot Unvailable...');
  //     }
  //   } else {
  //     this.alertConfirmationShow('Confirm!', 'Please login before continuing...');
  //   }

  // }

  openSlotsInDayModal(Day: iDay) {
    console.log(Day);
    if (this.localService.USER) {
      this.slotsInDayModal(Day);
    } else {
      this.alertConfirmationShow('Confirm!', 'Vui lòng đăng nhập để tiếp tục...');
    }
  }

  async slotsInDayModal(Day: iDay) {
    const modal = await this.modalController.create({
      component: SlotsInDayPage,
      componentProps: { selectedDay: Day }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
    if (typeof (data.data) !== 'undefined' && typeof (data.role) == 'undefined') {
      let res = data.data;
      // this.openAppointmentModal(res.selectedDay, res.selectedSlot, res.selectedIndex);
    }
  }


  async alertConfirmationShow(HEADER: string, MSG: string) {
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
            this.navCtrl.navigateForward('/account');
          }
        }
      ]
    });

    await alert.present();
  }


  // async alertShow(HEADER: string, MSG: string) {
  //   const alert = await this.alertController.create({
  //     header: HEADER,
  //     message: MSG,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'OK',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //           console.log('');
  //           alert.dismiss();
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

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

  async alertChangeShow(HEADER: string, MSG: string, DAY: iDay, SLOT: iSlot, index: number) {
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
            this.doCancel();
          }
        }, {
          text: 'Chấp nhận',
          handler: () => {
            console.log('OK');
            this.doChangeSlot(DAY, SLOT, index);
            // // console.log('Confirm Okay');
            // // console.log(DAY + ' - ' + SLOT.SLOT + ' - ' + this.BOOKING.B_ID);
            // // console.log(this.Day);
            // // let Year = DAY.DateId.substr(0, 4)
            // // let Month = DAY.DateId.substr(4, 2)
            // // let date = DAY.DateId.substr(6, DAY.DateId.length - 6);
            // // let finalDate = date.length > 1 ? date : '0' + date;


            // // this.BOOKING.B_DATE= Year + '-' + Month + '-' + finalDate;
            // // this.BOOKING.B_SLOT=SLOT.SLOT;

            // // //this.modalAppointmentEdit(this.Day, this.Slot, 1);
            // // this.crudService.bookingUpdate(this.BOOKING)
            // // .then(res => {
            // //   console.log(res);
            // //   // update CALENDARS/DATE/{}
            // //   //return this.doUpdateCalendarsForDay(this.BOOKING);
            // //   console.log(DAY);
            // //   console.log(index);

            // //   //update calendar new to booking
            // //   DAY.Slots[index].STATUS="BOOKED";
            // //   DAY.Slots[this.index].BOOK_ID=this.BOOKING.B_ID;
            // //   this.crudService.dayUpdate(DAY);
            // //   //Update calendar old to available.
            // //   this.Day.Slots[this.index].STATUS="AVAILABLE";
            // //   this.Day.Slots[this.index].BOOK_ID="";
            // //   this.crudService.dayUpdate(this.Day)
            // // })
            // // .catch(err => {
            // //   console.log(err);
            // // })


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

    // .then((res) => {
    //   console.log(res);
    // }).catch(err => console.log(err));

    let oldDay = this.Day;
    oldDay.Slots[this.index].BOOK_ID = '';
    oldDay.Slots[this.index].STATUS = 'AVAILABLE';

    let Year = DAY.DateId.substr(0, 4)
    let Month = DAY.DateId.substr(4, 2)
    let date = DAY.DateId.substr(6, DAY.DateId.length - 6);
    let finalDate = date.length > 1 ? date : '0' + date;
    this.BOOKING.B_DATE = Year + '-' + Month + '-' + finalDate;
    this.BOOKING.B_SLOT = SLOT.SLOT;
    if (DAY.DateId == oldDay.DateId) {
      console.log('Same day');
      DAY.Slots[this.index].STATUS = 'AVAILABLE';
      DAY.Slots[this.index].BOOK_ID = '';
      let p1 = this.crudService.dayUpdate(DAY);
      let p3 = this.crudService.bookingUpdate(this.BOOKING);
      PROS.push(p1);
      PROS.push(p3);
    } else {
      let p1 = this.crudService.dayUpdate(DAY);
      let p2 = this.crudService.dayUpdate(oldDay);
      let p3 = this.crudService.bookingUpdate(this.BOOKING);
      PROS.push(p1);
      PROS.push(p2);
      PROS.push(p3);
    }
    // .then((res) => {
    //   console.log(res);
    // }).catch(err => console.log(err));


    // .then((res) => {
    //   console.log(res);
    // }).catch(err => console.log(err));
    Promise.all(PROS)
      .then((res) => {
        console.log(res);
        this.doCancel();
        console.log()
      }).catch(err => {
        console.log(err);
        this.doCancel();
      })
    // this.navCtrl.goBack();
    // this.doCancel();
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