import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { LocalService } from '../services/local.service';
import { iFacial } from '../interfaces/ifacial.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iUser } from '../interfaces/user.interface';
import { CrudService } from '../services/crud.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.page.html',
  styleUrls: ['./appointment-add.page.scss'],
})
export class AppointmentAddPage implements OnInit {
  BOOKING: iBooking;
  FACIAL: iFacial;
  CUSTOMER: iCustomer;
  USER: iUser;
  ALERTADD: string = '';
  constructor(
    private modalCtrl: ModalController,
    private localService: LocalService,
    private crudService: CrudService,
  ) {
    this.BOOKING = this.localService.BOOKING_DEFAULT;
    this.FACIAL = this.localService.IFACIAL_DEFAULT;
    this.CUSTOMER = this.localService.CUSTOMER_DEFAULT;
    this.USER = this.localService.USER_DEFAULT;

    this.BOOKING.B_FACIAL = this.FACIAL;
    this.BOOKING.B_CUSTOMER = this.CUSTOMER;
    this.BOOKING.B_STAFF = this.USER;
  }

  ngOnInit() {
  }
  AddNewAppointment() {
    console.log(this.BOOKING);

    this.BOOKING.B_TIME = new Date().toISOString();
    this.crudService.createBooking(this.BOOKING)
      .then((res: any) => {
        console.log(res);
        this.ALERTADD = 'Add new Booking success';
      })
      .catch((err) => {
        console.log(err);
        this.ALERTADD = 'Add new Booking fail';
      })

  }

  doCancel() {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      res.dismiss({ BOOKING: this.BOOKING, isCancel: false });
    }).catch(err => { console.log(err) });
  }




}
