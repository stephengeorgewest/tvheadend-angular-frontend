import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConnectionsService } from 'src/app/api/status/connections/connections.service';
import { Connection } from 'src/app/api/status/connections/responsemodel';
import { idTrack } from 'src/app/util';
import { ConfirmDropDialog } from './confirm-drop/confirm-drop.dialog';

@Component({
	selector: 'app-connections',
	templateUrl: './connections.component.html',
	styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit, OnDestroy {
	public connections: Connection[] = [];
	private connectionsResponseSub: Subscription | undefined;
	public idTrack = idTrack;
	constructor(
		private connectionsService: ConnectionsService,
		private dialog: MatDialog,
	) { }

	ngOnInit(): void {
		this.connectionsService.getConnections();
		this.connectionsResponseSub = this.connectionsService.onConnectionsResponse().subscribe(i => {
			if (i?.entries) this.connections = i.entries;
		});
	}
	ngOnDestroy(): void {
		this.connectionsResponseSub?.unsubscribe();
	}

	public delete(connection: Connection) {
		this.dialog.open(ConfirmDropDialog, {
			data: connection
		});
	}

	public deleteAll() {
		this.dialog.open(ConfirmDropDialog, {
			data: undefined
		});
	}

}
