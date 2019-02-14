import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { CustomerAddPage } from '../customer-add/customer-add.page';
import { AppointmentAddPage } from '../appointment-add/appointment-add.page';
import { CrudService } from '../services/crud.service';
import { Subscription, Observable } from 'rxjs';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';
import { AppointmentEditPage } from '../appointment-edit/appointment-edit.page';
import { LocalService } from '../services/local.service';
import { AppService } from '../services/app.service';
import { SlotsInDayPage } from '../slots-in-day/slots-in-day.page';
import { readPatchedData } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
})
export class CalendarsPage implements OnInit, OnDestroy {
  WEEKSinMONTH1: any;
  WEEKSinMONTH2: any;
  MONTHS = [];
  DaysInM1 = [];
  DaysInM2 = [];
  segment = 'overall';
  selectedDay: iDay = null;
  selectedSlot: iSlot = null;
  month1Subscription: Subscription;
  month2Subscription: Subscription;
  // STATES = ['AVAILABLE','BOOKED','CANCELED','COMPLETED','EXPIRED']
  STATES = ['Available', 'Booked', 'Canceled', 'Completed', 'Expired'];
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    public modalController: ModalController,
    private alertController: AlertController,
    private calendarService: CalendarService,
    private crudService: CrudService,
    private localService: LocalService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.initCalendar();
  }

  ngOnDestroy() {
    this.month1Subscription.unsubscribe();
    this.month2Subscription.unsubscribe();
  }


  initCalendar() {
    // this.WEEKSinMONTH1 = this.calendarService.getWeeksDaysOfMonth(2019, 1);
    // this.WEEKSinMONTH2 = this.calendarService.getWeeksDaysOfMonth(2019, 2);
    // this.MONTHS = [this.WEEKSinMONTH1, this.WEEKSinMONTH2];
    // console.log(this.MONTHS);
    let Days1: any[] = this.calendarService.create35DaysOfMonth(2019, 1);
    let Days2: any[] = this.calendarService.create35DaysOfMonth(2019, 2);
    console.log(Days1, Days2);
    this.month1Subscription = this.crudService.calendarMonthGet('01', '2019')
      .subscribe(data => {
        let WEEKS = [];
        this.MONTHS = [];
        console.log(data)
        let newdays = Days1.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM1 = this.getDaysInMonth(newdays);
        let W1 = newdays.slice(0, 7);
        let W2 = newdays.slice(7, 14);
        let W3 = newdays.slice(14, 21);
        let W4 = newdays.slice(21, 28);
        let W5 = newdays.slice(28, 35);
        WEEKS.push(W1, W2, W3, W4, W5);
        this.WEEKSinMONTH1 = {
          WEEKS: WEEKS,
          MONTH: 'Jan',
          YEAR: '2019'
        }
        // this.MONTHS.push(this.WEEKSinMONTH1, this.WEEKSinMONTH1);
        // console.log(this.MONTHS);
      });
    this.month2Subscription = this.crudService.calendarMonthGet('02', '2019')
      .subscribe(data => {
        let WEEKS = [];
        this.MONTHS = [];
        console.log(data)
        let newdays = Days2.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM2 = this.getDaysInMonth(newdays);
        let W1 = newdays.slice(0, 7);
        let W2 = newdays.slice(7, 14);
        let W3 = newdays.slice(14, 21);
        let W4 = newdays.slice(21, 28);
        let W5 = newdays.slice(28, 35);
        WEEKS.push(W1, W2, W3, W4, W5);
        this.WEEKSinMONTH2 = {
          WEEKS: WEEKS,
          MONTH: 'Feb',
          YEAR: '2019'
        }
        // this.MONTHS.push(this.WEEKSinMONTH1, this.WEEKSinMONTH1);
        // console.log(this.MONTHS);
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
        newDays.push(day);
      }
    })
    return newDays;
  }

  segmentChanged(ev: CustomEvent) {
    console.log(ev);
    this.segment = ev.detail.value;
    console.log(this.segment);
  }

  selectDay(Day: iDay) {
    console.log(Day);
    // // this.presentModal();
    // this.presentAlertRadio(Day);
    this.selectedDay = Day;
    this.openSlotsInDayModal(Day);
  }
  selectSlot(selectedDay: iDay, slot: iSlot, index: number) {
    console.log(selectedDay, slot, index);
    this.selectedSlot = slot;
    // this.selectedSlot.STATUS = 'BOOKED';
    // this.selectedSlot.BOOK_ID = '1111';
    // this.crudService.dayUpdate(this.selectedDay)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
    this.openAppointmentModal(selectedDay, slot, index);
  }

  getColorOfDay(Day: any) {
    console.log(Day);
    if (Day.Data.number >= 2) return "color='danger'";
    return "color='success'";
  }

  // async modalCustomerAdd() {
  //   const modal = await this.modalController.create({
  //     component: CustomerAddPage,
  //     componentProps: { value: '123' }
  //   });

  //   return await modal.present();
  // }

  addNewAppointment() {
    console.log('fab button')
    this.modalAppointmentAdd(null, null, null);
  }

  async modalAppointmentAdd(selectedDay: iDay, slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentAddPage,
      componentProps: { selectedDay: selectedDay, Slot: slot, index: index }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  async modalAppointmentEdit(selectedDay: iDay, slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentEditPage,
      componentProps: { selectedDay: selectedDay, Slot: slot, index: index }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }


  async presentAlertRadio(Day: any) {
    let INPUTS = [];
    Day.Data.forEach(slot => {
      let state = slot.BOOKED ? 'RESERVED' : 'AVAILABLE';
      let inp = {
        name: slot.SLOT,
        type: 'radio',
        label: slot.SLOT + ' -->' + state,
        value: slot,
        checked: false
      };
      INPUTS.push(inp);
    });
    const alert = await this.alertCtrl.create({
      header: 'Select slot',
      inputs: INPUTS,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
          }
        }
      ]
    });

    await alert.present();
  }

  selectSlotInList(Day: iDay, SLOT: iSlot, index: number) {
    this.openAppointmentModal(Day, SLOT, index);
  }

  openAppointmentModal(Day: iDay, SLOT: iSlot, index: number) {
    console.log(Day, SLOT);
    if (this.localService.USER) {
      if (SLOT.STATUS == 'AVAILABLE') {
        this.modalAppointmentAdd(Day, SLOT, index);
      } else {
        this.modalAppointmentEdit(Day, SLOT, index);
      }
    } else {
      this.alertConfirmationShow('Confirm!', 'Please login before continuing...');
    }

  }

  openSlotsInDayModal(Day: iDay) {
    console.log(Day);
    if (this.localService.USER) {
      this.slotsInDayModal(Day);
    } else {
      this.alertConfirmationShow('Confirm!', 'Please login before continuing...');
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
    if (typeof (data.data) !== 'undefined' && typeof(data.role) =='undefined') {
      let res = data.data;
      this.openAppointmentModal(res.selectedDay, res.selectedSlot, res.selectedIndex);
    }
  }


  async alertConfirmationShow(HEADER: string, MSG: string) {
    const alert = await this.alertController.create({
      header: HEADER,
      message: MSG,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateForward('/account');
          }
        }
      ]
    });

    await alert.present();
  }

}
