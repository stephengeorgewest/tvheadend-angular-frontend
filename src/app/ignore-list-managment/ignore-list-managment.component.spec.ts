import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IgnoreListManagmentComponent } from './ignore-list-managment.component';

describe('IgnoreListManagmentComponent', () => {
	let component: IgnoreListManagmentComponent;
	let fixture: ComponentFixture<IgnoreListManagmentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[MatExpansionModule, NoopAnimationsModule],
			declarations: [IgnoreListManagmentComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(IgnoreListManagmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
