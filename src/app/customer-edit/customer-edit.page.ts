import { Component, OnInit } from '@angular/core';
import {iCustomer} from '../interfaces/customer.interface';
import { from } from 'rxjs';
import { LocalService } from '../services/local.service';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.page.html',
  styleUrls: ['./customer-edit.page.scss'],
})
export class CustomerEditPage implements OnInit {
  CUSTOMER: iCustomer;
  ALERTUPDATE: string = '';
  constructor(
      private localService: LocalService,
      private crudService: CrudService,
  ) { }

  ngOnInit() {
    this.CUSTOMER=this.localService.CUSTOMER;
  }


  addEdit(fname:string, lname:string, phone:string, cemail:string, vcode:string){
    this.CUSTOMER.C_FNAME = fname;
    this.CUSTOMER.C_LNAME = lname;
    this.CUSTOMER.C_PHONE = phone;
    this.CUSTOMER.C_EMAIL = cemail;
    this.CUSTOMER.C_VIPCODE = vcode;
    
    this.crudService.updateCustomer(this.CUSTOMER)
    .then((res: any) => {
      console.log(res);
      //this.presentToast("thanh cong");
      this.ALERTUPDATE='Updated Success';
    })
    .catch((err) => {
      console.log(err);
      this.ALERTUPDATE='Updated Fail';
    })

  }

}
