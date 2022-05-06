import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Connection } from 'src/app/api/status/connections/responsemodel';
import { fetchData } from 'src/app/api/util';
type CancelConnectionRequest = {id: number | "all"};
@Component({
	selector: 'app-confirm-drop',
	templateUrl: './confirm-drop.dialog.html',
	styleUrls: ['./confirm-drop.dialog.css']
})
export class ConfirmDropDialog {
	public deleting = false;
	constructor(
		@Inject(MAT_DIALOG_DATA) public connection : Connection | undefined,
		public dialogref: MatDialogRef<ConfirmDropDialog>
	) { }

	public confirm() {
		this.deleting=true;
		const request: CancelConnectionRequest = { id: this.connection ? this.connection.id  : "all"};
		fetchData('api/connections/cancel', request).then(() => this.dialogref.close());
	}
}

