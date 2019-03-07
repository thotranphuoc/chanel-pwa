import { Component, OnInit } from '@angular/core';
import { SetgetService } from '../services/setget.service';
import { CrudService } from '../services/crud.service';
import { iBooking } from '../interfaces/booking.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
})
export class BookingHistoryPage implements OnInit {
  CUSTOMER: iCustomer;
  BOOKINGS: iBooking[] =[];
  constructor(
    private crudService: CrudService,
    private setGetService: SetgetService,
    private navCtrl: NavController
  ) { 
    this.CUSTOMER = this.setGetService.getPar();
  }

  ngOnInit() {
    this.getBookingCustomers();
  }

  getBookingCustomers(){
    this.crudService.customersBookingGet(this.CUSTOMER.C_ID).subscribe(qSnap=>{
      console.log(qSnap);
      this.BOOKINGS = [];
      qSnap.forEach(doc=>{
        let CUS = <iBooking>doc.data();
        this.BOOKINGS.push(CUS);
      })
      console.log(this.BOOKINGS);
    })
  }

  doShowHistoryDetail(BOOKING:iBooking){
    this.setGetService.setPar(BOOKING);
    this.navCtrl.navigateForward('/booking-history-detail');
  }
}
