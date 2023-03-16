import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from 'src/app/app.config';

import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
	let service: WebsocketService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: APP_CONFIG, useValue: {server: {host: "host", port: 1234, secure: ""}}
				}
			]});
		service = TestBed.inject(WebsocketService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
