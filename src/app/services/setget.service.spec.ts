import { TestBed } from '@angular/core/testing';

import { SetgetService } from './setget.service';

describe('SetgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetgetService = TestBed.get(SetgetService);
    expect(service).toBeTruthy();
  });
});
