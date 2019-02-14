import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';

@Component({
  selector: 'app-slots-in-day',
  templateUrl: './slots-in-day.page.html',
  styleUrls: ['./slots-in-day.page.scss'],
})
export class SlotsInDayPage implements OnInit {
  data: any;
  selectedDay: iDay;
  DATE: string;
  constructor(
    private modalCtrl: ModalController,
    private navPar: NavParams
  ) {
    this.data = this.navPar.data;
    console.log(this.data);
    this.selectedDay = this.data.selectedDay;
    let temp = this.selectedDay.DateId;
    let year = temp.substr(0, 4);
    let month = temp.substr(4, 2);
    let date = temp.substr(6, temp.length - 6);
    let finalDate = date.length < 2 ? '0' + date : date;
    this.DATE = finalDate + '/' + month + '/' + year;

  }

  ngOnInit() {
  }

  selectSlot(selectedDay: iDay, slot: iSlot, index: number) {
    console.log(selectedDay, slot, index);
    this.doDismiss(selectedDay, slot, index);
  }

  doDismiss(selectedDay, selectedSlot, selectedIndex) {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({
        selectedDay: selectedDay,
        selectedSlot: selectedSlot,
        selectedIndex: selectedIndex
      });
    }).catch(err => { console.log(err) });
  }

  doCancel() {
    this.modalCtrl.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss();
    }).catch(err => { console.log(err) });
  }

}
