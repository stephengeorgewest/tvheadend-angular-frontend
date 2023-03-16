import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { DvrService } from 'src/app/api/dvr/dvr.service';

import { ConfirmDvrStopDialog } from './confirm-stop.dialog';

let DvrServiceStub: Partial<DvrService> = {
	createByEvent:() => Promise.resolve(),
	stopByGridEntry:() => Promise.resolve(),
	onGridUpcomingResponse: () => of(undefined),
	stopBydvrUUID:() => Promise.resolve(),
	refreshGridUpcoming:() => {},
	deleteIdNode:() => Promise.resolve(),
	onGridFinishedResponse: () => of(undefined),
	refreshGridFinished:() => Promise.resolve(),
	clearFromServiceByUUID:() => {},
};

describe('ConfirmDvrStopDialog', () => {
	let component: ConfirmDvrStopDialog;
	let fixture: ComponentFixture<ConfirmDvrStopDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatProgressSpinnerModule],
			declarations: [ConfirmDvrStopDialog],
			providers: [{
					provide: DvrService, useValue: DvrServiceStub
				},
				{
					provide: MAT_DIALOG_DATA,
					useValue: []
				}, {
					provide: MatDialogRef, useValue: { close: (dialogResult: any) => { } }
				}
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDvrStopDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
