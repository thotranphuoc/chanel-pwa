import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.page.html',
  styleUrls: ['./account-login.page.scss'],
})
export class AccountLoginPage implements OnInit {
  USER: iUser;
  isSigned = true;
  constructor(
    private navCtrl: NavController,
    public authService: AuthService,
    private localService: LocalService
  ) {
    this.USER = this.localService.USER_DEFAULT;
    console.log(this.authService.isSigned);
  }

  ngOnInit() {
    // this.checkIfSigned();
  }

  // checkIfSigned() {
  //   setTimeout(() => {
  //     this.isSigned = this.authService.isSigned;;
  //     console.log(this.isSigned);
  //   }, 1000);
  // }

  // Login with Firebase
  login(email: string, pw: string) {
    console.log(email, pw);
    this.authService.accountLogin(email, pw)
      .then((res: any) => {
        console.log(res);
        //this.navCtrl.goBack();
        //this.USER=res;
        //this.authService.isSigned()=true;
      })
      .catch((err) => {
        console.log(err);
      })
  }

}
