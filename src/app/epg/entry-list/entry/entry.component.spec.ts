import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDatePipe } from 'src/app/date-from-unix-date.pipe';

import { EntryComponent } from './entry.component';

describe('EntryComponent', () => {
	let component: EntryComponent;
	let fixture: ComponentFixture<EntryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EntryComponent, NewDatePipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EntryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
