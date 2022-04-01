import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

import { EpgComponent } from './epg.component';
import { GridEntry } from '../api/epg/events/grid/responsemodel';

@Component({
	selector: 'app-title-list',
	template: ''
  })
  class MockTitleListComponent {
	  @Input() public filteredEntries: Map<string, GridEntry[]> = new Map;
	  @Output() public selectedEntry: EventEmitter<GridEntry[]> = new EventEmitter();
  }

  @Component({
	selector: 'app-entry-list',
	template: ''
  })
  class MockEntryListComponent {
	  @Input() public selectedEntry: GridEntry[] = []
  }

  
describe('EpgComponent', () => {
	let component: EpgComponent;
	let fixture: ComponentFixture<EpgComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				MatIconModule, MatSnackBarModule,
				FormsModule, MatInputModule, MatButtonModule, NoopAnimationsModule
			],
			declarations: [EpgComponent, MockTitleListComponent, MockEntryListComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EpgComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
