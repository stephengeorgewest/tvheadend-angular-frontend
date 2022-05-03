import { TestBed } from '@angular/core/testing';

import { InputsService } from './inputs.service';

describe('InputsService', () => {
	let service: InputsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(InputsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
