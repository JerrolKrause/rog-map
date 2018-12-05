import { TestBed, inject } from '@angular/core/testing';

import { MonolithService } from './monolith.service';

describe('MonolithService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonolithService],
    });
  });

  it('should be created', inject([MonolithService], (service: MonolithService) => {
    expect(service).toBeTruthy();
  }));
});
