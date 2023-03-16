import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { of } from 'rxjs';

import { UpcomingComponent } from './upcoming.component';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { MatDialogModule } from '@angular/material/dialog';
import { DvrService } from 'src/app/api/dvr/dvr.service';

@Component({
	selector: 'app-upcoming-entry-list ',
	template: ''
})
class UpcomingEntryListComponentStub {
	@Input() public selectedEntry: GridUpcomingEntry[] = [];
}

const DvrServiceStub: Partial<DvrService> = {
	onGridUpcomingResponse: ()=> of(undefined),
	onGridUpdateResponse: ()=> of({entries:[]}),
	refreshGridUpcoming: ()=>{}
}

describe('UpcomingComponent', () => {
	let component: UpcomingComponent;
	let fixture: ComponentFixture<UpcomingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [{provide: DvrService, useValue: DvrServiceStub}],
			imports: [MatDialogModule, MatIconModule, MatListModule],
			declarations: [UpcomingComponent, UpcomingEntryListComponentStub]
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
