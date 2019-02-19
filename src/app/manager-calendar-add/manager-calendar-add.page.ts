import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { AppService } from '../services/app.service';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-manager-calendar-add',
  templateUrl: './manager-calendar-add.page.html',
  styleUrls: ['./manager-calendar-add.page.scss'],
})
export class ManagerCalendarAddPage implements OnInit {

  constructor(
    private crudService: CrudService,
    private appService: AppService,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
  }

  monthCreate(selectedMonth: string) {
    console.log(selectedMonth);
    let YYYYMM = selectedMonth.replace('-', '');
    let MM = YYYYMM.substr(4, 2);
    let YYYY = YYYYMM.substr(0, 4);
    console.log(YYYYMM);
    let sub = this.crudService.calendarMonthGet(MM, YYYY)
  
      .subscribe(res => {
        console.log(res);
        sub.unsubscribe();
        if (typeof (res) !== 'undefined') {
          this.appService.alertConfirmationShow('Notice', 'Data for this month is already existing');
          return;
        } else {
          this.calendarService.calendarForMonthCreate(Number(YYYY), Number(MM))
            .then((res) => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            })
        }
      })
     

  }
}
