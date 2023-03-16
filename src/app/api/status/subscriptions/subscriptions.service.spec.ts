import { TestBed } from '@angular/core/testing';

import { APP_CONFIG } from 'src/app/app.config';
import { AuthenticationService } from 'src/app/authentication.service';

import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
	let service: SubscriptionsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{
					provide: AuthenticationService, useValue: {}
				},{
					provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
				}
			]}
		);
		service = TestBed.inject(SubscriptionsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
