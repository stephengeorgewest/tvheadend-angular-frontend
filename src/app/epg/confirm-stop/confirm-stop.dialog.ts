import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DvrService } from 'src/app/api/dvr/dvr.service';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';

@Component({
	selector: 'app-confirm-stop',
	templateUrl: './confirm-stop.dialog.html',
	styleUrls: ['./confirm-stop.dialog.css']
})
export class ConfirmStopDialog {
	public deleting = false;
	constructor(
		private dvrService: DvrService,
		@Inject(MAT_DIALOG_DATA) public entry: GridEntry,
		public dialogref: MatDialogRef<ConfirmStopDialog>
	) { }

	public confirm() {
		this.deleting=true;
		if(this.entry.dvrState === "recording")
			this.dvrService.stopByGridEntry(this.entry).then(() => this.finish());
		else if(this.entry.dvrState === 'scheduled' && this.entry.dvrUuid)
			this.dvrService.deleteIdNode({uuid: [this.entry.dvrUuid]}).then(() => this.finish());
	}
	private finish() {
		this.deleting = false;
		this.dialogref.close()
	}
}

