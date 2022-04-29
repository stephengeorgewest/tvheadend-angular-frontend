import { TestBed } from '@angular/core/testing';

import { EpgService } from './epg.service';

describe('EpgService', () => {
	let service: EpgService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(EpgService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
