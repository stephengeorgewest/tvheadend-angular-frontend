import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DvrService } from 'src/app/api/dvr/dvr.service';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';


@Component({
	selector: 'app-confirm-stop',
	templateUrl: './confirm-stop.dialog.html',
	styleUrls: ['./confirm-stop.dialog.css']
})
export class ConfirmDvrStopDialog {
	public deleting = false;
	public toStop;
	public toCancel;
	constructor(
		private dvrService: DvrService,
		@Inject(MAT_DIALOG_DATA) private entries: Array<GridUpcomingEntry>,
		public dialogref: MatDialogRef<ConfirmDvrStopDialog>
	) {
		this.toStop = entries.filter(e=> e.sched_status === "recording")
		this.toCancel = this.entries.filter(e=> e.sched_status === "scheduled")
	}

	public confirm() {
		this.deleting=true;
		Promise.all([
			this.dvrService.stopBydvrUUID({uuid: this.toStop  .map(e => e.uuid)}),
			this.dvrService.deleteIdNode ({uuid: this.toCancel.map(e => e.uuid)})
		]).then(() => this.dialogref.close());
	}
}

