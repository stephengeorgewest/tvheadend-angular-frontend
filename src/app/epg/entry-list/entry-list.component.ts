import { Component, Input, OnChanges, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api';
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

	constructor(private apiService: ApiService, public dialog: MatDialog) { }
	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['selectedEntry'].firstChange)
			this.select(this.selectedEntry[0])
	}
	public click(event: Event, entry: GridEntry) {
		event.stopPropagation();
		this.select(entry);
	}
	private select(entry: GridEntry | undefined) {
			this.topEntry = entry;
	}
	public open() {
		this.dialog.open(EntryDialog, {
			data: { entry: this.topEntry },
			panelClass: "custom-dialog-container",
		});
	}
	public pendingAPI = false;
	public record(event_id: number){
		this.pendingAPI = true;
		this.apiService.createByEvent({event_id, config_uuid: ""}).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
	}
	public stop(entry: GridEntry){
		this.pendingAPI = true;
		//TODO: make safe
		if(entry.dvrState === "recording")
			this.apiService.stopByGridEntry(entry).catch(() => this.pendingAPI = false).then(() => this.pendingAPI = false);
		else if(entry.dvrState === 'scheduled' && entry.dvrUuid)
			this.apiService.deleteIdNode({uuid: [entry.dvrUuid]}).then(() => this.pendingAPI = false);
	}
}