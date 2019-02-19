import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { NavController, ModalController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { AppService } from '../services/app.service';
import { PhotoTakePageModule } from '../photo-take/photo-take.module';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  USER: iUser;
  base64Images: string[] = [];
  hasNewAvatar: boolean = false;
  constructor(
    private navCtrl: NavController,
    private crudService: CrudService,
    private setGetService: SetgetService,
    private appService: AppService,
    private modalCtrl: ModalController,
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
  
  takePhoto() {
    console.log('take Photo');
    
  }

  uploadImageThenUpdateURL() {
    // console.log(this.PROFILE);
    /*this.dbService.uploadBase64Image2FBReturnPromiseWithURL('Avatar/' + this.USER.U_ID, this.base64Images[0], this.USER.U_ID)
      .then((downloadURL: string) => {
        this.USER.U_AVATAR = downloadURL;
        console.log(this.USER);
        // this.onUpdateProfile();
      })
      .catch((err) => console.log(err));*/
  }

}
