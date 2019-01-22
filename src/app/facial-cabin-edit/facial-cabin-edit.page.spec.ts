import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacialCabinEditPage } from './facial-cabin-edit.page';

describe('FacialCabinEditPage', () => {
  let component: FacialCabinEditPage;
  let fixture: ComponentFixture<FacialCabinEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacialCabinEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacialCabinEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
