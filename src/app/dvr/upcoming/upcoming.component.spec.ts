import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { UpcomingComponent } from './upcoming.component';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
	selector: 'app-upcoming-entry-list ',
	template: ''
})
class MockUpcomingEntryListComponent {
	@Input() public selectedEntry: GridUpcomingEntry[] = [];
}

describe('UpcomingComponent', () => {
	let component: UpcomingComponent;
	let fixture: ComponentFixture<UpcomingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatIconModule, MatListModule],
			declarations: [UpcomingComponent, MockUpcomingEntryListComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UpcomingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
