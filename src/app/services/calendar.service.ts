import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  constructor() { }

  getDaysOfMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  };

  getWeekday(year: number, month: number, date: number) {
    console.log(year, month, date);
    let wkDay = new Date(year, month - 1, date).getDay();
    // let wkDay = new Date(year + '-' + month + '-' + date).getDay();
    console.log(wkDay);
    return wkDay;
  }

  getWeeksDaysOfMonth(Year: number, Month: number) {
    let WEEKS = [];
    let days = this.getDaysOfMonth(Month, Year);
    console.log(days);

    let weekday = this.getWeekday(Year, Month, 1);
    console.log('weekday', weekday);
    let Days = new Array(35);
    for (let index = 0; index < days; index++) {
      let _Date = (index + 1).toString();
      let _Month = Month < 10 ? '0' + Month.toString() : Month.toString();
      let _DateId = Year.toString() + _Month + _Date;
      Days[index + weekday] = {
        Date: _Date,
        DateId: _DateId,
        Data: {
          number: Math.floor(Math.random() * 4) + 0
        }
      };
    }
    console.log(Days);
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
}
