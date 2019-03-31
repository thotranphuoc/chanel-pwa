import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { iCustomer } from '../interfaces/customer.interface';
import { iBooking } from '../interfaces/booking.interface';
import * as firebase from 'firebase';
import 'firebase/firestore';
@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  ITEMS = [
    { date: '1', nums: [1, 2, 3, 4, 5, 4] },
    { date: '2', nums: [1, 2, 3, 4,] },
    { date: '3', nums: [1, 2, 3, 4, 5, 6, 7, 8] },
    { date: '4', nums: [1, 2, 3, 4, 5, 4, 7, 5] },
    { date: '5', nums: [1, 2, 3, 4, 5, 4, 5, 4] },
    { date: '6', nums: [1, 2, 3, 4, 5, 4, 5, 4] },
    { date: '7', nums: [1, 2, 3, 4, 5, 4, 6, 4] },
    { date: '8', nums: [1, 2, 3,] }
  ]
  constructor(private crudService: CrudService) { }

  ngOnInit() {
    // this.splitTest();
    // this.updateCustomersWithC_BOOKINGS();
    // this.updateCustomerHistoryBooking();
    // this.updateCustomerWithHistory();
  }

  updateCustomersWithC_BOOKINGS() {
    let CUSTOMERS: iCustomer[] = [];
    this.crudService.customersAllGet().then((res: any) => {
      console.log(res);
      CUSTOMERS = res.CUSTOMERS;
      let PROS = [];
      CUSTOMERS.forEach(CUSTOMER => {
        CUSTOMER.C_BOOKINGS = {};
        console.log(CUSTOMER);
        let p = this.crudService.customerUpdate(CUSTOMER);
        PROS.push(p);
      })
      return Promise.all(PROS)
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => { console.log(err) })
  }

  updateCustomerHistoryBooking() {
    let BOOKINGS: iBooking[] = [];
    this.crudService.bookingsAllGet().then((res: any) => {
      console.log(res);
      BOOKINGS = res.BOOKINGS;
      let PROS = [];
      BOOKINGS.forEach(BOOKING => {
        let ID = BOOKING.B_ID;
        let data = {
          ID: ID,
          STATE: BOOKING.B_STATUS,
          DATE: BOOKING.B_DATE
        }
        let p = firebase.firestore().doc('CUSTOMERS/' + BOOKING.B_CUSTOMER_ID).get().then((docSnap) => {
          let CUSTOMER = <iCustomer>docSnap.data();
          CUSTOMER.C_BOOKINGS[ID] = data;
          console.log(CUSTOMER);
          return docSnap.ref.update(CUSTOMER);
        })

        // let p = firebase.firestore().doc('CUSTOMERS/' + BOOKING.B_CUSTOMER_ID).update({ C_BOOKINGS: data });
        PROS.push(p);

      })
      return Promise.all(PROS)
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  updateCustomerWithHistory() {
    let CUSTOMERS: iCustomer[] = [];
    this.crudService.customersAllGet().then((res: any) => {
      console.log(res);
      CUSTOMERS = res.CUSTOMERS;
      let PROS = [];
      CUSTOMERS.forEach(CUSTOMER => {
        this.crudService.bookingsOfCustomerGet(CUSTOMER.C_ID).subscribe(qSnap => {
          qSnap.forEach(doc => {
            let BOOKING = <iBooking>doc.data();
            let ID = BOOKING.B_ID;
            let data = {
              ID: ID,
              STATE: BOOKING.B_STATUS,
              DATE: BOOKING.B_DATE
            }
            CUSTOMER.C_BOOKINGS[ID] = data;
          })
          console.log(CUSTOMER);
          let p = this.crudService.customerUpdate(CUSTOMER);
          PROS.push(p);
        })
      })
      return Promise.all(PROS)
    })
      .then((res) => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  splitTest() {
    console.log(2 / 3);
    console.log(4 / 3);
    console.log(5 % 3);
    console.log(Math.ceil(4 / 4));
    console.log(Math.ceil(3 / 4));
    console.log(Math.ceil(6 / 4));
    console.log(Math.ceil(8 / 4));
    console.log(Math.ceil(9 / 4));

    let arr = [1, 2, 3, 4, 5, 4, 6];
    let newArr = this.splitIntoSubArray(arr, 4);
    console.log(newArr);
  }

  splitIntoSubArray(arr, count) {
    var newArray = [];
    while (arr.length > 0) {
      newArray.push(arr.splice(0, count));
    }
    return newArray;
  }

}
