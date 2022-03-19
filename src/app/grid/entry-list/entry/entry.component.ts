import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';

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
}

@Component({
	selector: 'app-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.css']
})
export class EntryComponent {
	@Input() public entry: GridEntry = example.entries[0];
	public json = false;
}

