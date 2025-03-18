import { TestBed } from '@angular/core/testing';

import { SlidePanelService } from './slide-panel.service';

describe('SlidePanelService', () => {
  let service: SlidePanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidePanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
