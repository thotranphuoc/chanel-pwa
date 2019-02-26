import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { iDay } from '../interfaces/day.interface';
import { iSlot } from '../interfaces/slot.interface';
import { parse } from 'querystring';
import { CrudService } from '../services/crud.service';
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
  constructor(
    private papa: Papa,
    private crudService: CrudService
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
        this.convertData(res);
      })
      .catch(err => { console.log(err) })
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
      let SLOT3 = this.getSpecialistOfSlot(item._15h30, '15:30');
      let SLOT4 = this.getSpecialistOfSlot(item._17h30, '17:30');
      let _Slots: iSlot[] = [SLOT1, SLOT2, SLOT3, SLOT4];
      let _DAY: iDay = {
        Date: _Date,
        DateId: _DateId,
        Slots: _Slots,
        date: _date,
        isThePast: false
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
  _15h30: 'string',
  _17h30: 'string',
  NAM: 'string',
  THANG: 'string',
  NGAY: 'string',
  STT: 'string',

}
