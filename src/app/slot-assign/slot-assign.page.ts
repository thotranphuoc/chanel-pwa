import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { CalendarService } from '../services/calendar.service';
import { iUser } from '../interfaces/user.interface';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';
import { AppService } from '../services/app.service';
import { AlertController, ActionSheetController } from '@ionic/angular';

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
  COLOR_SPE: any = [];

  Specialists = [];
  selectedSpecialist: iUser = null;
  NONE = {
    SPE_ID: '',
    SPE_NAME: ''
  }
  selectedDay: iDay;
  deleteUpdateSlotsMode = false;
  constructor(
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private crudService: CrudService,
    private calendarService: CalendarService,
    private appService: AppService
  ) {
    this.COLOR_SPE[''] = 'Gray';
  }

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
        this.COLOR_SPE[USER.U_ID] = this.getRandomColor();
        USERS.push(USER);
        this.Specialists = USERS.filter(U => U.U_ROLE == 'Specialist');
      })
      console.log(this.Specialists);
      console.log(this.COLOR_SPE);
      // this.selectedBA = this.BAs[0];
    })
  }

  selectSlotInList(Day: iDay, SLOT: iSlot, i: number) {
    if (this.deleteUpdateSlotsMode) {
      console.log('update/delete slot in list')
      this.alertActionDeleteOrUpdateslot(Day, SLOT, i);
    } else {
      this.updateSlotInList(Day, SLOT, i);
    }

  }

  updateSlotInList(Day: iDay, SLOT: iSlot, i: number) {
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
      this.appService.alertConfirmationShow(null, 'Select Specicalist please');
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

  //random color
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  updateSlots(Day: iDay) {
    console.log(Day);
    this.selectedDay = Day;
    this.actionSheetOnUpdateSlots(Day);
    // this.doAddNewSlot(Day);
  }

  async actionSheetOnUpdateSlots(Day: iDay) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: null,
      buttons: [{
        text: 'Cập nhật / Xoá',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete/Update clicked');
          this.deleteUpdateSlotsMode = true;
        }
      }, {
        text: 'New',
        icon: 'add',
        handler: () => {
          this.doAddNewSlot(Day);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.deleteUpdateSlotsMode = false;
        }
      }]
    });
    await actionSheet.present();
  }

  async doAddNewSlot(Day: iDay) {
    const alert = await this.alertCtrl.create({
      header: 'Chọn giờ',
      inputs: [
        {
          name: 'slotStr',
          type: 'text',
          placeholder: 'Nhập giờ cho slot. Vd: 10:30'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (data) => {
            console.log('Confirm Ok', data);
            this.addNewSlotIntoDay(Day, data.slotStr);
          }
        }
      ]
    });

    await alert.present();
  }

  addNewSlotIntoDay(Day: iDay, TimeOfSlot: string) {
    let SLOT: iSlot = {
      BAB_ID: "",
      BAB_NAME: "",
      BAS_ID: "",
      BAS_NAME: "",
      BOOK_ID: "",
      MAN_ID: "",
      MAN_NAME: "",
      SLOT: TimeOfSlot,
      SPE_ID: "",
      SPE_NAME: "",
      STATUS: "AVAILABLE",
    }
    let _Slots = Day.Slots;
    _Slots.push(SLOT);
    _Slots.sort((a, b) => {
      if (Number(a.SLOT.replace(':', '')) > Number(b.SLOT.replace(':', ''))) return 1;
      if (Number(a.SLOT.replace(':', '')) < Number(b.SLOT.replace(':', ''))) return -1;
      return 0;
    })

    Day.Slots = _Slots;
    this.crudService.dayUpdate(Day);
  }

  async alertActionDeleteOrUpdateslot(Day: iDay, SLOT: iSlot, i: number) {
    console.log(Day, SLOT, i);
    const alert = await this.alertCtrl.create({
      header: 'Cập nhật',
      inputs: [
        {
          name: 'newSLotValue',
          type: 'text',
          value: SLOT.SLOT,
          placeholder: 'Nhập thời gian slot mới'
        },
        {
          disabled: true,
          value: SLOT.SPE_NAME,
          placeholder: 'Placeholder 2'
        },
        {
          disabled: true,
          value: SLOT.STATUS,
          placeholder: 'Placeholder 2'
        },
        // {
        //   name: 'name3',
        //   value: 'http://ionicframework.com',
        //   type: 'url',
        //   placeholder: 'Favorite site ever'
        // },
        // // input date with min & max
        // {
        //   name: 'name4',
        //   type: 'date',
        //   min: '2017-03-01',
        //   max: '2018-01-12'
        // },
        // // input date without min nor max
        // {
        //   name: 'name5',
        //   type: 'date'
        // },
        // {
        //   name: 'name6',
        //   type: 'number',
        //   min: -5,
        //   max: 10
        // },
        // {
        //   name: 'name7',
        //   type: 'number'
        // }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.deleteUpdateSlotsMode = false;
          }
        }, {
          text: 'Update',
          handler: (data) => {
            console.log('Confirm Ok', data);
            SLOT.SLOT = data.newSLotValue;
            Day.Slots[i] = SLOT;
            this.crudService.dayUpdate(Day);
            this.deleteUpdateSlotsMode = false;
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: (data) => {
            console.log('Confirm Ok', data);
            Day.Slots.splice(i, 1);
            this.crudService.dayUpdate(Day);
            this.deleteUpdateSlotsMode = false;
          }
        }
      ]
    });

    await alert.present();
  }
}
