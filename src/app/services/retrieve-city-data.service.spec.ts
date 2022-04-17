import { TestBed } from '@angular/core/testing';

import { RetrieveCityDataService } from './retrieve-city-data.service';

describe('RetrieveCityDataService', () => {
  let service: RetrieveCityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveCityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
