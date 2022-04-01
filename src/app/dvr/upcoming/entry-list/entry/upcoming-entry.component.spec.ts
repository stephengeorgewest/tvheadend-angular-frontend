import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

import { DvrUpcomingEntryComponent } from './upcoming-entry.component';
import { NewDatePipe } from 'src/app/date-from-unix-date.pipe';

describe('DvrUpcomingEntryComponent', () => {
	let component: DvrUpcomingEntryComponent;
	let fixture: ComponentFixture<DvrUpcomingEntryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: {} },
				{ provide: MatDialogRef, useValue: {} }
			],
			declarations: [DvrUpcomingEntryComponent, NewDatePipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DvrUpcomingEntryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
