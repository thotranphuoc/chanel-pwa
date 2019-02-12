import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-user-new-add',
  templateUrl: './user-new-add.page.html',
  styleUrls: ['./user-new-add.page.scss'],
})
export class UserNewAddPage implements OnInit {
  USER: iUser;
  constructor(
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.USER = this.localService.USER_DEFAULT;
  }

  createAccount4User(email, passwd, role) {
    console.log(email, passwd, role);
    this.authService.accountCreate(email, passwd)
      .then((res) => {
        this.USER.U_ID = res.user.uid;
        this.USER.U_EMAIL = email;
        this.USER.U_ROLE = role;
        return this.crudService.userCreate(this.USER)
      })
      .then((res) => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  cancel() {

  }

}
