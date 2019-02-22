import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController

  ) { }

  async alertShow(HEADER: string, SUBHEADER: string, MSG: string, ) {
    const alert = await this.alertController.create({
      header: HEADER,
      subHeader: SUBHEADER,
      message: MSG,
      buttons: ['Chấp nhận']
    });

    await alert.present();
  }

  async alertConfirmationShow(HEADER: string, MSG: string) {
    const alert = await this.alertController.create({
      header: HEADER,
      message: MSG,
      buttons: [
        {
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Chấp nhận',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async toastShow(MSG: string, DURATION: number) {
    const toast = await this.toastController.create({
      message: MSG,
      duration: DURATION
    });
    toast.present();
  }

  async toastWithOptionsShow(MSG: string) {
    const toast = await this.toastController.create({
      message: MSG,
      showCloseButton: true,
      position: 'middle',
      closeButtonText: 'Chấp nhận'
    });
    toast.present();
  }
}
