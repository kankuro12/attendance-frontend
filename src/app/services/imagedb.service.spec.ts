import { TestBed } from '@angular/core/testing';

import { ImagedbService } from './imagedb.service';

describe('ImagedbService', () => {
  let service: ImagedbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagedbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
