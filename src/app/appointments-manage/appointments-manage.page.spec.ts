import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsManagePage } from './appointments-manage.page';

describe('AppointmentsManagePage', () => {
  let component: AppointmentsManagePage;
  let fixture: ComponentFixture<AppointmentsManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsManagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
