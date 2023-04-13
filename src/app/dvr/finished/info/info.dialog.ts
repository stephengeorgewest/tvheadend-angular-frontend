import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';

@Component({
	selector: 'app-info',
	templateUrl: './info.dialog.html',
	styleUrls: ['./info.dialog.css']
})
export class InfoDialog {
	public deleting = false;
	constructor(
		@Inject(MAT_DIALOG_DATA) public entry: GridUpcomingEntry,
		public dialogref: MatDialogRef<InfoDialog>
	) { }
}

