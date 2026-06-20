import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { StaticData } from './static-data';

describe('StaticData', () => {
  let service: StaticData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    service = TestBed.inject(StaticData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
