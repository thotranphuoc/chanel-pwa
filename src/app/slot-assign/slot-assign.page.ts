import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { CalendarService } from '../services/calendar.service';
import { iUser } from '../interfaces/user.interface';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';
import { AppService } from '../services/app.service';
import { AlertController, ActionSheetController, NavController } from '@ionic/angular';
import { Papa } from 'ngx-papaparse';
import { LocalService } from '../services/local.service';
import { LoadingService } from '../loading.service';
import { DbService } from '../services/db.service';
@Component({
  selector: 'app-slot-assign',
  templateUrl: './slot-assign.page.html',
  styleUrls: ['./slot-assign.page.scss'],
})
export class SlotAssignPage implements OnInit, OnDestroy {
  YYYYMM = null;
  YYYY = '2019';
  MM = '08';
  DaysInMonth: iDay[] = [];
  STATES = ['Available', 'Booked', 'Canceled', 'Completed', 'Expired'];
  TODAY: string;
  COLOR_SPE: any = [];

  Specialists: iUser[] = [];
  selectedSpecialist: iUser = null;
  NONE = {
    U_ID: '',
    U_NAME: ''
  };
  BLOCKED = {
    U_ID: 'BLOCKED',
    U_NAME: 'KHOÁ'
  }
  selectedDay: iDay;
  deleteUpdateSlotsMode = false;

  INPUTS: iInput[] = [];
  USER: iUser;
  constructor(
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private crudService: CrudService,
    private calendarService: CalendarService,
    private appService: AppService,
    private localService: LocalService,
    private papa: Papa,
    private loadingService: LoadingService,
    private dbService: DbService
  ) {
    this.COLOR_SPE[''] = 'Gray';
    this.COLOR_SPE['BLOCKED'] = 'Black';
  }

  ngOnInit() {
    // this.initCalendar();
    this.getSpecialists();
    this.authenticateUser();
  }

  authenticateUser() {
    this.USER = this.localService.USER;
    if (!this.USER) {
      this.navCtrl.navigateRoot('/home');
    } else {
      if (this.USER.U_ROLE !== 'Specialist' && this.USER.U_ROLE !== 'Manager') {
        this.navCtrl.navigateRoot('/home');
      }
    }

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
    // this.getNewDaysInMonth(this.DaysInMonth)
  }

  // getNewDaysInMonth(ARR: iDay[]) {
  //   ARR.forEach(Day => {
  //     // Day['nRows'] = this.splitIntoSubArray(Day.Slots, 4);
  //   })
  //   console.log(ARR);
  // }

  splitIntoSubArray(arr: any[], count: number) {
    var newArray = [];
    let cloneArr = arr.slice(0);
    while (cloneArr.length > 0) {
      let arr = cloneArr.splice(0, count);
      if (arr.length < count) {
        while (arr.length < count) {
          arr.push(null);
        }
        console.log(arr);
        newArray.push(arr);
      } else {
        newArray.push(arr);
      }

    }
    return newArray;
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
  selectSlotInListNew(Day: iDay, SLOT: iSlot) {
    let i = Day.Slots.map(slot => slot.SLOT).indexOf(SLOT.SLOT);
    if (this.deleteUpdateSlotsMode) {
      console.log('update/delete slot in list')
      this.alertActionDeleteOrUpdateslot(Day, SLOT, i);
    } else {
      console.log(SLOT);
      if(SLOT.BOOK_ID.length > 1 && (this.selectedSpecialist.U_ID === 'BLOCKED' || this.selectedSpecialist.U_ID === ''))
      {
        this.alertShowCheckAssign('Thông báo!', 'Slot đã có được book không thể thay đổi');
      }
      else
        this.updateSlotInList(Day, SLOT, i);
    }
  }

  updateSlotInList(Day: iDay, SLOT: iSlot, i: number) {
    console.log(Day, SLOT, i);
    console.log(this.selectedSpecialist);
    if (this.USER.U_ROLE == 'Specialist') return;
    if (this.selectedSpecialist) {
      if (this.selectedSpecialist.U_ID !== 'BLOCKED') {
        SLOT.SPE_ID = this.selectedSpecialist.U_ID ? this.selectedSpecialist.U_ID : '';
        SLOT.SPE_NAME = this.selectedSpecialist.U_NAME ? this.selectedSpecialist.U_NAME : '';
      } else {
        SLOT.SPE_ID = this.selectedSpecialist.U_ID;
        SLOT.SPE_NAME = this.selectedSpecialist.U_NAME;
        SLOT.STATUS = 'BLOCKED';
      }
      Day.Slots[i] = SLOT;

      console.log(Day, SLOT, this.selectedSpecialist);

      this.dbService.logAdd(this.USER.U_ID, this.USER.U_FULLNAME,this.USER.U_ROLE,'Slot Assign - SPE Name ' + SLOT.STATUS + ' - day ' + Day.DateId + ' - Slot ' + SLOT.SLOT )
          .then((res) => { 
            console.log('Update log');
            console.log(res);
            //return this.updateScoreAndLevel()
          })
          .catch(err => {
            console.log(err);
          })

      this.crudService.dayUpdate(Day)
        .then((res) => console.log(res))
        .catch(err => console.log(err));
    } else {
      this.appService.alertConfirmationShow(null, 'Vui lòng chọn Specialist');
    }
  }

  async alertShowCheckAssign(HEADER: string, MSG: string) {
    const alert = await this.alertCtrl.create({
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

  monthNotExistAlertConfirm() {
    if (this.USER.U_ROLE == 'Manager') {
      this.monthNotExistAlertConfirmManager();      
    } else {
      this.monthNotExistAlertConfirmSpecialist();
    }
  }

  async monthNotExistAlertConfirmManager() {
    let MONTHSTR = this.MM + '/' + this.YYYY
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận!',
      message: MONTHSTR + ' không tồn tại. Bạn có muốn tạo mới không?',
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
            this.calendarForMonthCreate();
          }
        }
      ]
    });

    await alert.present();
  }

  async monthNotExistAlertConfirmSpecialist() {
    let MONTHSTR = this.MM + '/' + this.YYYY
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận!',
      message: MONTHSTR + ' không tồn tại.',
      buttons: [
        {
          text: 'Chấp nhận',
          handler: () => {
            console.log('Confirm Okay');
            // this.calendarForMonthCreate();
          }
        }
      ]
    });

    await alert.present();
  }


  calendarForMonthCreate() {
    this.loadingService.presentLoading()
    this.calendarService.calendarForMonthCreate(Number(this.YYYY), Number(this.MM))
      .then((res) => {
        console.log(res);
        this.dbService.logAdd(this.USER.U_ID, this.USER.U_FULLNAME,this.USER.U_ROLE,'Create New Month Calender ' + this.MM + '/' + this.YYYY)
        .then((res) => {
          console.log('Update log');
          console.log(res);
          //return this.updateScoreAndLevel()
        })
        .catch(err => {
          console.log(err);
        })
        
        this.getCalendarsOfMonth();
        this.loadingService.loadingDissmiss()
      })
      .catch(err => {
        console.log(err);
        this.loadingService.loadingDissmiss()
      })

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
        text: 'Thêm',
        icon: 'add',
        handler: () => {
          this.doAddNewSlot(Day);
        }
      }, {
        text: 'Huỷ bỏ',
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
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Chấp nhận',
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
    // let _Day = Object.assign({},Day);
    //   if(_Day['nRows']){
    //     delete _Day['nRows'];
    //   }
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
      ],
      buttons: [
        {
          text: 'Huỷ bỏ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.deleteUpdateSlotsMode = false;
          }
        }, {
          text: 'Cập nhật',
          handler: (data) => {
            console.log('Confirm Ok', data);
            SLOT.SLOT = data.newSLotValue;
            Day.Slots[i] = SLOT;
            this.crudService.dayUpdate(Day);
            this.deleteUpdateSlotsMode = false;
          }
        }, {
          text: 'Xoá',
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

  uploadCalendar() {
    document.getElementById('inputFile').click();
  }

  parse(files: FileList) {
    this.parse1(files)
      .then((res: any) => {
        console.log(res);
        return this.convertData(res);
      })
      .catch(err => { console.log(err) })
  }

  async parse1(files: FileList) {
    return new Promise((resolve, reject) => {
      const file: File = files.item(0);
      console.log(files);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv = reader.result;
        console.log(csv);
        this.papa.parse(String(csv), {
          header: true,
          complete: function (results) {
            // console.log(results);
            resolve(results.data);
            // this.INPUTS = results.data;
            // console.log(this.INPUTS);
            // this.convertData(this.INPUTS);
          },
          error: (err) => {
            reject(err)
          }
        });
      }
    })

  }

  convertData(ARR: iInput[]) {
    let DAYS: iDay[] = [];
    let Obj = {};
    let YYYY = ARR[0].NAM;
    let MM = ARR[0].THANG.length < 2 ? '0' + ARR[0].THANG : ARR[0].THANG;
    let YYYYMM = YYYY + MM;

    ARR.forEach(item => {
      let _Date = item.NGAY;
      let THANG = item.THANG.length < 2 ? '0' + item.THANG : item.THANG;
      let NGAY = item.NGAY.length < 2 ? '0' + item.NGAY : item.NGAY;
      let _DateId = item.NAM + THANG + NGAY;
      let _date = THANG + '/' + NGAY;
      let SLOT1 = this.getSpecialistOfSlot(item._10h30, '10:30');
      let SLOT2 = this.getSpecialistOfSlot(item._12h30, '12:30');
      let SLOT3 = this.getSpecialistOfSlot(item._15h00, '15:00');
      let SLOT4 = this.getSpecialistOfSlot(item._17h30, '17:30');
      let _Slots: iSlot[] = [SLOT1, SLOT2, SLOT3, SLOT4];
      let _DAY: iDay = {
        Date: _Date,
        DateId: _DateId,
        Slots: _Slots,
        date: _date,
        isThePast: false,
        isDraff:false,
      };
      Obj[_DateId] = _DAY;
      DAYS.push(_DAY);

    })
    console.log(DAYS);
    console.log(Obj);
    this.presentAlertConfirm2calendarMonthCreate(YYYYMM, Obj, YYYY, MM)
    // .then((res) => {
    //   console.log(res);
    //   let selectedMonth = YYYY + '-' + MM;
    //   this.selectMonth(selectedMonth);
    // }).catch(err => {
    //   console.log(err);
    // })
  }

  async presentAlertConfirm2calendarMonthCreate(YYYYMM: string, Obj: any, YYYY: string, MM: string) {
    let MM_YYYY = MM + '/' + YYYY;
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận',
      message: 'Thêm lịch làm việc cho tháng <strong>' + MM_YYYY + '</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            this.crudService.calendarMonthCreate(YYYYMM, Obj)
              .then((res) => {
                console.log(res);
                let selectedMonth = YYYY + '-' + MM;
                this.selectMonth(selectedMonth);
              }).catch(err => {
                console.log(err);
              })
          }
        }
      ]
    });

    await alert.present();
  }


  getSpecialistOfSlot(Name: string, Slot: string) {
    let SLOT: iSlot = {
      BAB_ID: "",
      BAB_NAME: "",
      BAS_ID: "",
      BAS_NAME: "",
      BOOK_ID: "",
      MAN_ID: "",
      MAN_NAME: "",
      SLOT: Slot.replace('h', ':'),
      SPE_ID: this.getIDFromName(Name),
      SPE_NAME: Name,
      STATUS: "AVAILABLE"
    };
    return SLOT;
  }

  getIDFromName(Name: string) {
    let ID = this.Specialists.filter(SP => SP.U_NAME == Name)[0].U_ID;
    console.log(ID);
    return ID
  }

  isSecondRowOfSlots(Day: iDay) {
    if (Day.Slots.length > 4) return true;
  }
  isThirdRowOfSlots(Day: iDay) {
    if (Day.Slots.length > 8) return true;
  }
}

export interface iInput {
  _10h30: 'string',
  _12h30: 'string',
  _15h00: 'string',
  _17h30: 'string',
  NAM: 'string',
  THANG: 'string',
  NGAY: 'string',
  STT: 'string',

}