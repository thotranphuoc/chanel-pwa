import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddPage } from './customer-add.page';

describe('CustomerAddPage', () => {
  let component: CustomerAddPage;
  let fixture: ComponentFixture<CustomerAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
