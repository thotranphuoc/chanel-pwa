import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { LocalService } from '../services/local.service';
import {iCustomer} from '../interfaces/customer.interface';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
})
export class CustomerListPage implements OnInit {
  CUSTOMERS: any=[];
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService,
    
  ) { 
    
  }

  ngOnInit() {
    this.getCustomer();
    console.log(this.CUSTOMERS);
    
  }

  addNew(){
      this.navCtrl.navigateRoot('CustomerAddPage');
  }
  getCustomer(){
    this.authService.getCustomer()
    .then((qSnap) => {
      let results = [];
      if (qSnap.size > 0) {
          qSnap.forEach(doc => {
              if (doc.exists) {
                  let result = <iCustomer>doc.data();
                  results.push(result);
              }
          });
          console.log(results);
              //resolve({ CUSTOMERS: results });
          } else {
              //resolve({ CUSTOMERS: results });
          }

          this.CUSTOMERS=results;
      })  
      .catch((err) => {
        console.log(err);
      })
    }


  go2CustomerEdit(customer: iCustomer){
    console.log('edit');
    this.localService.CUSTOMER = customer;
    this.navCtrl.navigateForward('/customer-edit');
}
}
