import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { iCustomer } from '../interfaces/customer.interface';
import { CrudService } from '../services/crud.service';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.page.html',
  styleUrls: ['./customer-add.page.scss'],
})
export class CustomerAddPage implements OnInit {
  CUSTOMER: iCustomer;
  ALERTADD: string = '';
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService
  ) {
    this.CUSTOMER = this.localService.CUSTOMER_DEFAULT;
    console.log(this.CUSTOMER);
  }

  ngOnInit() {
  }

  addNew(name: string, phone: string, email: string, vcode: string) {
    console.log(email, name);
    //this.CUSTOMER.C_ID=res.CUSTOMER.uid;
    this.CUSTOMER.C_EMAIL = email;
    this.CUSTOMER.C_NAME = name;
    this.CUSTOMER.C_PHONE = phone;
    this.CUSTOMER.C_AVATAR = '#';
    this.CUSTOMER.C_VIPCODE = vcode;

    this.crudService.customerCreate(this.CUSTOMER)
      .then((res: any) => {
        console.log(res);
        this.ALERTADD = 'Thêm khách hàng thành công';
      })
      .catch((err) => {
        console.log(err);
        this.ALERTADD = 'Thêm khách hàng thất bại';
      })
  }



}
