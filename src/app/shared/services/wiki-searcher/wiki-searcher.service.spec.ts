import { TestBed } from '@angular/core/testing';

import { WikiSearcherService } from './wiki-searcher.service';

describe('WikiSearcherService', () => {
  let service: WikiSearcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikiSearcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
