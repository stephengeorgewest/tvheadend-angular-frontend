import { Component, Input, OnChanges, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { ConfirmDvrStopDialog } from '../confirm-stop/confirm-stop.dialog';
import { UpcomingEntryDialog } from './entry/upcoming-entry.component';

@Component({
	selector: 'app-upcoming-entry-list',
	templateUrl: './upcoming-entry-list.component.html',
	styleUrls: ['./upcoming-entry-list.component.css']
})
export class UpcomingEntryListComponent implements OnChanges {
	public topEntry: GridUpcomingEntry | undefined;
	@Input() public selectedEntry: GridUpcomingEntry[] = [];

	constructor(public dialog: MatDialog) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['selectedEntry'].firstChange)
			this.select(this.selectedEntry[0])
	}
	public click(event: Event, entry: GridUpcomingEntry) {
		event.stopPropagation();
		this.select(entry);
	}
	private select(entry: GridUpcomingEntry) {
		if (this.topEntry?.uuid == entry.uuid) {
			this.topEntry = this.selectedEntry[0];
		}
		else {
			this.topEntry = entry;
		}
	}
	public open() {
		this.dialog.open(UpcomingEntryDialog, {
			data: { entry: this.topEntry },
			panelClass: "custom-dialog-container",
		});
	}
	public stop(entry: GridUpcomingEntry){
		this.dialog.open(ConfirmDvrStopDialog, {
			data: [entry]
		});
	}
}