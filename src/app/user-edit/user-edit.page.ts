import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { NavController, ModalController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { AppService } from '../services/app.service';
import { DbService } from '../services/db.service';
import { UserPhotoTakePage } from '../user-photo-take/user-photo-take.page';
import { LocalService } from '../services/local.service';
import { iBooking } from '../interfaces/booking.interface';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  USER_: iUser;
  USER: iUser;
  base64Images: string[] = [];
  hasNewAvatar: boolean = false;
  constructor(
    private navCtrl: NavController,
    private crudService: CrudService,
    private setGetService: SetgetService,
    private appService: AppService,
    private modalCtrl: ModalController,
    private dbService: DbService,
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.USER_=this.localService.USER;
    this.USER = this.setGetService.getPar();
    console.log(this.USER);
    if (typeof (this.USER) == 'undefined') {
      this.navCtrl.navigateRoot('/home');
    }
  }

  updateUser() {
    console.log(this.USER);
    this.crudService.userUpdate(this.USER)
      .then((res) => {
        console.log(res);

        this.dbService.logAdd(this.USER_.U_ID, this.USER_.U_FULLNAME,this.USER_.U_ROLE,'Update User ' + this.USER.U_FULLNAME + ' - Role ' + this.USER.U_ROLE)
          .then((res) => {
            console.log('Update log');
            console.log(res);
            //return this.updateScoreAndLevel()
          })
          .catch(err => {
            console.log(err);
          })

          this.crudService.bookingsOfUserGet(this.USER.U_ID)
          .subscribe(qSnap => {
            let BOOKINGS = [];
            qSnap.forEach(qDocSnap => {
              let BOOKING = <iBooking>qDocSnap.data();
              BOOKING.B_BA_BOOK_NAME=this.USER.U_NAME;
              BOOKING.B_BA_BOOK=this.USER;
              //gọi hàm update booking
              console.log('log kq update',this.crudService.bookUpdate(BOOKING));
              BOOKINGS.push(BOOKING);
            })
            console.log(BOOKINGS);
          })
        this.appService.alertShow('Thành công', null, 'Cập nhật thành công');
        this.navCtrl.goBack();
      })
      .catch(err => {
        console.log(err);
        this.appService.alertShow('Thất bại', null, 'Cập nhật thất bại');
      })
  }

  doCancel() {
    this.navCtrl.goBack();
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

}
