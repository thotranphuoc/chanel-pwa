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

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
})
export class CalendarsPage implements OnInit, OnDestroy {
  WEEKSinMONTH1: any[] = [];
  WEEKSinMONTH2: any[] = [];
  MONTHS = [];
  DaysInM1 = [];
  DaysInM2 = [];
  segment = 'overall';
  selectedDay: iDay = null;
  selectedSlot: iSlot = null;
  month1Subscription: Subscription;
  month2Subscription: Subscription;
  TODAY: string;
  currentYYYYMM: string;
  nextYYYYMM: string;
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
    this.TODAY = this.calendarService.getTodayString();
    this.currentYYYYMM = this.TODAY.substr(0, 6);
    this.nextYYYYMM = this.calendarService.getNextMonth(this.currentYYYYMM);
    let _35Days1: iDay[] = this.calendarService.create35DaysOfMonth(this.currentYYYYMM);
    let _35Days2: iDay[] = this.calendarService.create35DaysOfMonth(this.nextYYYYMM);
    console.log(_35Days1, _35Days2);
    this.month1Subscription = this.crudService.calendarMonthGet(this.currentYYYYMM)
      .subscribe(data => {
        this.WEEKSinMONTH1 = [];
        console.log(data)
        let newdays = _35Days1.map(day => data[day.DateId]);
        console.log(newdays);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM1 = this.calendarService.addAdditionalProsIntoDaysInMonth(newdays);
        let W1 = newdays.slice(0, 7);
        let W2 = newdays.slice(7, 14);
        let W3 = newdays.slice(14, 21);
        let W4 = newdays.slice(21, 28);
        let W5 = newdays.slice(28, 35);
        this.WEEKSinMONTH1.push(W1, W2, W3, W4, W5);
      });

    this.month2Subscription = this.crudService.calendarMonthGet(this.nextYYYYMM)
      .subscribe(data => {
        this.WEEKSinMONTH2 = [];
        console.log(data)
        let newdays = _35Days2.map(day => data[day.DateId]);
        newdays.forEach(day => {
          let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
          day['n'] = n;
        });
        console.log(newdays);
        this.DaysInM2 = this.calendarService.addAdditionalProsIntoDaysInMonth(newdays);
        let W1 = newdays.slice(0, 7);
        let W2 = newdays.slice(7, 14);
        let W3 = newdays.slice(14, 21);
        let W4 = newdays.slice(21, 28);
        let W5 = newdays.slice(28, 35);
        this.WEEKSinMONTH2.push(W1, W2, W3, W4, W5);
      });

  }

  segmentChanged(ev: CustomEvent) {
    console.log(ev);
    this.segment = ev.detail.value;
    console.log(this.segment);
  }

  selectDay(Day: iDay) {
    console.log(Day);
    this.selectedDay = Day;
    this.openSlotsInDayModal(Day);
  }
  selectSlot(selectedDay: iDay, slot: iSlot, index: number) {
    console.log(selectedDay, slot, index);
    this.selectedSlot = slot;
    this.openAppointmentModal(selectedDay, slot, index);
  }

  getColorOfDay(Day: any) {
    console.log(Day);
    if (Day.Data.number >= 2) return "color='danger'";
    return "color='success'";
  }

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
    if (typeof (data.data) !== 'undefined' && typeof (data.role) == 'undefined') {
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
