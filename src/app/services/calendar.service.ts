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

  getWeeksDaysOfMonth(Year: number, Month: number) {
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

  create35DaysOfMonth(Year: number, Month: number, ) {
    let Days = new Array(35);
    let weekday = this.getWeekday(Year, Month, 1);
    let days = this.getNumOfDaysInMonth(Month, Year);
    let _Month = Month < 10 ? '0' + Month.toString() : Month.toString();
    for (let index = 0; index < days; index++) {
      let _Date = (index + 1).toString();
      let _DateId = Year.toString() + _Month + _Date;
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
      let _DateId = Year.toString() + _Month + _Date;
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

  calendarForMonthCreate(Year: number, Month: number) {
    let MonthObject = this.createDataObjectForMonth(Year, Month);
    let Monthstr = Month < 10 ? '0' + Month.toString() : Month.toString();
    let YYYYMM = Year.toString() + Monthstr;
    console.log(MonthObject);
    return this.crudService.calendarMonthCreate(YYYYMM, MonthObject);
  }

  private createSlots(numberOfSlot: number) {
    let timeSlots = ['10:30', '12:30', '15:30', '17:00', 'over'];
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
        BAS_NAME: ''
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
    let n = Day.Slots.filter(d => d.STATUS !=='AVAILABLE').length;
    return n;
  }
}
