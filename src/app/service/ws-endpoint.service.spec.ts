import { TestBed } from '@angular/core/testing';

import { WsEndpointService } from './ws-endpoint.service';

describe('WsEndpointService', () => {
  let service: WsEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
