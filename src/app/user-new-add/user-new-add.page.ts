import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { AppService } from '../services/app.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-new-add',
  templateUrl: './user-new-add.page.html',
  styleUrls: ['./user-new-add.page.scss'],
})
export class UserNewAddPage implements OnInit {
  USER: iUser;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.USER = this.localService.USER_DEFAULT;
  }

  createAccount4User(name: string, email: string, passwd: string, role: string) {
    console.log(email, passwd, role);
    this.authService.accountCreate(email, passwd)
      .then((res) => {
        this.USER.U_ID = res.user.uid;
        this.USER.U_EMAIL = email;
        this.USER.U_ROLE = role;
        this.USER.U_NAME = name;
        return this.crudService.userCreate(this.USER)
      })
      .then((res) => {
        console.log(res);
        this.navCtrl.goBack();
        this.appService.alertConfirmationShow('Thành công', 'Tạo Thành công')
      })
      .catch(err => {
        console.log(err);
        this.appService.alertConfirmationShow('Thất bại', 'Tạo thất bại')
      })
  }

  cancel() {
    this.navCtrl.goBack();
  }

}
