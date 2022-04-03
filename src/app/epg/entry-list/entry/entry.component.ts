import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { createByEvent, fetchData } from 'src/app/api/util';

import example from "../../../api/epg/events/grid/exampleresponse.json";

@Component({
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})
export class EntryDialog {
	public entry: GridEntry;
	public json = false;
	constructor(@Inject(MAT_DIALOG_DATA) public data: {entry: GridEntry}) {
		this.entry = data.entry || example.entries[0];
	}
	public pendingAPI = false;
	public async record(event_id: number){
		this.pendingAPI = true;
		createByEvent({event_id, config_uuid: ""}).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
	}
}

@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})
export class EntryComponent {
	constructor(){}
	@Input() public entry: GridEntry = example.entries[0];
	public json = false;
	public pendingAPI = false;
	public async record(event_id: number){
		this.pendingAPI = true;
		createByEvent({event_id, config_uuid: ""}).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
	}
}

