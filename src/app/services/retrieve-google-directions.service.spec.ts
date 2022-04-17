import { TestBed } from '@angular/core/testing';

import { RetrieveGoogleDirectionsService } from './retrieve-google-directions.service';

describe('RetrieveGoogleDirectionsService', () => {
  let service: RetrieveGoogleDirectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveGoogleDirectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
