import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DvrService } from 'src/app/api/dvr/dvr.service';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';

@Component({
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})
export class EntryDialog {
	public entry: GridEntry;
	public json = false;

	constructor(
		private dvrService: DvrService,
		@Inject(MAT_DIALOG_DATA) public data: { entry: GridEntry }
	) {
		this.entry = data.entry;
	}

	public pendingAPI = false;
	public async record(event_id: number) {
		this.pendingAPI = true;
		this.dvrService.createByEvent({ event_id, config_uuid: "" }).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
	}
}

@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})
export class EntryComponent {
	@Input() public entry!: GridEntry;
	public json = false;

	constructor(
		private dvrService: DvrService
	) { }
	
	public pendingAPI = false;
	public async record(event_id: number) {
		this.pendingAPI = true;
		this.dvrService.createByEvent({ event_id, config_uuid: "" }).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
	}
}

