import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { ConfirmStopDialog } from '../confirm-stop/confirm-stop.dialog';
import { EntryDialog } from './entry/entry.component';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnChanges {
	public topEntry: GridEntry | undefined;
	@Input() public selectedEntry: GridEntry[] = [];

	constructor(private apiService: ApiService, public dialog: MatDialog) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['selectedEntry'].firstChange)
			this.select(this.selectedEntry[0], true);
	}
	public select(entry: GridEntry | undefined, scroll?: boolean) {
		this.topEntry = entry;
		if (scroll) {
			const container = document.getElementById("entry-list");
			if (container) {
				const id = entry?.eventId || 0;
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
		this.dialog.open(EntryDialog, {
			data: { entry: this.topEntry },
			panelClass: "custom-dialog-container",
		});
	}
	public pendingAPI = false;
	public record(event_id: number) {
		this.pendingAPI = true;
		this.apiService.createByEvent({ event_id, config_uuid: "" }).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
	}
	public stop(entry: GridEntry) {
		this.pendingAPI = true;
		this.dialog.open(ConfirmStopDialog, {
			data: entry
		}).afterClosed().subscribe(() => this.pendingAPI = false);
	}
	public prev() {
		let entry;
		if (!this.topEntry)
			entry = this.selectedEntry[0];
		else {
			const index = this.selectedEntry.findIndex(e => e.eventId === this.topEntry?.eventId);
			if (index !== 0)
				entry = this.selectedEntry[index - 1];
		}
		this.select(entry, true);
	}
	public next() {
		let entry;
		if (!this.topEntry)
			entry = this.selectedEntry[0];
		else {
			const index = this.selectedEntry.findIndex(e => e.eventId === this.topEntry?.eventId);
			if (index !== this.selectedEntry.length - 1)
				entry = this.selectedEntry[index + 1];
		}
		this.select(entry, true);
	}
}