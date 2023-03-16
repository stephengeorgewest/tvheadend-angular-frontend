import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from 'src/app/app.config';

import { InputsService } from './inputs.service';

describe('InputsService', () => {
	let service: InputsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
				}
			]});
		service = TestBed.inject(InputsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
