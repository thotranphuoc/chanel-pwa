import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { SetgetService } from '../services/setget.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-booking-history-detail',
  templateUrl: './booking-history-detail.page.html',
  styleUrls: ['./booking-history-detail.page.scss'],
})
export class BookingHistoryDetailPage implements OnInit {
  BOOKING: iBooking;
  constructor(
    private setGetService: SetgetService,
    private navCtrl: NavController
  ) { 
    this.BOOKING = this.setGetService.getPar();
  }

  ngOnInit() {
  }

  doEditBooking(BOOKING:iBooking){
    this.setGetService.setPar(BOOKING);
    this.navCtrl.navigateForward('/appointment-edit');
  }
}
