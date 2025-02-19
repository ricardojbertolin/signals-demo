import { TestBed } from '@angular/core/testing';

import { JunctionControllerService } from './junction-controller.service';

describe('JunctionControllerService', () => {
  let service: JunctionControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JunctionControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
