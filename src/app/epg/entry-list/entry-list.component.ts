import { Component, Input, OnChanges, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { EntryDialog } from './entry/entry.component';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnChanges {
	public topEntry: GridEntry | undefined;
	@Input() public selectedEntry: GridEntry[] = [];

	constructor(public dialog: MatDialog) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['selectedEntry'].firstChange)
			this.select(this.selectedEntry[0])
	}
	public click(event: Event, entry: GridEntry) {
		event.stopPropagation();
		this.select(entry);
	}
	private select(entry: GridEntry) {
		if (this.topEntry?.eventId == entry.eventId) {
			this.topEntry = this.selectedEntry[0];
		}
		else {
			this.topEntry = entry;
		}
	}
	public open() {
		this.dialog.open(EntryDialog, {
			data: { entry: this.topEntry },
			panelClass: "custom-dialog-container",
		});
	}
}