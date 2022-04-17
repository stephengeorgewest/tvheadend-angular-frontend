import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FileSizePipe } from 'src/app/file-size.pipe';

import { DurationPipe, FinishedComponent, SortListDirectionPipe, SortListPositionPipe,InDisplayedColumnsPipe } from './finished.component';


describe('FinishedComponent', () => {
	let component: FinishedComponent;
	let fixture: ComponentFixture<FinishedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatCheckboxModule, MatDialogModule, MatIconModule, FormsModule, MatInputModule, MatMenuModule, MatOptionModule, MatSelectModule, NoopAnimationsModule],
			declarations: [FinishedComponent, FileSizePipe, DurationPipe, SortListDirectionPipe, SortListPositionPipe, InDisplayedColumnsPipe]
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
