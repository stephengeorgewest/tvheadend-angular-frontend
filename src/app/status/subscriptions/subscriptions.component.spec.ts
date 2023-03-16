import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SubscriptionsService } from 'src/app/api/status/subscriptions/subscriptions.service';
import { SubscriptionsComponent } from './subscriptions.component';

const SubscriptionsServiceStub: Partial<SubscriptionsService> = {
	onSubscriptionsResponse: () => of(undefined),
	getSubscriptions:() => {},
	refreshIfLoaded:() => {},
	update:() => {},
};

describe('SubscriptionsComponent', () => {
	let component: SubscriptionsComponent;
	let fixture: ComponentFixture<SubscriptionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SubscriptionsComponent ],
			providers: [{provide: SubscriptionsService, useValue: SubscriptionsServiceStub}]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubscriptionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
