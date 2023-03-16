import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NEVER } from 'rxjs';
import { InputsService } from 'src/app/api/status/inputs/inputs.service';

import { InputComponent } from './input.component';

const InputsServiceStub: Partial<InputsService> = {
	onInputResponse:() => NEVER,
	getInputs: () => {}
}

describe('InputComponent', () => {
	let component: InputComponent;
	let fixture: ComponentFixture<InputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [{provide: InputsService, useValue: InputsServiceStub}],
			imports: [MatIconModule, MatMenuModule],
			declarations: [InputComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
