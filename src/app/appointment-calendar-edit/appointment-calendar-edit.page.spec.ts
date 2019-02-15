import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCalendarEditPage } from './appointment-calendar-edit.page';

describe('AppointmentCalendarEditPage', () => {
  let component: AppointmentCalendarEditPage;
  let fixture: ComponentFixture<AppointmentCalendarEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentCalendarEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentCalendarEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
