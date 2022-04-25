import { Component, Input, OnChanges, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
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
			this.select(this.selectedEntry[0], true)
	}
	public select(entry: GridUpcomingEntry, scroll?: boolean) {
		if (this.topEntry?.uuid === entry.uuid) {
			this.topEntry = this.selectedEntry[0];
		}
		else {
			this.topEntry = entry;
		}if (scroll) {
			const container = document.getElementById("upcoming-entry-list");
			const id = entry?.uuid || 0;
			if (container) {
				const target = document.getElementById(id.toString());
				if (!target) {
					container?.scrollTo({ behavior: "smooth", top: 0 });
				}
				else if (target.getBoundingClientRect().bottom > container.getBoundingClientRect().bottom) {
					target.scrollIntoView({ behavior: 'smooth', block: "end" });
				}
				else if (target.getBoundingClientRect().top < container.getBoundingClientRect().top) {
					target.scrollIntoView({ behavior: 'smooth', block: "start" });
				}
			}
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
	public prev() {
		if (!this.topEntry)
			this.select(this.selectedEntry[0], true);
		else {
			const index = this.selectedEntry.findIndex(e => e.uuid === this.topEntry?.uuid);
			if (index > 0)
				this.select(this.selectedEntry[index - 1], true);
		}
	}
	public next() {
		if (!this.topEntry)
			this.select(this.selectedEntry[0], true);
		else {
			const index = this.selectedEntry.findIndex(e => e.uuid === this.topEntry?.uuid);
			if (index !== this.selectedEntry.length - 1)
				this.select(this.selectedEntry[index + 1], true);
		}
	}
}