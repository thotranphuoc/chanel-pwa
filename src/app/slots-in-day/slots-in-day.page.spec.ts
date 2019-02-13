import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsInDayPage } from './slots-in-day.page';

describe('SlotsInDayPage', () => {
  let component: SlotsInDayPage;
  let fixture: ComponentFixture<SlotsInDayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotsInDayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsInDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
