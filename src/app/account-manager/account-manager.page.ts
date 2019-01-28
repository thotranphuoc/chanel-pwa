import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {iUser} from '../interfaces/user.interface';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.page.html',
  styleUrls: ['./account-manager.page.scss'],
})
export class AccountManagerPage implements OnInit {
USERS: any=[];
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(
  ) {
    this.getUser();
  }


  getUser(){
    this.authService.getUser()
    .then((qSnap) => {
      let results = [];
      if (qSnap.size > 0) {
          qSnap.forEach(doc => {
              if (doc.exists) {
                  let result = <iUser>doc.data();
                  results.push(result);
              }
          });
          console.log(results);
              //resolve({ CUSTOMERS: results });
          } else {
              //resolve({ CUSTOMERS: results });
          }

          this.USERS=results;
      })  
      .catch((err) => {
        console.log(err);
      })
    }

    showInformation(user: iUser){
      console.log('show info');
    }

    deleteUser(user: iUser){
      console.log('delete User');
    }

    updateUser(user: iUser){
      console.log('update User');
    }
}
