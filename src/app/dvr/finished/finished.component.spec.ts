import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DurationPipe, FileSizePipe, FinishedComponent, SortListDirectionPipe, SortListPositionPipe } from './finished.component';


describe('FinishedComponent', () => {
	let component: FinishedComponent;
	let fixture: ComponentFixture<FinishedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule, FormsModule, MatInputModule, MatOptionModule, MatSelectModule, NoopAnimationsModule],
			declarations: [FinishedComponent, FileSizePipe, DurationPipe, SortListDirectionPipe, SortListPositionPipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FinishedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
