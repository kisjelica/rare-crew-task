import { TestBed } from '@angular/core/testing';

import { EmployeeWorkTimeService } from './employee-work-time.service';

describe('EmployeeWorkTimeService', () => {
  let service: EmployeeWorkTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeWorkTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
