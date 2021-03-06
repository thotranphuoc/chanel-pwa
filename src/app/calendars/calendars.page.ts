import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { CustomerAddPage } from '../customer-add/customer-add.page';
import { AppointmentAddPage } from '../appointment-add/appointment-add.page';
import { CrudService } from '../services/crud.service';
import { Subscription, Observable } from 'rxjs';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';
import { AppointmentEditPage } from '../appointment-edit/appointment-edit.page';
import { LocalService } from '../services/local.service';
import { AppService } from '../services/app.service';
import { SlotsInDayPage } from '../slots-in-day/slots-in-day.page';
import { LoadingService } from '../loading.service';
import { iUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
})
export class CalendarsPage implements OnInit, OnDestroy {
  WEEKSinMONTH1: any[] = [];
  WEEKSinMONTH2: any[] = [];
  MONTHS = [];
  DaysInM1 = [];
  DaysInM2 = [];
  segment = 'overall';
  selectedDay: iDay = null;
  selectedSlot: iSlot = null;
  month1Subscription: Subscription;
  month2Subscription: Subscription;
  TODAY: string;
  currentYYYYMM: string;
  nextYYYYMM: string;
  //USER:iUser;
  STATES = [{ VI: 'TRỐNG', EN: 'Available' }, { VI: 'ĐÃ ĐẶT', EN: 'Booked' }, { VI: 'HOÀN THÀNH', EN: 'Completed' }, { VI: 'HUỶ BỎ', EN: 'Canceled' }, { VI: 'HẾT HẠN', EN: 'Expired' }, { VI: 'CHỜ DUYỆT', EN: 'Draft' }, { VI: 'KHOÁ', EN: 'Blocked' }];
  StateOfDay = ['Chưa có Booking', 'Đã có booking', 'Đầy booking'];
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    public modalController: ModalController,
    private alertController: AlertController,
    private calendarService: CalendarService,
    private crudService: CrudService,
    private localService: LocalService,
    private appService: AppService,
    private loadingService: LoadingService
  ) { 
    
  }

  ngOnInit() {
    this.initCalendar();
    //this.USER=this.localService.USER;
  }

  ngOnDestroy() {
    this.month1Subscription.unsubscribe();
    this.month2Subscription.unsubscribe();
  }


  initCalendar() {
    this.TODAY = this.calendarService.getTodayString();
    this.currentYYYYMM = this.TODAY.substr(0, 6);
    this.nextYYYYMM = this.calendarService.getNextMonth(this.currentYYYYMM);
    let _35Days1: iDay[] = this.calendarService.create35DaysOfMonth(this.currentYYYYMM);
    let _35Days2: iDay[] = this.calendarService.create35DaysOfMonth(this.nextYYYYMM);
    //console.log('so ngay: ',_35Days1, _35Days2);
    this.loadingService.presentLoading();
    this.month1Subscription = this.crudService.calendarMonthGet(this.currentYYYYMM)
      .subscribe(data => {
        this.WEEKSinMONTH1 = [];
        console.log(data)
        if (typeof (data) !== 'undefined') {
          let newdays = _35Days1.map(day => data[day.DateId]);
          newdays.forEach(day => {
            let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
            day['n'] = n;
            let isblock=false;
            if(n>=4)
            {
              let block_ = day.Slots.filter(slot => slot.STATUS === 'BLOCKED').length;
              if(block_ >= 4)
                isblock=true;
            }
            let isDraft= day.Slots.filter(slot => slot.STATUS === 'DRAFT').length;
            console.log(day['isThePast']);
            
            day['isdraft']=(isDraft>=1);
            day['isblock']=isblock;
            let isCanceled= day.Slots.filter(slot => slot.STATUS === 'CANCELED').length;
            day['isCancel']=isCanceled;
          });
          //console.log('New day: ',newdays);
          this.DaysInM1 = this.calendarService.addAdditionalProsIntoDaysInMonth(newdays);
          let W1 = newdays.slice(0, 7);
          let W2 = newdays.slice(7, 14);
          let W3 = newdays.slice(14, 21);
          let W4 = newdays.slice(21, 28);
          let W5 = newdays.slice(28, 35);
          let W6 = newdays.slice(35, 42);
          this.WEEKSinMONTH1.push(W1, W2, W3, W4, W5, W6);
        }
        this.loadingService.loadingDissmiss();
      });

    this.month2Subscription = this.crudService.calendarMonthGet(this.nextYYYYMM)
      .subscribe(data => {
        this.WEEKSinMONTH2 = [];
        console.log(data)
        if (typeof (data) !== 'undefined') {
          let newdays = _35Days2.map(day => data[day.DateId]);
          newdays.forEach(day => {
            let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
            day['n'] = n;
            let isblock=false;
            if(n>=4)
            {
              let block_ = day.Slots.filter(slot => slot.STATUS === 'BLOCK').length;
              if(block_ >= 4)
                isblock=true;
            }
            let isDraft= day.Slots.filter(slot => slot.STATUS === 'DRAFT').length;
            console.log(day['isThePast']);
            day['isdraft']=(isDraft>=1);
            day['isblock']=isblock;
            let isCanceled= day.Slots.filter(slot => slot.STATUS === 'CANCELED').length;
            day['isCancel']=isCanceled;
          });
          console.log(newdays);
          this.DaysInM2 = this.calendarService.addAdditionalProsIntoDaysInMonth(newdays);
          let W1 = newdays.slice(0, 7);
          let W2 = newdays.slice(7, 14);
          let W3 = newdays.slice(14, 21);
          let W4 = newdays.slice(21, 28);
          let W5 = newdays.slice(28, 35);
          let W6 = newdays.slice(35, 42);
          this.WEEKSinMONTH2.push(W1, W2, W3, W4, W5, W6);
        }
        this.loadingService.loadingDissmiss();
      });

  }

  segmentChanged(ev: CustomEvent) {
    console.log(ev);
    this.segment = ev.detail.value;
    console.log(this.segment);
  }

  selectDay(Day: iDay) {
    console.log(Day);
    this.selectedDay = Day;
    this.openSlotsInDayModal(Day);
  }
  selectSlot(selectedDay: iDay, slot: iSlot, index: number) {
    console.log(selectedDay, slot, index);
    this.selectedSlot = slot;
    this.openAppointmentModal(selectedDay, slot, index);
  }

  getColorOfDay(Day: any) {
    console.log(Day);
    if (Day.Data.number >= 2) return "color='danger'";
    return "color='success'";
  }

  // addNewAppointment() {
  //   console.log('fab button')
  //   this.modalAppointmentAdd(null, null, null);
  // }

  async modalAppointmentAdd(selectedDay: iDay, slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentAddPage,
      componentProps: { selectedDay: selectedDay, Slot: slot, index: index }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  async modalAppointmentEdit(selectedDay: iDay, slot: iSlot, index: number) {
    const modal = await this.modalController.create({
      component: AppointmentEditPage,
      componentProps: { selectedDay: selectedDay, Slot: slot, index: index, isOnCalendar: true }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

  selectSlotInList(Day: iDay, SLOT: iSlot, index: number) {
    console.log(SLOT.SPE_ID);
    this.openAppointmentModal(Day, SLOT, index);
    //this.checkingSlotExistingB4Booking(Day, SLOT, index);
  }


  checkingSlotExistingB4Booking(Day: iDay, SLOT: iSlot, i: number) {
    this.crudService.calendarSlotGet(Day.DateId)
      .then(docSnap => {
        let MONTHOBJ = docSnap.data();
        console.log(MONTHOBJ[Day.DateId], i);
        let _Day = MONTHOBJ[Day.DateId];
        let _SLOT = _Day.Slots[i];
        if (_SLOT.BOOK_ID.length > 1) {
          this.appService.alertShow('Thông báo!', '', 'Slot đã được book xin vui lòng chọn slot khác');
        } else {
          //check last day before show popup add
          if(Day.isThePast)
          {
            this.appService.alertShow('Thông báo!', '', 'Ngày đã qua xin vui lòng chọn slot của ngày khác!');
          }
          else
            this.modalAppointmentAdd(Day, SLOT, i);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  openAppointmentModal(Day: iDay, SLOT: iSlot, index: number) {
    console.log(Day, SLOT, index);
    //console.log(SLOT[index].SPE_ID);
    if (this.localService.USER) {
      if (SLOT.STATUS == 'BLOCKED') return;
      if (SLOT.STATUS == 'AVAILABLE' || SLOT.STATUS == 'CANCELED') {
        
        //check assign for specialist
        if(SLOT.SPE_ID=="")
        {
          //console.log(SLOT[index].SPE_ID);
          this.alertShowCheckAssign('Thông báo!', 'Chưa tạo được booking. Vui lòng liên hệ người quản lý.');
        }else
        {
          if(SLOT.STATUS == 'CANCELED' && (this.localService.USER.U_ROLE === "Admin" || this.localService.USER.U_ROLE === "Manager"))
          { 
            this.modalAppointmentEdit(Day, SLOT, index);
          }
          else
            this.checkingSlotExistingB4Booking(Day, SLOT, index);
        }
        
          //this.modalAppointmentAdd(Day, SLOT, index);
      } else {
        this.modalAppointmentEdit(Day, SLOT, index);
      }
    } else {
      this.alertConfirmationShow('Thông báo!', 'Vui lòng đăng nhập để tiếp tục...');
    }

  }

  openSlotsInDayModal(Day: iDay) {
    console.log(Day);
    if (this.localService.USER) {
      this.slotsInDayModal(Day);
    } else {
      this.alertConfirmationShow('Thông báo!', 'Vui lòng đăng nhập để tiếp tục...');
    }
  }

  async slotsInDayModal(Day: iDay) {
    const modal = await this.modalController.create({
      component: SlotsInDayPage,
      componentProps: { selectedDay: Day }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
    if (typeof (data.data) !== 'undefined' && typeof (data.role) == 'undefined') {
      let res = data.data;
      this.openAppointmentModal(res.selectedDay, res.selectedSlot, res.selectedIndex);
    }
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
            this.navCtrl.navigateForward('/account');
          }
        }
      ]
    });

    await alert.present();
  }


  async alertShowCheckAssign(HEADER: string, MSG: string) {
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
            return;
            //this.navCtrl.navigateForward('/account');
          }
        }
      ]
    });

    await alert.present();
  }

}
