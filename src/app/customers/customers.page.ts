import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { iCustomer } from '../interfaces/customer.interface';
import { NavController } from '@ionic/angular';
import { SetgetService } from '../services/setget.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  CUSTOMERS: iCustomer[] =[];
  CUSTOMERS_: iCustomer[] =[];
  constructor(  
    private navCtrl: NavController,
    private crudService: CrudService,
    private setGetService: SetgetService
  ) { }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers(){
    this.crudService.customersGet().subscribe(qSnap=>{
      console.log(qSnap);
      this.CUSTOMERS = [];
      qSnap.forEach(doc=>{
        let CUS = <iCustomer>doc.data();
        this.CUSTOMERS.push(CUS);
      })
      console.log(this.CUSTOMERS);
      this.CUSTOMERS_=this.CUSTOMERS.slice(0);
    })
  }

  go2CustomerEdit(CUSTOMER: iCustomer){
    this.setGetService.setPar(CUSTOMER);
    this.navCtrl.navigateForward('/customer-edit');
  }

  search(e: string){
    console.log(e);
    let str = e.toLowerCase();
    console.log(str);
    if(str.length>0){
      this.CUSTOMERS = this.CUSTOMERS_.filter(CUS => CUS.C_PHONE.toLowerCase().indexOf(str)>-1 || CUS.C_NAME.toLowerCase().indexOf(str)>-1)
    }else{
      console.log('str = 0');
      this.CUSTOMERS = this.CUSTOMERS_; 
    }
  }

}
