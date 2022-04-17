import { Component, Input, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from 'src/app/api/api';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { RemoveBydvrUUIDRequest } from 'src/app/api/dvr/entry/remove/requestmodel';
import { fetchData } from 'src/app/api/util';
import { environment } from 'src/environments/environment';
import { ConfirmDeleteDialog } from './confirm-delete/confirm-delete.dialog';
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
	public mapping: { [property in sortkeys]?: string } = {
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

	public displayedColumns: Array<sortkeys> = [
		"disp_title",
		"episode_disp",
		"disp_subtitle",
		/*"disp_description",*/
		"channelname",
		"start_real",
		"duration",
		"filesize",
		"errors",
		"data_errors"
	];

	public groupList: Array<groupkeys> = [
		"disp_title",
		"channelname",
		"filesize"
	];
	public groupBy: groupkeys | undefined = "disp_title";
	public groupSort: sortType<groupsortkeys> = {
		key: "episode_disp",
		ascending: true
	};

	public groupChange(event: MatSelectChange) {
		if (event.value)
			this.groupBy = event.value as groupkeys;
		this.groupAndSort();
	}
	public groupSortChange(event: MatSelectChange) {
		if (event.value)
			this.groupSort = (event.value as sortType<groupsortkeys>);
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
	public reverse(sortKey: sortkeys) {
		const sort = this.sortList.find(s => sortKey === s.key);
		if (sort) {
			sort.ascending = !sort.ascending;
		}
		this.sortList = [...this.sortList];
		this.sortEntries();
	}
	public up(sortKey: sortkeys): void {
		const index = this.sortList.findIndex((s) => sortKey === s.key);
		if (index === -1)
			return;
		const sort = this.sortList[index];
		if (index !== 0) {
			this.sortList[index] = this.sortList[index - 1];
			this.sortList[index - 1] = sort;
		}
		this.sortList = [...this.sortList];
		this.sortEntries();
	}
	public down(sortKey: sortkeys): void {
		const index = this.sortList.findIndex((s) => sortKey === s.key);
		const sort = this.sortList[index];
		if (index !== this.sortList.length - 1) {
			this.sortList[index] = this.sortList[index + 1];
			this.sortList[index + 1] = sort;
		}
		this.sortList = [...this.sortList];
		this.sortEntries();
	}

	public filesize: number = 0;
	public duration: number = 0;
	public entryGroups: grouped[] = [];
	public totalCount = 0;
	public serverURL = 'http' + environment.server.secure + '://' + environment.server.host + ':' + environment.server.port + '/dvrfile/';

	public selectedEntry: GridUpcomingEntry[] = [];

	private entries: GridUpcomingEntry[] = [];
	private gridFinishedSubscription;
	constructor(private apiService: ApiService, private dialog: MatDialog) {
		this.gridFinishedSubscription = this.apiService.onGridFinishedResponse().subscribe((data) => {
			this.entries = data?.entries || [];
			this.totalCount = data?.total|| 0;
			this.groupAndSort();
		});
		this.apiService.refreshGridFinished();
	}
	public ngOnDestroy() {
		this.gridFinishedSubscription.unsubscribe();
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
			let sortValue: number;
			switch (this.groupSort.key) {
				case "duration":
				case "filesize":
					sortValue = this.compare(a[this.groupSort.key], b[this.groupSort.key]);
					break;
				case "start_real":
					const f = (cur: number, prev: GridUpcomingEntry) => prev.start_real < cur ? prev.start_real : cur;
					const aStart = a.entries.reduce(f, 9999999999);
					const bStart = b.entries.reduce(f, 9999999999);
					sortValue = bStart - aStart;
					break;
				default:
					sortValue = 0;
			}
			return this.groupSort ? sortValue : - sortValue;
		});
	}
	private sortEntries() {
		for (let g of this.entryGroups) {
			g.entries.sort((a, b) => {
				for (let s of this.sortList) {
					const v = this.compare(a[s.key], b[s.key]);
					if (v != 0) { return s.ascending ? v : -v; }
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
	
	public remove(entry: GridUpcomingEntry[]) {
		this.dialog.open(ConfirmDeleteDialog, {
			data: entry
		});
	}
}

@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {
	transform(duration: number, type?: "short") {
		let d = duration;

		const seconds = d % 60;
		d = (d - seconds) / 60;

		const minutes = d % 60;
		d = (d - minutes) / 60;

		const hours = d % 60;
		const days = (d - hours) / 24;

		const times: string[] = [];
		if (days) times.push(days + (type ? "d" : " day" + (days > 1 ? "s" : "")));
		if (hours) times.push((type && hours < 10 && days ? "0" : "") + hours + (type ? "h" : " hour" + (hours > 1 ? "s" : "")));
		if (minutes) times.push((type && minutes < 10 && (days || hours) ? "0" : "") + minutes + (type ? "m" : " minute" + (minutes > 1 ? "s" : "")));
		if (seconds) times.push((type && seconds < 10 && (days || hours || minutes) ? "0" : "") + seconds + (type ? "s" : " second" + (seconds > 1 ? "s" : "")));

		return times.join(", ");
	}
}

@Component({
	selector: 'episode_disp',
	template: "<div *ngIf='season'>{{season}}</div><div>{{episode}}</div>",
	styles: ["div {white-space:nowrap;}"]
})
export class EpisodeDisplayComponent {
	public season: string = "";
	public episode: string = "";
	@Input() public set season_episode(season_episode: string) {
		const season_episode_array = season_episode.split(".");
		if (season_episode_array.length === 2) {
			this.season = season_episode_array[0];
			this.episode = season_episode_array[1];
		}
		else if (season_episode_array.length === 1) {
			if (season_episode_array[0].startsWith("E")) this.episode = season_episode_array[0];
		}
	}
}

@Pipe({
	name: 'sortListPosition'
})
export class SortListPositionPipe implements PipeTransform {
	transform(sortKey: keyof GridUpcomingEntry, sortList: Array<sortType<any>>) {
		return sortList.findIndex((s: sortType<any>) => s.key === sortKey);
	}
}

@Pipe({
	name: 'sortListDirection'
})
export class SortListDirectionPipe implements PipeTransform {
	transform(sortKey: keyof GridUpcomingEntry, sortList: Array<sortType<any>>) {
		return sortList.find((s: sortType<any>) => s.key === sortKey)?.ascending;
	}
}

@Pipe({
	name: 'inDisplayedColumns'
})
export class InDisplayedColumnsPipe implements PipeTransform {
	transform(columnKey: sortkeys, displayedColumns: Array<sortkeys>) {
		return !!displayedColumns.find((s) => s === columnKey);
	}
}