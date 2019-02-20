import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { CalendarService } from '../services/calendar.service';
import { iUser } from '../interfaces/user.interface';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';
import { AppService } from '../services/app.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-slot-assign',
  templateUrl: './slot-assign.page.html',
  styleUrls: ['./slot-assign.page.scss'],
})
export class SlotAssignPage implements OnInit, OnDestroy {
  YYYYMM = '201908';
  YYYY = '2019';
  MM = '08';
  DaysInMonth: iDay[] = [];
  STATES = ['Available', 'Booked', 'Canceled', 'Completed', 'Expired'];
  TODAY: string;
  Specialists = [];
  selectedSpecialist: iUser = null;
  NONE = {
    SPE_ID: '',
    SPE_NAME: ''
  }
  constructor(
    private alertCtrl: AlertController,
    private crudService: CrudService,
    private calendarService: CalendarService,
    private appService: AppService
  ) { }

  ngOnInit() {
    // this.initCalendar();
    this.getSpecialists();
  }

  ngOnDestroy() {
    console.log(this.DaysInMonth);
    // this.updateWholeMonthWhenLeaving();
  }

  updateWholeMonthWhenLeaving() {
    let MonthObj = {}
    this.DaysInMonth.forEach(Day => {
      MonthObj[Day.DateId] = Day
    })
    console.log(MonthObj);
    this.crudService.calendarMonthUpdate(this.YYYYMM, MonthObj)
      .then((res) => console.log(res))
      .catch(err => console.log(err));
  }

  initCalendar() {
    this.TODAY = this.calendarService.getTodayString();
    console.log(this.TODAY);
    this.getCalendarsOfMonth();
  }

  selectMonth(selectedMonth: string) {
    console.log(selectedMonth);
    this.YYYY = selectedMonth.substr(0, 4);
    this.MM = selectedMonth.substr(5, 2);
    this.YYYYMM = this.YYYY + this.MM;
    this.getCalendarsOfMonth();
  }

  getCalendarsOfMonth() {
    let sub = this.crudService.calendarMonthGet(this.YYYYMM)
      .subscribe(MonthObj => {
        sub.unsubscribe();
        console.log(MonthObj);
        if (MonthObj) {
          this.convertObject2Array(MonthObj);
        } else {
          this.monthNotExistAlertConfirm();
        }

      })
  }

  convertObject2Array(MonthObj: Object) {
    let KEYS = Object.keys(MonthObj);
    let _DaysInMonth = [];
    KEYS.forEach(KEY => {
      _DaysInMonth.push(MonthObj[KEY])
    })
    this.DaysInMonth = this.calendarService.addAdditionalProsIntoDaysInMonth(_DaysInMonth);
    console.log(this.DaysInMonth);
  }

  getSpecialists() {
    this.crudService.usersGet().subscribe(qSnap => {
      let USERS = [];
      qSnap.forEach(docSnap => {
        let USER = <iUser>docSnap.data();
        USERS.push(USER);
        this.Specialists = USERS.filter(U => U.U_ROLE == 'Specialist');
      })
      console.log(this.Specialists);
      // this.selectedBA = this.BAs[0];
    })
  }

  selectSlotInList(Day: iDay, SLOT: iSlot, i: number) {
    console.log(Day, SLOT, i);
    console.log(this.selectedSpecialist);
    if (this.selectedSpecialist) {
      SLOT.SPE_ID = this.selectedSpecialist.U_ID ? this.selectedSpecialist.U_ID : '';
      SLOT.SPE_NAME = this.selectedSpecialist.U_NAME ? this.selectedSpecialist.U_NAME : '';
      Day.Slots[i] = SLOT;
      console.log(Day, SLOT, this.selectedSpecialist)
      this.crudService.dayUpdate(Day)
        .then((res) => console.log(res))
        .catch(err => console.log(err));
    } else {
      this.appService.alertConfirmationShow(null, 'Select Specical please');
    }

  }


  async monthNotExistAlertConfirm() {
    let MONTHSTR = this.MM + '/' + this.YYYY
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: MONTHSTR + ' is not existing. Do you want to create it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.calendarForMonthCreate();
          }
        }
      ]
    });

    await alert.present();
  }


  calendarForMonthCreate() {
    this.calendarService.calendarForMonthCreate(Number(this.YYYY), Number(this.MM))
      .then((res) => {
        console.log(res);
        this.getCalendarsOfMonth();
      })
      .catch(err => {
        console.log(err);

      })

    //   // console.log(selectedMonth);
    //   // let YYYYMM = selectedMonth.replace('-', '');
    //   // let MM = YYYYMM.substr(4, 2);
    //   // let YYYY = YYYYMM.substr(0, 4);
    //   // console.log(YYYYMM);
    //   let sub = this.crudService.calendarMonthGet(this.MM, this.YYYY)
    //     .subscribe(res => {
    //       console.log(res);
    //       sub.unsubscribe();
    //       if (typeof (res) !== 'undefined') {
    //         this.appService.alertConfirmationShow('Notice', 'Data for this month is already existing');
    //         return Promise.resolve();
    //       } else {
    //         return this.calendarService.calendarForMonthCreate(Number(YYYY), Number(MM))
    //           .then((res) => {
    //             console.log(res);
    //           })
    //           .catch(err => {
    //             console.log(err);
    //           })
    //       }
    //     })

    // this.crudService.cal

  }
}
