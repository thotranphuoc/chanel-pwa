import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarViewPage } from './calendar-view.page';

describe('CalendarViewPage', () => {
  let component: CalendarViewPage;
  let fixture: ComponentFixture<CalendarViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
