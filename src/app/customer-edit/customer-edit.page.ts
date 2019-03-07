import { Component, OnInit } from '@angular/core';
import { iCustomer } from '../interfaces/customer.interface';
import { from } from 'rxjs';
import { LocalService } from '../services/local.service';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { AppService } from '../services/app.service';
import { NavController } from '@ionic/angular';
import { iUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.page.html',
  styleUrls: ['./customer-edit.page.scss'],
})
export class CustomerEditPage implements OnInit {
  CUSTOMER: iCustomer;
  ALERTUPDATE: string = '';
  USER:iUser;
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
    this.USER=this.localService.USER;
    console.log(this.USER);
    
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
        this.ALERTUPDATE = 'Cập nhật thành công';
      })
      .catch((err) => {
        console.log(err);
        this.ALERTUPDATE = 'Cập nhật thất bại';
      })

  }

  updateCustomer() {
    console.log(this.CUSTOMER);
    this.crudService.customerUpdate(this.CUSTOMER)
      .then((res) => {
        console.log(res);
        this.appService.alertShow('Thành công', null, 'Cập nhật khách hàng thành công');
        this.navCtrl.goBack();
      })
      .catch(err => {
        console.log(err);
        this.appService.alertShow('Thất bại', null, 'Cập nhật khách hàng thất bại');
      })
  }

  doCancel() {
    console.log('doCancel, goback')
    this.navCtrl.goBack();
  }

  doShowHistory(CUSTOMER:iCustomer){
    this.setGetService.setPar(CUSTOMER);
    this.navCtrl.navigateForward('/booking-history');
  }
}
