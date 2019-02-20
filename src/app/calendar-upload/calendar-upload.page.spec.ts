import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarUploadPage } from './calendar-upload.page';

describe('CalendarUploadPage', () => {
  let component: CalendarUploadPage;
  let fixture: ComponentFixture<CalendarUploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarUploadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
