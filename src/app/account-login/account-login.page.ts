import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.page.html',
  styleUrls: ['./account-login.page.scss'],
})
export class AccountLoginPage implements OnInit {

  isSignedIn = false;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.checkIfSigned();
  }

  checkIfSigned() {
    setTimeout(() => {
      this.isSignedIn = this.authService.isSigned();
      console.log(this.isSignedIn);
    }, 1000);
  }

  // Login with Firebase
  login(email: string, pw: string) {
    console.log(email, pw);
    this.authService.accountLogin(email, pw)
      .then((res: any) => {
        console.log(res);
        //this.navCtrl.goBack();
      })
      .catch((err) => {
        console.log(err);
      })
  }

}
