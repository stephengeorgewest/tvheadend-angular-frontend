import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { APP_CONFIG } from 'src/app/app.config';

import { ConfirmDropDialog } from './confirm-drop.dialog';

describe('ConfirmDropComponent', () => {
	let component: ConfirmDropDialog;
	let fixture: ComponentFixture<ConfirmDropDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatProgressSpinnerModule],
			declarations: [ConfirmDropDialog],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: []
				}, {
					provide: MatDialogRef, useValue: { close: (dialogResult: any) => { } }
				}, {
					provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
				}
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDropDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
