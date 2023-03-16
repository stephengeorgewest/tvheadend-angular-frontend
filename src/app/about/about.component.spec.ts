import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../app.config';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
	let component: AboutComponent;
	let fixture: ComponentFixture<AboutComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AboutComponent],
			providers: [
				{
					provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
				}
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AboutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
