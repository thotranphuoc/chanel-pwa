import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  getDaysOfMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  };

  getWeekday(year: number, month: number, date: number) {
    return new Date(year + '-' + month + '-' + date).getDay();
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
          number: Math.floor(Math.random() * 3) + 1
        }
      };
    }
    console.log(Days);
    let M1 = Days.slice(0, 7);
    let M2 = Days.slice(7, 14);
    let M3 = Days.slice(14, 21);
    let M4 = Days.slice(21, 28);
    let M5 = Days.slice(28, 35);

    console.log(M1, M2, M3, M4, M5);
    WEEKS.push(M1, M2, M3, M4, M5);
    console.log(WEEKS);
    return WEEKS
  }
}
