import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { APP_CONFIG } from 'src/app/app.config';
import { InfoDialog } from './info.dialog';


describe('InfoDialog', () => {
	let component: InfoDialog;
	let fixture: ComponentFixture<InfoDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatProgressSpinnerModule],
			declarations: [InfoDialog],
			providers: [
				{
					provide: APP_CONFIG, useValue: {server: {host: "", port: 0, secure: ""}}
				},
				{
					provide: MAT_DIALOG_DATA,
					useValue: {}
				}, {
					provide: MatDialogRef, useValue: { close: (dialogResult: any) => { } }
				}
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
