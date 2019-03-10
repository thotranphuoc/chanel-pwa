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
      buttons: ['Đóng']
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

  // SUMMARY
  // DateFormat1: 2017-12-20
  // DateFormat2: 2017/12/20
  // DateFormat3: 20171220

  // return format: '2017/04/09'
  getCurrentDate(): string {
    let today = new Date();
    let realMonth = today.getMonth() + 1;
    let month = realMonth < 10 ? '0' + realMonth : realMonth;
    let date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
    return today.getUTCFullYear().toString() + '/' + month.toString() + '/' + date.toString();
  }

  // return format1: '2017-04-09'
  getCurrentDateFormat1(): string {
    let DATE = this.getCurrentDate();
    return this.convertDateFormat1(DATE);
  }

  // return format2: '2017/04/09'
  getCurrentDateFormat2(): string {
    let DATE = this.getCurrentDate();
    return this.convertDateFormat2(DATE);
  }

  // return 20171108
  getCurrentDateFormat3() {
    let DATE = this.getCurrentDate();
    return this.convertDateFormat3(DATE);
  }

  // return format: '12:30:15'
  getCurrentTime(): string {
    let today = new Date();
    let hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    let minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    let second = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

    return hour.toString() + ':' + minute.toString() + ':' + second.toString();
  }

  // return format: '2017/04/09 12:30:15'
  getCurrentDateAndTime(): string {
    return this.getCurrentDate() + ' ' + this.getCurrentTime();
  }

  // return 20180619205900
  getCurrentDateAndTimeString() {
    let today = new Date();
    let hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    let minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    let realMonth = today.getMonth() + 1;
    let month = realMonth < 10 ? '0' + realMonth : realMonth;
    let date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
    let year = today.getUTCFullYear().toString()
    return year + month + date + hour + minute;
  }

  // convert from 2017/10/10 to 2017-10-10
  convertDateFormat1(DATE1: string) {
    return DATE1.substr(0, 4) + '-' + DATE1.substr(5, 2) + '-' + DATE1.substr(8, 2);
  }

  convertDateFormat2(DATE1: string) {
    return DATE1.substr(0, 4) + '/' + DATE1.substr(5, 2) + '/' + DATE1.substr(8, 2);
  }

  // return format: 20171108
  convertDateFormat3(DATE1: string) {
    console.log(DATE1);
    return DATE1.substr(0, 4) + DATE1.substr(5, 2) + DATE1.substr(8, 2);
  }

}
