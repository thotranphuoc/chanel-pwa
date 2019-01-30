import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  USER: iUser;
  isSigned = true;
  constructor(
    public authService: AuthService,
    private localService: LocalService
  ) {

    this.USER = this.localService.USER_DEFAULT;
    console.log(this.authService.isSigned);
  }

  ngOnInit() {
  }

  login(email: string, passwd: string) {
    console.log(email, passwd);
    this.authService.signInWithAfAuth(email, passwd);
  }

  logout() {
    this.authService.signOutWithAfAuth();
  }

}
