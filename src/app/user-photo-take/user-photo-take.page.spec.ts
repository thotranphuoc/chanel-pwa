import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPhotoTakePage } from './user-photo-take.page';

describe('UserPhotoTakePage', () => {
  let component: UserPhotoTakePage;
  let fixture: ComponentFixture<UserPhotoTakePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPhotoTakePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPhotoTakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
