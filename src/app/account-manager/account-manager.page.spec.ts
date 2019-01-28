import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerPage } from './account-manager.page';

describe('AccountManagerPage', () => {
  let component: AccountManagerPage;
  let fixture: ComponentFixture<AccountManagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountManagerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
