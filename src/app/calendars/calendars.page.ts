import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendars',
  templateUrl: './calendars.page.html',
  styleUrls: ['./calendars.page.scss'],
})
export class CalendarsPage implements OnInit {
  WEEKS1 = [];
  WEEKS2 = [];
  segment = 'list';
  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.doCalendar();
  }

  doCalendar() {
    this.WEEKS1 = this.calendarService.getWeeksDaysOfMonth(2019, 1);
    this.WEEKS2 = this.calendarService.getWeeksDaysOfMonth(2019, 2);
  }

  segmentChanged(ev: CustomEvent) {
    console.log(ev);
    this.segment = ev.detail.value;
    console.log(this.segment);
  }

}
