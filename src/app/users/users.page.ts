import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { NavController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  USERS: iUser[] = [];
  constructor(
    private navCtrl: NavController,
    private crudService: CrudService,
    private setGetService: SetgetService
  ) { }

  ngOnInit() {
    this.getUsers()
  }


  getUsers() {
    this.crudService.usersGet().subscribe(qSnap => {
      console.log(qSnap);
      this.USERS = [];
      qSnap.forEach(doc => {
        let CUS = <iUser>doc.data();
        this.USERS.push(CUS);
      })
      console.log(this.USERS);
    })
  }

  go2UserEdit(USER: iUser) {
    this.setGetService.setPar(USER);
    this.navCtrl.navigateForward('/user-edit');
  }

  go2UserNewAdd() {
    this.navCtrl.navigateForward('/user-new-add');
  }

}
