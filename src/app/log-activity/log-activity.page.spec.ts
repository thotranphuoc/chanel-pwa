import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogActivityPage } from './log-activity.page';

describe('LogActivityPage', () => {
  let component: LogActivityPage;
  let fixture: ComponentFixture<LogActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
