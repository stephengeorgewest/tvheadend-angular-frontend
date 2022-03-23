import { KeyValue } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { GridUpcomingRequest } from 'src/app/api/dvr/entry/grid_upcoming/requestmodel';
import { GridUpcomingEntry, GridUpcomingResponse } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { fetchData } from 'src/app/api/util';
type groupkeys = keyof Pick<GridUpcomingEntry,
	"disp_title" |
	"channelname" |
	"filesize"
>;
type groupsortkeys = keyof Pick<GridUpcomingEntry,
	"disp_title" |
	"disp_description" |
	"disp_subtitle" |
	"episode_disp" |
	"channelname" |
	"start_real" |
	"duration" |
	"filesize"
>;
type sortkeys = keyof Pick<GridUpcomingEntry,
	"disp_title" |
	"disp_description" |
	"disp_subtitle" |
	"episode_disp" |
	"channelname" |
	"start_real" |
	"duration" |
	"filesize" |
	"errors" |
	"data_errors"
>;
type grouped = {
	grouptitle: string | number;
	filesize: number;
	duration: number;
	entries: GridUpcomingEntry[];
};

type sortType<T> = {
	key: T,
	ascending: boolean
}

@Component({
	selector: 'app-dvr-finished',
	templateUrl: './finished.component.html',
	styleUrls: ['./finished.component.css']
})
export class FinishedComponent {
	public mapping: { [property in keyof GridUpcomingEntry]?: string } = {
		disp_title: "Title",
		disp_description: "Description",
		disp_subtitle: "Subtitle",
		episode_disp: "Episode",
		channelname: "Channel",
		start_real: "Start Time",
		duration: "Duration",
		filesize: "Size",
		errors: "Errors",
		data_errors: "data Errors"
	};

	public groupList: Array<groupkeys> = ["disp_title",
		"channelname",
		"filesize"
	];
	public groupBy: groupkeys | undefined = "disp_title";
	public groupSort: groupsortkeys = "episode_disp";

	public groupChange(event: MatSelectChange) {
		if (event.value)
			this.groupBy = event.value as groupkeys;
		this.groupAndSort();
	}
	public groupSortChange(event: MatSelectChange) {
		if (event.value)
			this.groupSort = event.value as groupsortkeys;
		this.sortGroups();
	}
	public groupsortList: Array<sortType<groupsortkeys>> = [
		{ key: "disp_title", ascending: false },
		{ key: "disp_description", ascending: false },
		{ key: "disp_subtitle", ascending: false },
		{ key: "episode_disp", ascending: false },
		{ key: "channelname", ascending: false },
		{ key: "start_real", ascending: false },
		{ key: "duration", ascending: false },
		{ key: "filesize", ascending: false },
	];
	public sortList: Array<sortType<sortkeys>> = [
		{ key: "disp_title", ascending: false },
		{ key: "disp_description", ascending: false },
		{ key: "disp_subtitle", ascending: false },
		{ key: "episode_disp", ascending: false },
		{ key: "channelname", ascending: false },
		{ key: "start_real", ascending: false },
		{ key: "duration", ascending: false },
		{ key: "filesize", ascending: false },
		{ key: "errors", ascending: false },
		{ key: "data_errors", ascending: false }
	];
	public up(sort: sortType<sortkeys>): void {
		const index = this.sortList.findIndex((s) => sort.key === s.key);
		if (index !== 0) {
			this.sortList[index] = this.sortList[index - 1];
			this.sortList[index - 1] = sort;
		}
		this.sortEntries();
	}
	public down(sort: sortType<sortkeys>): void {
		const index = this.sortList.findIndex((s) => sort.key === s.key);
		if (index !== this.sortList.length - 1) {
			this.sortList[index] = this.sortList[index + 1];
			this.sortList[index + 1] = sort;
		}
		this.sortEntries();
	}

	public filesize: number = 0;
	public duration: number = 0;
	public entryGroups: grouped[] = [];
	public totalCount = 0;

	public selectedEntry: GridUpcomingEntry[] = [];

	private entries: GridUpcomingEntry[] = [];
	constructor() {
		fetchData(
			'/dvr/entry/grid_finished',
			{ start: 0, dir: "ASC", duplicates: 0, limit: 999999999 },
			data => {
				this.entries = (data as GridUpcomingResponse).entries;
				this.totalCount = data.total;
				this.groupAndSort();
			}
		);
	}
	private groupAndSort() {
		this.filesize = 0;
		this.duration = 0;
		this.entryGroups = [...this.entries.reduce((prev, cur) => {
			const group = !this.groupBy ?
				"NO_GROUP" :
				this.groupBy === "filesize" ?
					this.getBin(512, cur[this.groupBy])
					: cur[this.groupBy];
			const e = prev.get(group);
			this.filesize += cur.filesize;
			this.duration += cur.duration;
			if (e) {
				e.filesize += cur.filesize;
				e.duration += cur.duration;
				e.entries.push(cur);
			}
			else prev.set(group, {
				grouptitle: group,
				filesize: cur.filesize,
				duration: cur.duration,
				entries: [cur]
			});
			return prev;
		}, new Map<string | number, grouped>()).values()];
		this.sortGroups();
		this.sortEntries();
	}
	private getBin(binSize: number, filesize: number) {
		let s = filesize;
		let bin = 0;
		while (s > binSize) {
			s /= binSize;
			bin++;
		}
		let e = Math.round(s);
		while (bin > 0) {
			e *= binSize;
			bin--;
		}
		return e;
	}
	private sortGroups() {
		this.entryGroups.sort((a, b) => {
			switch (this.groupSort) {
				case "duration":
				case "filesize":
					return this.compare(a[this.groupSort], b[this.groupSort]);
				case "start_real":
					const f = (cur: number, prev: GridUpcomingEntry) => prev.start_real < cur ? prev.start_real : cur;
					const aStart = a.entries.reduce(f, 9999999999);
					const bStart = b.entries.reduce(f, 9999999999);
					return bStart - aStart;
				default:
					return 0;
			}
		});
	}
	private sortEntries() {
		for (let g of this.entryGroups) {
			g.entries.sort((a, b) => {
				for (let s of this.sortList) {
					const v = s.ascending ? this.compare(a[s.key], b[s.key]) : this.compare(b[s.key], a[s.key]);
					if (v != 0) { return v; }
				}
				return 0;
			});
		}
	}
	private compare<T extends string | number>(a: T, b: T): number {
		if (typeof a === "string")
			return a.localeCompare(<string>b);
		else
			return <number>b - <number>a;
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
		while (s > 1024) {
			s /= 1024;
			bin++;
		}
		return (bin > 2 ? (s).toFixed(1) : Math.round(s)) + sizes[bin];
	}
}


@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {
	transform(duration: number) {
		let d = duration;

		const seconds = d % 60;
		d = (d - seconds) / 60;

		const minutes = d % 60;
		d = (d - minutes) / 60;

		const hours = d % 60;
		const days = (d - hours) / 24;

		const times: string[] = [];
		if (days) times.push(days + " days");
		if (hours) times.push(hours + " hours");
		if (minutes) times.push(minutes + " minutes");
		if (seconds) times.push(seconds + " seconds");

		return times.join(", ");
	}
}