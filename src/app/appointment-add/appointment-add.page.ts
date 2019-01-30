import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { LocalService } from '../services/local.service';
import { iFacial } from '../interfaces/ifacial.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iUser } from '../interfaces/user.interface';
import { CrudService } from '../services/crud.service';
import { ModalController, NavController } from '@ionic/angular';
import { iFacialCabin } from '../interfaces/facialcabin.interface';
@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.page.html',
  styleUrls: ['./appointment-add.page.scss'],
})
export class AppointmentAddPage implements OnInit {
  BOOKING: iBooking;
  FACIALCABIN: iFacialCabin;
  CUSTOMER: iCustomer;
  USER: iUser;
  ALERTADD: string = '';
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private localService: LocalService,
    private crudService: CrudService,
  ) {

    // this.FACIALCABIN = this.localService.FACIALCABIN_DEFAULT;
    // this.CUSTOMER = this.localService.CUSTOMER_DEFAULT;
    // this.USER = this.localService.USER_DEFAULT;

    // this.BOOKING.B_FACIAL = this.FACIALCABIN;
    // this.BOOKING.B_CUSTOMER = this.CUSTOMER;
    // this.BOOKING.B_STAFF = this.USER;
  }

  ngOnInit() {
    this.BOOKING = this.localService.BOOKING_DEFAULT;
    console.log(this.BOOKING);
  }

  addNewAppointment() {
    this.BOOKING.B_CREATED_TIME = new Date().toISOString();
    console.log(this.BOOKING);

    // this.crudService.createBooking(this.BOOKING)
    //   .then((res: any) => {
    //     console.log(res);
    //     this.ALERTADD = 'Add new Booking success';
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.ALERTADD = 'Add new Booking fail';
    //   })

  }

  doCancel() {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({ BOOKING: this.BOOKING, isCancel: false });
    }).catch(err => { console.log(err) });
  }

  changeNewCustomer() {
    this.BOOKING.B_1stTIME = this.BOOKING.B_isNewCustomer;
  }




}
