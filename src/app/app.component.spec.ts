import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from './api/ws/websocket.service';

import { AppComponent } from './app.component';
import { APP_CONFIG } from './app.config';

@Component({
	selector: 'app-navigation',
	template: '',
})
export class MockNavigationComponent {
	@Input() public type: "button" | "list" = "list";
	@Output() public menuClicked: EventEmitter<void> = new EventEmitter();
}

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				{provide: WebsocketService, useValue: {}}
			],
			imports: [
				RouterTestingModule, MatSidenavModule, NoopAnimationsModule
			],
			declarations: [
				AppComponent, MockNavigationComponent
			],
		}).compileComponents();TestBed.configureTestingModule({});
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
