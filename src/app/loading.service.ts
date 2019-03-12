import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: any;
  constructor(public loadingController: LoadingController) {}

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Vui lòng chờ ...',
      duration: 10000
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async loadingDissmiss(){
    await this.loading.dismiss();
    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}
