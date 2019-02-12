import { Component, OnInit } from '@angular/core';
import { iCustomer } from '../interfaces/customer.interface';
import { from } from 'rxjs';
import { LocalService } from '../services/local.service';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { AppService } from '../services/app.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.page.html',
  styleUrls: ['./customer-edit.page.scss'],
})
export class CustomerEditPage implements OnInit {
  CUSTOMER: iCustomer;
  ALERTUPDATE: string = '';
  constructor(
    private navCtrl: NavController,
    private localService: LocalService,
    private crudService: CrudService,
    private setGetService: SetgetService,
    private appService: AppService
  ) { }

  ngOnInit() {
    // this.CUSTOMER=this.localService.CUSTOMER;
    this.CUSTOMER = this.setGetService.getPar();
    console.log(this.CUSTOMER);
  }


  addEdit(name: string, phone: string, cemail: string, vcode: string) {
    this.CUSTOMER.C_NAME = name;
    this.CUSTOMER.C_PHONE = phone;
    this.CUSTOMER.C_EMAIL = cemail;
    this.CUSTOMER.C_VIPCODE = vcode;

    this.crudService.customerUpdate(this.CUSTOMER)
      .then((res: any) => {
        console.log(res);
        //this.presentToast("thanh cong");
        this.ALERTUPDATE = 'Updated Success';
      })
      .catch((err) => {
        console.log(err);
        this.ALERTUPDATE = 'Updated Fail';
      })

  }

  updateCustomer() {
    console.log(this.CUSTOMER);
    this.crudService.customerUpdate(this.CUSTOMER)
      .then((res) => {
        console.log(res);
        this.appService.alertShow('Success', null, 'Customer updated successfully');
        this.navCtrl.goBack();
      })
      .catch(err => {
        console.log(err);
        this.appService.alertShow('Fail', null, 'Customer update failed');
      })
  }

  doCancel() {
    this.navCtrl.goBack();
  }

}
