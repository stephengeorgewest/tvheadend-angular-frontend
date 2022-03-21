import { KeyValue } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { GridUpcomingRequest } from 'src/app/api/dvr/entry/grid_upcoming/requestmodel';
import { GridUpcomingEntry, GridUpcomingResponse } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { fetchData } from 'src/app/api/util';
type groupkeys = keyof Pick<GridUpcomingEntry,
	"disp_title" |
	"channel" |
	"filesize"
>;
type sortkeys = keyof Pick<GridUpcomingEntry,
	"disp_title" |
	"disp_description" |
	"disp_subtitle" |
	"episode_disp" |
	"channel" |
	"start_real" |
	"duration" |
	"filesize" |
	"errors" |
	"data_errors"
>;
type grouped = {
	filesize: number;
	duration: number;
	entries: GridUpcomingEntry[];
};

@Component({
	selector: 'app-dvr-finished',
	templateUrl: './finished.component.html',
	styleUrls: ['./finished.component.css']
})
export class FinishedComponent {
	public mapping: {[property in sortkeys]?: string} = {
		disp_title: "Title",
		disp_description: "Description",
		disp_subtitle: "Subtitle",
		episode_disp: "Episode",
		channel: "Channel",
		start_real: "Start Time",
		duration: "Duration",
		filesize: "Size",
		errors: "Errors",
		data_errors: "data Errors"
	};

	public groupList: Array<groupkeys> = ["disp_title",
		"channel",
		"filesize"
	];
	public groupBy: groupkeys = "disp_title";
	public groupSort: sortkeys = "episode_disp";
	public groupSortChange(event: Event){
		if(event.target)
			this.groupSort = (event.target as HTMLInputElement).value as sortkeys;
		this.groupAndSort();
	}
	public sortList: Array<sortkeys> = [
		"disp_title",
		"disp_description",
		"disp_subtitle",
		"episode_disp",
		"channel",
		"start_real",
		"duration",
		"filesize",
		"errors",
		"data_errors"
	];
	public up(sortName: sortkeys):void {
		const index = this.sortList.findIndex((s) => sortName === s);
		if(index !== 0){
			this.sortList[index] = this.sortList[index-1];
			this.sortList[index-1] = sortName;
		}
	}
	public down(sortName: sortkeys):void {
		const index = this.sortList.findIndex((s) => sortName === s);
		if(index !== this.sortList.length-1){
			this.sortList[index] = this.sortList[index+1];
			this.sortList[index+1] = sortName;
		}
	}

	public filesize: number = 0;
	public duration: number = 0;
	public entryGroups: Map<string | number, grouped> = new Map();
	public totalCount = 0;

	public selectedEntry: GridUpcomingEntry[] = [];
	
	private entries: GridUpcomingEntry[] = [];
	constructor() {
		fetchData(
			'/dvr/entry/grid_finished',
			{ start:0, dir: "ASC", duplicates: 0, limit: 999999999 },
			data => {
				this.entries = (data as GridUpcomingResponse).entries;
				this.totalCount = data.total;
				this.groupAndSort();
			}
		);
	}
	private groupAndSort() {
		this.entryGroups = this.entries.reduce((prev, cur) => {
			const e = prev.get(cur[this.groupBy]);
			if(e) {
				e.filesize += cur.filesize;
				e.duration += cur.duration;
				e.entries.push(cur);
			}
			else prev.set(cur.disp_title, {
				filesize: cur.filesize,
				duration: cur.duration,
				entries: [cur]
			});
			return prev;
		}, new Map<string | number, grouped>());

		for(let g of this.entryGroups.values()){
			this.filesize += g.filesize;
			this.duration += g.duration;
			g.entries.sort((a,b) => this.compare(a[this.sortList[0]], b[this.sortList[0]]));
		}
	}
	private compare<T extends string | number>(a: T, b: T): number{
		if(typeof a === "string")
			return a.localeCompare(<string>b);
		else
			return <number>a-<number>b;
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


	public timesort(
		a: KeyValue<string | number, grouped>,
		b: KeyValue<string | number, grouped>
	){
		return a.value.entries[0].start - b.value.entries[0].start;
	}
}

@Pipe({
	name: 'filesize'
})
export class FileSizePipe implements PipeTransform {
	transform(size: number) {
		const sizes = [
			"b",
			"Kb",
			"Mb",
			"Gb",
			"Tb"
		];

		let s = size;
		let bin = 0;
		while(s > 1024){
			s/=1024;
			bin++;
		}
		return (s).toFixed(0) + sizes[bin];
	}
}


@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {
	transform(duration: number) {
		let d = duration;
		
		const seconds = d%60;
		d = (d-seconds)/60;
		
		const minutes = d%60;
		d = (d-minutes)/60;

		const hours = d%60;
		const days = (d-hours)/24;

		const times:string[] = [];
		if(days) times.push(days + " days");
		if(hours) times.push(hours + " hours");
		if(minutes) times.push(minutes + " minutes");
		if(seconds) times.push(seconds + " seconds");

		return times.join(", ");
	}
}