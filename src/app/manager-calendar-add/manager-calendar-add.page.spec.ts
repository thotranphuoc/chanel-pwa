import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCalendarAddPage } from './manager-calendar-add.page';

describe('ManagerCalendarAddPage', () => {
  let component: ManagerCalendarAddPage;
  let fixture: ComponentFixture<ManagerCalendarAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerCalendarAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCalendarAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
