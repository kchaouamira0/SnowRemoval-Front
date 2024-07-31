import { TestBed } from '@angular/core/testing';

import { VehicleSelectionService } from './vehicle-selection.service';

describe('VehicleSelectionService', () => {
  let service: VehicleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
