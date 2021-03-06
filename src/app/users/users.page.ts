import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { NavController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { LocalService } from '../services/local.service';
import { ExcelService } from '../excel.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  USERS: iUser[] = [];
  USER: iUser;
  constructor(
    private navCtrl: NavController,
    private crudService: CrudService,
    private setGetService: SetgetService,
    private localService: LocalService,
    private excelService: ExcelService,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.authenticateUser();
  }

  authenticateUser() {
    this.USER = this.localService.USER;
    if (!this.USER) {
      this.navCtrl.navigateRoot('/home');
    } else {
      if (this.USER.U_ROLE !== 'Admin' && this.USER.U_ROLE !== 'Manager') {
        this.navCtrl.navigateRoot('/home');
      }
    }

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

  isAdmin()
  {
    if(this.USER.U_ROLE !== 'Admin') return true;
    return false;
  }

  downloadUsersReport() {
    // this.loadingService.presentLoading();
    let _USERS = [];
    this.USERS.forEach(U => {
      let _USER = {};
      _USER['ID'] = U.U_ID;
      _USER['Email'] = U.U_EMAIL;
      _USER['Họ và tên'] = U.U_FULLNAME;
      _USER['SĐT'] = U.U_PHONE;
      _USER['Giới tính'] = U.U_GENDER;
      _USER['Quyền'] = U.U_ROLE;
      _USER['Địa chỉ'] = U.U_ADDRESS;
      _USER['Ngày sinh'] = U.U_DoB;
      _USERS.push(_USER);
    })
    console.log(_USERS);
    // this.loadingService.loadingDissmiss();
    this.excelService.exportFromArrayOfObject2Excel(_USERS, 'USERS_');

  }

}
