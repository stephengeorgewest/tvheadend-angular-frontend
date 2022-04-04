import { KeyValue } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { ApiService } from 'src/app/api/api';
import { GridUpcomingRequest } from 'src/app/api/dvr/entry/grid_upcoming/requestmodel';
import { GridUpcomingEntry, GridUpcomingResponse } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';

@Component({
	selector: 'app-dvr-upcoming',
	templateUrl: './upcoming.component.html',
	styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnDestroy {
	public entries: Map<string, GridUpcomingEntry[]> = new Map();
	public totalCount = 0;

	public selectedEntry: GridUpcomingEntry[] = [];
	public now: number = Date.now()/1000;
	private sub;
	
	constructor(private apiService: ApiService) {
		this.apiService.onGridUpcomingResponse().subscribe((data) => {
			this.entries = (data?.entries || []).reduce((prev, cur) => {
				const e = prev.get(cur.disp_title);
				if(e) e.push(cur);
				else prev.set(cur.disp_title, [cur]);
				return prev;
			}, new Map<string, GridUpcomingEntry[]>());
			this.totalCount = data?.total || 0;
		});
		this.sub = timer(60*1000, 60*1000).subscribe(() => {
			this.now = Date.now()/1000;
		});
		this.apiService.refreshGridUpcoming();
	}
	public ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	public tapped: string = "";
	public mouseenter(event: GridUpcomingEntry[]) {
		if (!this.tapped)
			this.selectedEntry = event;
	}
	public click(event: GridUpcomingEntry[]) {
		if (this.tapped == event[0].uuid) {
			this.tapped = "";
		}
		else {
			this.tapped = event[0].uuid;
			this.selectedEntry = event;
		}
	}
	public stop(event_id: GridUpcomingEntry){
		//TODO: make safe.
		this.apiService.stopBydvrUUID(event_id);
	}

	public sort = this.timesort;
	public switchSort(){
		console.log("switched");
		this.sort = this.asort;
	}
	public timesort(a: KeyValue<string, GridUpcomingEntry[]>, b: KeyValue<string, GridUpcomingEntry[]>){
		return a.value[0].start - b.value[0].start;
	}
	public asort(a: KeyValue<string, GridUpcomingEntry[]>, b: KeyValue<string, GridUpcomingEntry[]>){
		return 0;
	}
}
