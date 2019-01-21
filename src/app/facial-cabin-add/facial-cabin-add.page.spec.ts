import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacialCabinAddPage } from './facial-cabin-add.page';

describe('FacialCabinAddPage', () => {
  let component: FacialCabinAddPage;
  let fixture: ComponentFixture<FacialCabinAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacialCabinAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacialCabinAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
