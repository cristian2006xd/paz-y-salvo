import { TestBed } from '@angular/core/testing';

import { Areas } from './areas';

describe('Areas', () => {
  let service: Areas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Areas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
