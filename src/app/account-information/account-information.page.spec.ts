import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInformationPage } from './account-information.page';

describe('AccountInformationPage', () => {
  let component: AccountInformationPage;
  let fixture: ComponentFixture<AccountInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
