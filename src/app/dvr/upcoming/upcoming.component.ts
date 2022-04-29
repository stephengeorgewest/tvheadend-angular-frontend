import { KeyValue } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { ApiService } from 'src/app/api/api';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { ConfirmDvrStopDialog } from './confirm-stop/confirm-stop.dialog';

type row ={
	hasRecording: boolean;
	hasScheduled: boolean;
	list: GridUpcomingEntry[]
};
@Component({
	selector: 'app-dvr-upcoming',
	templateUrl: './upcoming.component.html',
	styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnDestroy {
	public entries: Map<string, row> = new Map();
	public totalCount = 0;

	public selectedEntry: GridUpcomingEntry[] = [];
	public now: number = Date.now()/1000;
	private sub;

	constructor(
		private apiService: ApiService,
		private dialog: MatDialog
	) {
		this.apiService.onGridUpcomingResponse().subscribe((data) => {
			this.entries = (data?.entries || []).reduce((prev, cur) => {
				const e = prev.get(cur.disp_title);
				if(e){
					e.hasRecording ||= cur.sched_status === 'recording';
					e.hasScheduled ||= cur.sched_status === 'scheduled';
					e.list.push(cur);
				}
				else prev.set(cur.disp_title, {
					hasRecording: cur.sched_status === 'recording',
					hasScheduled: cur.sched_status === 'scheduled',
					list: [cur]
				});
				return prev;
			}, new Map<string,row>());
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
	public stopAll(entry: GridUpcomingEntry[]){
		this.dialog.open(ConfirmDvrStopDialog, {
			data: entry
		});
	}

	public sort = this.timesort;
	public switchSort(){
		console.log("switched");
		this.sort = this.asort;
	}
	public timesort(a: KeyValue<string, row>, b: KeyValue<string, row>){
		return a.value.list[0].start - b.value.list[0].start;
	}
	public asort(a: KeyValue<string, row>, b: KeyValue<string, row>){
		return 0;
	}
}
