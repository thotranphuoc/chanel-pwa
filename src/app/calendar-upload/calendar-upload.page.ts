import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { parse } from 'querystring';
import { CrudService } from '../services/crud.service';
import { AuthService } from '../services/auth.service';
import { iUser } from '../interfaces/user.interface';
import { LocalService } from '../services/local.service';
@Component({
  selector: 'app-calendar-upload',
  templateUrl: './calendar-upload.page.html',
  styleUrls: ['./calendar-upload.page.scss'],
})
export class CalendarUploadPage implements OnInit {
  INPUTS: iInput[] = [];
  SPICIALISTS = [
    { Name: 'Luan', ID: 'y2Xh6R878lPEatPBiKsB49MOLnF2' },
    { Name: 'Tho', ID: 'CCnyQTyRBlbmSN9EwZdT0za4wMI2' },
    { Name: 'Ngoc', ID: 'LCsL0Dc1fxO8ri6bLU12EYmM4C23' },

  ]
  USERS: any[] = [];
  constructor(
    private papa: Papa,
    private crudService: CrudService,
    private authService: AuthService,
    private localService: LocalService
  ) { }

  ngOnInit() {
  }
  parse1(files: FileList): void {
    const file: File = files.item(0);
    console.log(files);
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let csv = reader.result;
      console.log(csv);
      // this.papa.parse(String(csv), {
      //   header: true,
      //   complete: function (results) {
      //     // console.log(results);
      //     this.INPUTS = results.data;
      //     console.log(this.INPUTS);
      //     this.convertData(this.INPUTS);
      //   }
      // });
    }





  }

  parse(files: FileList) {
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
      .then((res: any) => {
        console.log(res);
        // this.convertData(res);
        // this.createUsers(res);
        // this.loginThenDeleteUSERS(res);
        this.USERS = res;
      })
      .catch(err => { console.log(err) })
  }

  loginThenDeleteUSERS(USERS: any[]) {
    USERS.forEach(USER => {
      setTimeout(() => {
        this.authService.accountLogin(USER.Email, '123456')
          .then(res => {
            let uid = res.user.uid;
            let currentUser = res.user;
            return currentUser.delete()
          })
          .then(res => {
            console.log(USER.Email, ' deleted', res)
          })
          .catch(err => {
            console.log(USER.Email, ' delete failed');
          })
      }, 2000);
    })
  }

  createUsers(USERS: any[]) {
    let PROMISES = [];
    for (let index = 0; index < USERS.length; index++) {
      const USER = USERS[index];
      setTimeout(() => {
        let p = this.createUser(USER)
        PROMISES.push(p);
      }, 5000);
    }

    Promise.all(PROMISES).then(res => {
      console.log(res);
    }).catch(err => console.log(err))

  }

  createUser(USER: any) {
    console.log(USER);
    return this.authService.accountCreate(USER.Email, '123456')
      .then((res: firebase.auth.UserCredential) => {
        console.log(USER.Email, '--> created')
        let USR: iUser = this.localService.USER_DEFAULT;
        USR.U_ID = res.user.uid
        USR.U_EMAIL = USER.Email;
        USR.U_ROLE = USER.Group;
        USR.U_NAME = this.getNickName(USER.Name);
        USR.U_FULLNAME = USER.Name;
        return this.crudService.userCreate(USR)
      })
      .then(res => {
        USER.result = 'Done';
        console.log(USER.Email + '--> Done')
      })
      .catch(err => {
        console.log(USER.Email + '--> failed', err)
      })
  }

  getNickName(FullName: string) {
    let myArray = FullName.split(' ');
    return myArray[myArray.length - 1];
  }


  convertCsv2ArrayObject() {
    // this.papa.parse(String(csv), {
    //   header: true,
    //   complete: function (results) {
    //     // console.log(results);
    //     this.INPUTS = results.data;
    //     console.log(this.INPUTS);
    //     this.convertData(this.INPUTS);
    //   }
    // });
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
        isDraff:false
      };
      Obj[_DateId] = _DAY;
      DAYS.push(_DAY);

    })
    console.log(DAYS);
    console.log(Obj);
    this.crudService.calendarMonthCreate(YYYYMM, Obj)
      .then((res) => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
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
    let ID = this.SPICIALISTS.filter(SP => SP.Name == Name)[0].ID;
    console.log(ID);
    return ID
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
