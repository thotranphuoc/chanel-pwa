import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAssignPage } from './slot-assign.page';

describe('SlotAssignPage', () => {
  let component: SlotAssignPage;
  let fixture: ComponentFixture<SlotAssignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotAssignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
