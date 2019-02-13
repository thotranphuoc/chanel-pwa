import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { NavController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  USER: iUser;
  constructor(
    private navCtrl: NavController,
    private crudService: CrudService,
    private setGetService: SetgetService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.USER = this.setGetService.getPar();
    console.log(this.USER);
  }

  updateUser() {
    console.log(this.USER);
    this.crudService.userUpdate(this.USER)
      .then((res) => {
        console.log(res);
        this.appService.alertShow('Success', null, 'User updated successfully');
        this.navCtrl.goBack();
      })
      .catch(err => {
        console.log(err);
        this.appService.alertShow('Fail', null, 'User update failed');
      })
  }

  doCancel() {
    this.navCtrl.goBack();
  }

}
