import { TestBed } from '@angular/core/testing';

import { PersonsdbService } from './personsdb.service';

describe('PersonsdbService', () => {
  let service: PersonsdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonsdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
