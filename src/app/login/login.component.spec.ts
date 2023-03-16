import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WebsocketService } from '../api/ws/websocket.service';
import { APP_CONFIG } from '../app.config';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, NoopAnimationsModule],
			declarations: [LoginComponent],
			providers: [{
				provide: WebsocketService, useValue: {}
			},{
				provide: MatSnackBarRef<LoginComponent>, useValue: {
				dismissWithAction: () => {},
				dismiss: () => {}
			}},{
				provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
			}]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
