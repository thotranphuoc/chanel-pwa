import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Timeouts } from 'selenium-webdriver';
import { CrudService } from './crud.service';
import { iSlot } from '../interfaces/slot.interface';
import { iDay } from '../interfaces/day.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  constructor(
    private crudService: CrudService
  ) { }

  // return number of day in certain month
  getNumOfDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  };

  // Sunday = 0, Monday = 1 ...
  getWeekday(year: number, month: number, date: number) {
    console.log(year, month, date);
    let wkDay = new Date(year, month - 1, date).getDay();
    console.log(wkDay);
    return wkDay;
  }

  getWeeksDaysOfMonthx(Year: number, Month: number) {
    let WEEKS = [];
    let days = this.getNumOfDaysInMonth(Month, Year);
    let _Month = Month < 10 ? '0' + Month.toString() : Month.toString();
    let MONTH = {};
    console.log(days);

    let weekday = this.getWeekday(Year, Month, 1);
    console.log('weekday', weekday);
    let Days = new Array(35);
    for (let index = 0; index < days; index++) {
      let _Date = (index + 1).toString();
      let _DateId = Year.toString() + _Month + _Date;
      let DataOfDay = {
        Date: _Date,
        DateId: _DateId,
        // Data: {
        //   number: Math.floor(Math.random() * 4) + 0
        // }
        Slots: this.createSlots(4)
      };
      Days[index + weekday] = DataOfDay;
      MONTH[_DateId] = DataOfDay;
    }
    console.log(Days, MONTH);
    let MONTHSTRING = Year.toString() + _Month.toString();
    this.crudService.calendarMonthCreate(MONTHSTRING, MONTH)
      .then(res => console.log(res)).catch(err => console.log(err));
    Days.forEach(day => {
      let n = day.Slots.filter(slot => slot.STATUS == 'AVAILABLE').length;
      day['n'] = n;
    })
    let W1 = Days.slice(0, 7);
    let W2 = Days.slice(7, 14);
    let W3 = Days.slice(14, 21);
    let W4 = Days.slice(21, 28);
    let W5 = Days.slice(28, 35);

    console.log(W1, W2, W3, W4, W5);
    WEEKS.push(W1, W2, W3, W4, W5);
    console.log(WEEKS);
    return {
      WEEKS: WEEKS,
      MONTH: this.MONTHS[Month - 1],
      YEAR: Year
    }
  }

  create35DaysOfMonth(YYYYMM: string) {
    let Year = Number(YYYYMM.substr(0, 4));
    let Month = Number(YYYYMM.substr(4, 2));
    let Days = new Array(42);
    let weekday = this.getWeekday(Year, Month, 1);
    let days = this.getNumOfDaysInMonth(Month, Year);
    let _Month = Month < 10 ? '0' + Month.toString() : Month.toString();
    for (let index = 0; index < days; index++) {
      let _Date = (index + 1).toString();
      let _finalDate = _Date.length > 1 ? _Date : '0' + _Date;
      let _DateId = Year.toString() + _Month + _finalDate;
      Days[index + weekday] = {
        Date: _Date,
        DateId: _DateId
      };
    }
    return Days;
  }


  private createDataObjectForMonth(Year: number, Month: number) {
    let MONTH = {};
    let days = this.getNumOfDaysInMonth(Month, Year);
    console.log(days);
    let _Month = Month < 10 ? '0' + Month.toString() : Month.toString();
    for (let index = 0; index < days; index++) {
      let _Date = (index + 1).toString();
      let _finalDate = (index + 1) < 10 ? '0' + (index + 1).toString() : (index + 1).toString();
      let _DateId = Year.toString() + _Month + _finalDate;
      let DataOfDay = {
        Date: _Date,
        DateId: _DateId,
        // Data: {
        //   number: Math.floor(Math.random() * 4) + 0
        // }
        Slots: this.createSlots(4)
      };
      // Days[index + weekday] = DataOfDay;
      MONTH[_DateId] = DataOfDay;
    }
    return MONTH;
  }

  addAdditionalProsIntoDaysInMonth(days: any[]) {
    // let date_to_parse = new Date();
    // let year = date_to_parse.getFullYear().toString();
    // let month = (date_to_parse.getMonth() + 1).toString();
    // let day = date_to_parse.getDate().toString();
    // let TODAY = year + (month.length > 2 ? month : '0' + month) + day;
    let TODAY = this.getTodayString()
    let newDays = [];
    days.forEach(day => {
      if (day !== ('undefined' || null || '')) {
        let Month = day.DateId.substr(4, 2)
        let date = day.DateId.substr(6, day.DateId.length - 6);
        let finalDate = date.length > 1 ? date : '0' + date;
        day['date'] = Month + '/' + finalDate;
        let isThePast = Number(TODAY) > Number(day.DateId);
        day['isThePast'] = isThePast;
        newDays.push(day);
      }
    })
    return newDays;
  }

  calendarForMonthCreate(Year: number, Month: number) {
    let MonthObject = this.createDataObjectForMonth(Year, Month);
    let Monthstr = Month < 10 ? '0' + Month.toString() : Month.toString();
    let YYYYMM = Year.toString() + Monthstr;
    console.log(MonthObject);
    return this.crudService.calendarMonthCreate(YYYYMM, MonthObject);
  }

  private createSlots(numberOfSlot: number) {
    let timeSlots = ['10:30', '12:30', '15:00', '17:00', 'over'];
    let Slots = []
    for (let index = 0; index < numberOfSlot; index++) {
      let SLOT: iSlot = {
        SLOT: timeSlots[index],
        // BOOKED: Math.random() > 0.5 ? true : false,
        BOOK_ID: '',
        // STATUS: this.getStatus(),
        STATUS: 'AVAILABLE',
        BAB_ID: '',
        BAB_NAME: '',
        BAS_ID: '',
        BAS_NAME: '',
        MAN_ID: '',
        MAN_NAME: '',
        SPE_ID: '',
        SPE_NAME: ''
      }
      Slots.push(SLOT);
    }
    return Slots;
  }

  // createSlotsx(numberOfSlot: number){
  //   let Slots = {};
  //   for (let index = 0; index < numberOfSlot; index++) {
  //     let slotstr = 'slot'+index.toString();
  //     let data = {
  //       slot+`$index` 
  //     }
  //     Object.assign(Slots,)

  //   }
  // }

  getStatus() {
    let STATES = ['AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELED', 'EXPIRED'];
    let n = Math.floor(Math.random() * 5) + 0 // 0-4
    return STATES[n];
  }

  getNumberOfReservedSlot(Day: iDay) {
    let n = Day.Slots.filter(d => d.STATUS !== 'AVAILABLE').length;
    return n;
  }

  getTodayString() {
    let date_to_parse = new Date();
    let year = date_to_parse.getFullYear().toString();
    let month = (date_to_parse.getMonth() + 1).toString();
    let finalMonth = month.length > 2 ? month : '0' + month
    let day = date_to_parse.getDate().toString();
    let finalDay = day.length < 2 ? '0' + day : day;
    let TODAY = year + finalMonth + finalDay;
    console.log(TODAY);
    return TODAY;
  }

  getToMonthString(Choose_Month:string) {
    let date_to_parse = new Date();
    console.log(date_to_parse);
    if(Choose_Month.length>0)
    {
      console.log(Choose_Month);
      //date_to_parse = new Date();
    }
    else
    { 
      date_to_parse = new Date();
    }
      
    let year = date_to_parse.getFullYear().toString();
    let month = (date_to_parse.getMonth() + 1).toString();
    let finalMonth = month.length > 2 ? month : '0' + month
    let day = date_to_parse.getDate().toString();
    let finalDay = day.length < 2 ? '0' + day : day;
    let TODAY = year + finalMonth + finalDay;
    console.log(TODAY);
    return TODAY;
  }

  getNextMonth(current: string) {
    let yearStr = current.substr(0, 4);
    let year = Number(yearStr);
    let month = Number(current.substr(4, 2));
    let next = month + 1;
    if (next < 13) {
      let finalMonth = next > 10 ? next.toString() : '0' + next.toString();
    } else {
      let finalMonth = '01';
      yearStr = (year + 1).toString();
    }
    let finalMonth = next > 10 ? next.toString() : '0' + next.toString();
    return yearStr + finalMonth;
  }

  // convert from 2019-10-12 to 12/10/2019
  convertDate(YYYYMMDD: string) {
    let year = YYYYMMDD.substr(0, 4);
    let month = YYYYMMDD.substr(5, 2);
    let date = YYYYMMDD.substr(8, 2);
    return date + '/' + month + '/' + year;
  }





}
