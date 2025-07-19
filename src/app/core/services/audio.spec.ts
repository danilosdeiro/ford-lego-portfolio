import { TestBed } from '@angular/core/testing';

import { Audio } from './audio';

describe('Audio', () => {
  let service: Audio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Audio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
