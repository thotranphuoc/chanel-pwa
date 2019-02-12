import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-account-register',
  templateUrl: './account-register.page.html',
  styleUrls: ['./account-register.page.scss'],
})
export class AccountRegisterPage implements OnInit {
  USER: iUser;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService

  ) {
    this.USER = this.localService.USER_DEFAULT;
  }

  ngOnInit() {
  }

  register(email: string, pw: string, fullname: string) {
    console.log(email, pw);
    this.authService.accountRegister(email, pw)
      .then((res: any) => {
        console.log(res);
        this.USER.U_ID = res.user.uid;
        this.USER.U_EMAIL = email;
        this.USER.U_NAME = fullname;

        return this.crudService.userCreate(this.USER)
        //this.navCtrl.goBack();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }

}
