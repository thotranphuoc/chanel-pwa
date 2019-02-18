import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoTakePage } from './photo-take.page';

describe('PhotoTakePage', () => {
  let component: PhotoTakePage;
  let fixture: ComponentFixture<PhotoTakePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoTakePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoTakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
