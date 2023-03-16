import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from 'src/app/app.config';

import { DvrService } from './dvr.service';

describe('DvrService', () => {
	let service: DvrService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
				}
			]});
		service = TestBed.inject(DvrService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
