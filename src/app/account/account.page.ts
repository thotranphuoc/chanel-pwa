import { Component, OnInit, OnDestroy } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LocalService } from '../services/local.service';
import { Subscription } from 'rxjs';
import { CrudService } from '../services/crud.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  USER: iUser;
  // isSigned = true;
  userSubcription: Subscription;
  constructor(
    private navCtrl: NavController,
    public authService: AuthService,
    private localService: LocalService,
    private crudService: CrudService
  ) {

    // this.USER = this.localService.USER_DEFAULT;
    // console.log(this.authService.isSigned);
  }

  ngOnInit() {
    this.userSubcription = this.authService.userChange.subscribe(user => {
      this.USER = user;
      console.log(this.USER);
    });

    console.log('ngOnInit', this.USER, this.authService.isAuthenticated);
    this.USER = this.localService.USER;
  }

  ngOnDestroy() {
    this.userSubcription.unsubscribe();
    console.log('ngOnDestroy');
  }

  login(email: string, passwd: string) {
    console.log(email, passwd);
    this.authService.signInWithAfAuth(email, passwd)
      .then(() => {
        this.navCtrl.goBack();
      })
  }

  logout() {
    this.authService.signOutWithAfAuth();
  }

  update() {
    console.log(this.USER);
    this.crudService.userUpdate(this.USER)
      .then((res) => {
        console.log(res);
        this.navCtrl.goBack();
      })
      .catch(err => {
        console.log(err);
      })
  }

}
