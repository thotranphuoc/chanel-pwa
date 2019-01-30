import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { ModalController } from '@ionic/angular';
import { CustomerAddPage } from '../customer-add/customer-add.page';
import { AppointmentAddPage } from '../appointment-add/appointment-add.page';

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
})
export class CalendarsPage implements OnInit {
  WEEKSinMONTH1: any;
  WEEKSinMONTH2: any;
  MONTHS = [];
  segment = 'overall';
  constructor(
    public modalController: ModalController,
    private calendarService: CalendarService) { }

  ngOnInit() {
    this.doCalendar();
  }



  doCalendar() {
    this.WEEKSinMONTH1 = this.calendarService.getWeeksDaysOfMonth(2019, 1);
    this.WEEKSinMONTH2 = this.calendarService.getWeeksDaysOfMonth(2019, 2);
    this.MONTHS = [this.WEEKSinMONTH1, this.WEEKSinMONTH2];
    console.log(this.MONTHS);
  }

  segmentChanged(ev: CustomEvent) {
    console.log(ev);
    this.segment = ev.detail.value;
    console.log(this.segment);
  }

  selectDay(Day: any) {
    console.log(Day);
    this.presentModal();
  }

  getColorOfDay(Day: any) {
    console.log(Day);
    if (Day.Data.number >= 2) return "color='danger'";
    return "color='success'";
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CustomerAddPage,
      componentProps: { value: '123' }
    });

    return await modal.present();
  }

  addNewAppointment() {
    console.log('fab button')
    this.modalAppointmentAdd();
  }

  async modalAppointmentAdd() {
    const modal = await this.modalController.create({
      component: AppointmentAddPage,
      componentProps: { value: '123' }
    });



    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

}
