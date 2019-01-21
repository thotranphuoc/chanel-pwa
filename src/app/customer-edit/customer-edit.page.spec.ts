import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEditPage } from './customer-edit.page';

describe('CustomerEditPage', () => {
  let component: CustomerEditPage;
  let fixture: ComponentFixture<CustomerEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
