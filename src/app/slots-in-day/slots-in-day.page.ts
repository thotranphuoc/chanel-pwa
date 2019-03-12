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
    let YYYY = temp.substr(0, 4);
    let MM = temp.substr(4, 2);
    let DD = temp.substr(6, 2);
    this.DATE = DD + '/' + MM + '/' + YYYY;

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

  convertStatus(STATE: string) {
    switch (STATE) {
      case 'AVAILABLE':
        return 'TRỐNG'
      case 'BOOKED':
        return 'ĐÃ ĐẶT'
      case 'COMPLETED':
        return 'HOÀN THÀNH'
      case 'CANCELED':
        return 'HUỶ BỎ'
      case 'EXPIRED':
        return 'HẾT HẠN'
      case 'DRAFT':
        return 'CHỜ DUYỆT'
      case 'BLOCKED':
        return 'KHOÁ'
      default:
        break;
    }
  }

}
