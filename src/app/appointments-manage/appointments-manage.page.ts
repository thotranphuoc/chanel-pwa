import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SetgetService } from '../services/setget.service';

@Component({
  selector: 'app-appointments-manage',
  templateUrl: './appointments-manage.page.html',
  styleUrls: ['./appointments-manage.page.scss'],
})
export class AppointmentsManagePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private setGetService: SetgetService
  ) { }

  ngOnInit() {
  }

  go2BookingsView(STATES: string[]) {
    let DATA = {
      STATES: STATES
    }
    this.setGetService.setPar(DATA);
    this.navCtrl.navigateForward('/bookings-view');
  }

}
