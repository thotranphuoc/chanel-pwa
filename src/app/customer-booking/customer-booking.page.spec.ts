import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBookingPage } from './customer-booking.page';

describe('CustomerBookingPage', () => {
  let component: CustomerBookingPage;
  let fixture: ComponentFixture<CustomerBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
