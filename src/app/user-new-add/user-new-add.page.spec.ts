import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewAddPage } from './user-new-add.page';

describe('UserNewAddPage', () => {
  let component: UserNewAddPage;
  let fixture: ComponentFixture<UserNewAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNewAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNewAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
