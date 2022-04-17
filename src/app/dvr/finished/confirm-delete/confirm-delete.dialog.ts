import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { RemoveBydvrUUIDRequest } from 'src/app/api/dvr/entry/remove/requestmodel';
import { fetchData } from 'src/app/api/util';

@Component({
	selector: 'app-confirm-delete',
	templateUrl: './confirm-delete.dialog.html',
	styleUrls: ['./confirm-delete.dialog.css']
})
export class ConfirmDeleteDialog {
	public deleting = false;
	constructor(
		@Inject(MAT_DIALOG_DATA) public entries: Array<GridUpcomingEntry>,
		public dialogref: MatDialogRef<ConfirmDeleteDialog>
	) { }

	public confirm() {
		this.deleting=true;
		const requets: RemoveBydvrUUIDRequest = { uuid: this.entries.map(e => e.uuid) };
		fetchData('dvr/entry/remove', requets).then(() => this.dialogref.close());
	}
}

