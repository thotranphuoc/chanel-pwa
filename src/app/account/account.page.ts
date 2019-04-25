import { Component, OnInit, OnDestroy } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LocalService } from '../services/local.service';
import { Subscription } from 'rxjs';
import { CrudService } from '../services/crud.service';
import { NavController, ModalController } from '@ionic/angular';
import { AppService } from '../services/app.service';
import { SetgetService } from '../services/setget.service';
import { DbService } from '../services/db.service';
import { UserPhotoTakePage } from '../user-photo-take/user-photo-take.page';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  USER: iUser;
  base64Images: string[] = [];
  hasNewAvatar: boolean = false;
  // isSigned = true;
  userSubcription: Subscription;
  constructor(
    private navCtrl: NavController,
    public authService: AuthService,
    private localService: LocalService,
    private crudService: CrudService,
    private appService: AppService,
    private setGetService: SetgetService,
    private modalCtrl: ModalController,
    private dbService: DbService
  ) {

    // this.USER = this.localService.USER_DEFAULT;
    // console.log(this.authService.isSigned);
  }

  ngOnInit() {
    this.userSubcription = this.authService.userChange.subscribe(user => {
      this.USER = user;
      this.localService.USER = this.USER
      console.log(this.USER);
      if (this.USER) this.logAdd();

    });

    console.log('ngOnInit', this.localService.USER, this.authService.isAuthenticated);
    this.USER = this.localService.USER;
  }

  logAdd() {
    this.dbService.logAdd(this.USER.U_ID, this.USER.U_NAME, this.USER.U_ROLE, 'Login')
      .then((res) => {
        console.log('Update log');
        console.log(res);
        //return this.updateScoreAndLevel()
      })
      .catch(err => {
        console.log(err);
      })
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
      .catch(err => {
        console.log(err);
        if (err.code == 'auth/user-not-found') {
          this.appService.alertConfirmationShow('Lỗi', 'Thông tin đăng nhập không đúng');
        }

        if (err.code == 'auth/invalid-email') {
          this.appService.alertConfirmationShow('Lỗi', 'Email không đúng');
        }

        if (err.code == 'auth/wrong-password') {
          this.appService.alertConfirmationShow('Lỗi', 'Thông tin đăng nhập không đúng');
        }
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

  async takePhoto() {
    console.log('take Photo');
    let photosModal = await this.modalCtrl.create({
      component: UserPhotoTakePage,
      componentProps: { PHOTOS: this.base64Images }
    })
    await photosModal.present();
    const data: any = await photosModal.onDidDismiss();
    console.log('show data');
    console.log(data);
    console.log('show image photo');
    console.log(data.data.PHOTOS);
    this.base64Images = data.data.PHOTOS;
    this.hasNewAvatar = true;
    console.log('show image');
    console.log(this.base64Images);
    this.uploadImageThenUpdateURL();
  }

  uploadImageThenUpdateURL() {
    // console.log(this.PROFILE);
    this.dbService.uploadBase64Image2FBReturnPromiseWithURL('USERS/' + this.USER.U_ID, this.base64Images[0], this.USER.U_ID)
      .then((downloadURL: string) => {
        console.log(downloadURL);
        this.USER.U_AVATAR = downloadURL;
        console.log(this.USER);
        this.updateUser();
        // this.onUpdateProfile();
      })
      .catch((err) => console.log(err));
  }

  updateUser() {
    console.log(this.USER);
    this.crudService.userUpdate(this.USER)
      .then((res) => {
        console.log(res);
        this.appService.alertShow('Thành công', null, 'Cập nhật thành công');
        this.navCtrl.goBack();
      })
      .catch(err => {
        console.log(err);
        this.appService.alertShow('Thất bại', null, 'Cập nhật thất bại');
      })
  }

}
