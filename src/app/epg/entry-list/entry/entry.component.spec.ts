import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NewDatePipe } from 'src/app/date-from-unix-date.pipe';

import { EntryComponent } from './entry.component';

describe('EntryComponent', () => {
	let component: EntryComponent;
	let fixture: ComponentFixture<EntryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule],
			declarations: [EntryComponent, NewDatePipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EntryComponent);
		component = fixture.componentInstance;
		component.entry = {
			start: 0,
			stop: 1,
			eventId: 12,
		
			//api_epg_add_channel
			channelName: "string",
			channelUuid: "string",

		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
