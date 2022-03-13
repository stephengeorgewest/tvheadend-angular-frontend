import { TestBed } from '@angular/core/testing';

import { IgnoreListService } from './ignore-list.service';

describe('IgnoreListService', () => {
  let service: IgnoreListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IgnoreListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
