import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from 'src/app/app.config';

import { ConnectionsService } from './connections.service';

describe('ConnectionsService', () => {
	let service: ConnectionsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}}]
		});
		service = TestBed.inject(ConnectionsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
