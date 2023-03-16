import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from 'src/app/app.config';

import { EpgService } from './epg.service';

describe('EpgService', () => {
	let service: EpgService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{
				provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
			}]
		});
		service = TestBed.inject(EpgService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
