import { TestBed } from '@angular/core/testing';

import { DiskUsageService } from './disk-usage.service';

describe('DiskUsageService', () => {
	let service: DiskUsageService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DiskUsageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
