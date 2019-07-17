import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
import { AppService } from '../services/app.service';
import { NavController } from '@ionic/angular';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-user-new-add',
  templateUrl: './user-new-add.page.html',
  styleUrls: ['./user-new-add.page.scss'],
})
export class UserNewAddPage implements OnInit {
  USER: iUser;
  USER_: iUser;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.USER = this.localService.USER_DEFAULT;
    this.USER_=this.localService.USER;
  }

  createAccount4User(fullname: string, nickname: string, email: string, passwd: string, role: string, location: string) {
    console.log(email, passwd, role);
    this.authService.accountCreate(email, passwd)
      .then((res) => {
        this.USER.U_ID = res.user.uid;
        this.USER.U_EMAIL = email;
        this.USER.U_ROLE = role;
        this.USER.U_NAME = nickname;
        this.USER.U_FULLNAME = fullname;
        this.USER.U_LOCATION = location;
        return this.crudService.userCreate(this.USER)
      })
      .then((res) => {
        console.log(res);

        this.dbService.logAdd(this.USER_.U_ID, this.USER_.U_FULLNAME,this.USER_.U_ROLE,'Add new User ' + this.USER.U_FULLNAME + ' - Role ' + this.USER.U_ROLE)
          .then((res) => {
            console.log('Update log');
            console.log(res);
            //return this.updateScoreAndLevel()
          })
          .catch(err => {
            console.log(err);
          })
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
