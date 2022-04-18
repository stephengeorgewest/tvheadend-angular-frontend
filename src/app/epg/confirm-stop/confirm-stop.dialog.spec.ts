import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewDatePipe } from 'src/app/date-from-unix-date.pipe';

import { ConfirmStopDialog } from './confirm-stop.dialog';

describe('ConfirmStopDialog', () => {
	let component: ConfirmStopDialog;
	let fixture: ComponentFixture<ConfirmStopDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatProgressSpinnerModule],
			declarations: [ConfirmStopDialog, NewDatePipe],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {start: 0, stop: 1}
				}, {
					provide: MatDialogRef, useValue: { close: (dialogResult: any) => { } }
				}
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmStopDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
