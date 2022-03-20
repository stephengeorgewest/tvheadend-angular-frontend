import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';

import example from "../../../../api/dvr/entry/grid_upcoming/exampleresponse.json";

@Component({
	templateUrl: './upcoming-entry.component.html',
	styleUrls: ['./upcoming-entry.component.css']
})
export class UpcomingEntryDialog {
	public entry: GridUpcomingEntry;
	public json = false;
	constructor(@Inject(MAT_DIALOG_DATA) public data: {entry: GridUpcomingEntry}) {
		this.entry = data.entry || example.entries[0];
	 }
}

@Component({
	selector: 'app-upcoming-entry',
	templateUrl: './upcoming-entry.component.html',
	styleUrls: ['./upcoming-entry.component.css']
})
export class DvrUpcomingEntryComponent {
	@Input() public entry: GridUpcomingEntry = example.entries[0];
	public json = false;
}

