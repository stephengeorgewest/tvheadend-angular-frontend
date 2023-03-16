import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NEVER } from 'rxjs';
import { ConnectionsService } from 'src/app/api/status/connections/connections.service';

import { ConnectionsComponent } from './connections.component';

const ConnectionsServiceStub: Partial<ConnectionsService> = {
	onConnectionsResponse: () => NEVER,
	getConnections:() => {}
};

describe('ConnectionsComponent', () => {
	let component: ConnectionsComponent;
	let fixture: ComponentFixture<ConnectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, MatIconModule],
			declarations: [ConnectionsComponent],
			providers: [{provide: ConnectionsService, useValue: ConnectionsServiceStub}]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConnectionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
