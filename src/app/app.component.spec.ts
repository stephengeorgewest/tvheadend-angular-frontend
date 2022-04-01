import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

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
			imports: [
				RouterTestingModule, MatSidenavModule, NoopAnimationsModule
			],
			declarations: [
				AppComponent, MockNavigationComponent
			],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
