import { Component, OnInit } from '@angular/core';
import { iBooking } from '../interfaces/booking.interface';
import { SetgetService } from '../services/setget.service';
import { NavController, ModalController } from '@ionic/angular';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { AppointmentEditPage } from '../appointment-edit/appointment-edit.page';
import { isLastDayOfMonth } from 'date-fns';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-booking-history-detail',
  templateUrl: './booking-history-detail.page.html',
  styleUrls: ['./booking-history-detail.page.scss'],
})
export class BookingHistoryDetailPage implements OnInit {
  BOOKING: iBooking;
  selectedDay: iDay;
  selectedMonthDay: iDay[];
  slot: iSlot = {
    BOOK_ID: '',
    SLOT: '',
    STATUS: '',
    BAB_ID: '',
    BAB_NAME: '',
    BAS_ID: '',
    BAS_NAME: '',
    MAN_ID: '',
    MAN_NAME: '',
    SPE_ID: '',
    SPE_NAME: '',
}
  index:any;
  constructor(
    private setGetService: SetgetService,
    private navCtrl: NavController,
    public modalController: ModalController,
    private crudService: CrudService
  ) { 
    this.BOOKING = this.setGetService.getPar();
    this.getCalendarBooking();
  }

  ngOnInit() {
  }

  doEditBooking(){
    //this.setGetService.setPar(BOOKING);
    console.log(this.BOOKING);
    
    this.slot.BOOK_ID=this.BOOKING.B_ID;
    this.modalAppointmentEdit(this.selectedDay, this.slot, this.index);
    //this.navCtrl.navigateForward('/appointment-edit');
  }

 async modalAppointmentEdit(selectedDay: iDay, slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentEditPage,
      componentProps: { selectedDay: selectedDay, Slot: slot, index: index }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  getCalendarBooking(){
    let fullday=this.BOOKING.B_DATE.split("-")
    console.log(fullday);
    let yearmonthtime = fullday[0]+fullday[1];
    let YYYYMMDD_=fullday[0]+fullday[1]+fullday[2]+'';
    this.crudService.calendarDayGet(this.BOOKING.B_DATE).subscribe(qSnap=>{
      console.log(qSnap);
      this.selectedDay = qSnap[YYYYMMDD_];
      for(let i=0; i< this.selectedDay.Slots.length;i++)
      {
        if(this.selectedDay.Slots[i].SLOT==this.BOOKING.B_SLOT)
        {
          this.slot=this.selectedDay.Slots[i];
          this.index=i;
        }
      }
      
      console.log(this.selectedDay,this.slot, this.index);
    })
  }

}
