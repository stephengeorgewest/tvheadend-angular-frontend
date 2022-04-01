import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NewDatePipe } from 'src/app/date-from-unix-date.pipe';

import { UpcomingEntryListComponent } from './upcoming-entry-list.component';

describe('UpcomingEntryListComponent', () => {
	let component: UpcomingEntryListComponent;
	let fixture: ComponentFixture<UpcomingEntryListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatIconModule, MatListModule, MatDividerModule],
			declarations: [UpcomingEntryListComponent, NewDatePipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UpcomingEntryListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
