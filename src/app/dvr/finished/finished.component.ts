import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, Pipe, PipeTransform } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { DvrService } from 'src/app/api/dvr/dvr.service';
import { GridUpcomingEntry } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { AppConfig, APP_CONFIG } from 'src/app/app.config';
import { uuidTrack } from 'src/app/util';
import { ConfirmDeleteDialog } from './confirm-delete/confirm-delete.dialog';
type groupkeys = keyof Pick<GridUpcomingEntry,
	"disp_title" |
	"channelname" |
	"filesize"
>;
type groupsortkeys = "groupkey" | keyof Pick<GridUpcomingEntry,
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
	collapsed?: boolean;
};

type sortType<T> = {
	key: T,
	ascending: boolean,
}
type sortColumn = {
	displayString: string,
	sort: boolean,
	sortOrder: number,
	ascending: boolean,
	display: boolean,
	displayOrder: number
};

@Component({
	selector: 'app-dvr-finished',
	templateUrl: './finished.component.html',
	styleUrls: ['./finished.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishedComponent {
	public columns: { [property in sortkeys]: sortColumn } = {
		disp_title: {
			displayString: "Title",
			sort: true,
			sortOrder: 1,
			ascending: true,
			display: true,
			displayOrder: 1
		},
		disp_description: {
			displayString: "Description",
			sort: false,
			sortOrder: 10,
			ascending: true,
			display: false,
			displayOrder: 10
		},
		disp_subtitle: {
			displayString: "Subtitle",
			sort: true,
			sortOrder: 3,
			ascending: true,
			display: true,
			displayOrder: 3
		},
		episode_disp: {
			displayString: "Episode",
			sort: true,
			sortOrder: 2,
			ascending: true,
			display: true,
			displayOrder: 2
		},
		channelname: {
			displayString: "Channel",
			sort: true,
			sortOrder: 4,
			ascending: false,
			display: true,
			displayOrder: 4
		},
		start_real: {
			displayString: "Start Time",
			sort: true,
			sortOrder: 5,
			ascending: false,
			display: true,
			displayOrder: 5
		},
		duration: {
			displayString: "Duration",
			sort: true,
			sortOrder: 6,
			ascending: false,
			display: true,
			displayOrder: 6
		},
		filesize: {
			displayString: "Size",
			sort: true,
			sortOrder: 7,
			ascending: false,
			display: true,
			displayOrder: 7
		},
		errors: {
			displayString: "Errors",
			sort: true,
			sortOrder: 8,
			ascending: false,
			display: true,
			displayOrder: 8
		},
		data_errors: {
			displayString: "Data Errors",
			sort: true,
			sortOrder: 9,
			ascending: false,
			display: true,
			displayOrder: 9
		}
	};
	private displayedColumnUpdate() {
		this.displayedColumns = Object.entries(this.columns)
			.filter(([key, value]) => value.display && this.groupBy !== key)
			.sort(([key_a, value_a], [key_b, vaule_b]) => value_a.displayOrder - vaule_b.displayOrder)
			.map(([key, value]) => key as sortkeys)

		this.changeDetectorRef.detectChanges();
	}
	public displayedColumns: Array<sortkeys> = [];
	public displayedColumnsChange(event: MatCheckboxChange, columnKey: sortkeys) {
		//event.stopPropagation();
		//this.columns[columnKey].display = !this.columns[columnKey].display;
		this.displayedColumnUpdate();
	}

	public groupList: Array<groupkeys> = [
		"disp_title",
		"channelname",
		"filesize"
	];
	public groupBy: groupkeys | undefined = "disp_title";
	public groupsortList: Array<sortType<groupsortkeys>> = [
		{ key: "groupkey", ascending: true },
		{ key: "start_real", ascending: true },
		{ key: "duration", ascending: true },
		{ key: "filesize", ascending: true },
	];
	public groupSort: sortType<groupsortkeys> = this.groupsortList[0];

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
	public reverseGroupSort() {
		this.groupSort.ascending = !this.groupSort.ascending;
		this.sortGroups();
	}
	public reverse(sortKey: sortkeys) {
		this.columns[sortKey].ascending = !this.columns[sortKey].ascending;
		this.sortEntries();
	}
	public up(sortKey: sortkeys, type: "sortOrder" | "displayOrder"): void {
		const previousOrder = this.columns[sortKey][type];
		if (previousOrder === 1)
			return;

		const swap = Object.entries(this.columns).find(([key, value]) => value[type] === previousOrder - 1) as [sortkeys, any];
		if (swap)
			this.columns[swap[0]][type] = previousOrder;
		this.columns[sortKey][type] = previousOrder - 1;

		type === "sortOrder" ?
			this.sortEntries() : this.displayedColumnUpdate();
	}
	public down(sortKey: sortkeys, type: "sortOrder" | "displayOrder"): void {
		const previousOrder = this.columns[sortKey][type];
		const maxOrder =
			Object.values(this.columns)
				.reduce((pre, cur) => pre > cur[type] ? pre : cur[type], 0);
		if (previousOrder === maxOrder)
			return;

		const swap = Object.entries(this.columns).find(([key, value]) => value[type] === previousOrder + 1) as [sortkeys, any];
		if (swap)
			this.columns[swap[0]][type] = previousOrder;
		this.columns[sortKey][type] = previousOrder + 1;

		type === "sortOrder" ?
			this.sortEntries() : this.displayedColumnUpdate();

	}

	public filesize: number = 0;
	public duration: number = 0;
	public entryGroups: grouped[] = [];
	public totalCount = 0;
	public serverURL;

	public selectedEntry: GridUpcomingEntry[] = [];

	private entries: GridUpcomingEntry[] = [];
	private gridFinishedSubscription: Subscription | undefined;
	public uuidTrack = uuidTrack;

	constructor(
		public dvrService: DvrService,
		private dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef,
		@Inject(APP_CONFIG) config: AppConfig
	) {
		this.serverURL = 'http' + config.server.secure + '://' + config.server.host + ':' + config.server.port + '/dvrfile/';
	}

	public ngOnInit() {
		this.gridFinishedSubscription = this.dvrService.onGridFinishedResponse().subscribe((data) => {
			this.entries = data?.entries || [];
			this.totalCount = data?.total || 0;
			this.groupAndSort();
		});
		this.dvrService.refreshGridFinished();
		this.displayedColumnUpdate();
		this.dvrService.onGridUpdateResponse().subscribe(data => this.entryGroups.every(group => group.entries.every(oldEntry => {
			const newIndex = data.entries.findIndex(e => e.uuid === oldEntry.uuid)
			if (newIndex !== -1) {
				const newEntry = data.entries.splice(newIndex)[0];
				if (newEntry.filesize)
					group.filesize - oldEntry.filesize + newEntry.filesize;
				(Object.keys(newEntry) as Array<keyof Partial<GridUpcomingEntry>>).forEach(key => {
					const newValue = newEntry[key];
					if (newValue)
						(oldEntry as any)[key as any] = newValue as any;
				});

				this.changeDetectorRef.markForCheck();
			}
		})));
		this.changeDetectorRef.markForCheck();
	}
	public ngOnDestroy() {
		this.gridFinishedSubscription?.unsubscribe();
	}
	private groupAndSort() {
		this.filesize = 0;
		this.duration = 0;
		const allCollapsed = this.entryGroups.every(g => g.collapsed);
		const prevCollapsed = this.entryGroups.reduce((collapsed, g) => {
			collapsed.set(g.grouptitle, g.collapsed)
			return collapsed;
		}, new Map());
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
				collapsed: prevCollapsed.get(group),
				filesize: cur.filesize,
				duration: cur.duration,
				entries: [cur],
			});
			return prev;
		}, new Map<string | number, grouped>()).values()];
		this.sortGroups();
		this.sortEntries();
		if(allCollapsed)
			this.collapseAll(true);
		else{
			this.collapsable = true;
			this.expandable = false;
		}
		
		this.changeDetectorRef.markForCheck();
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
				case "groupkey":
					sortValue = this.groupBy ? this.compare(a.grouptitle, b.grouptitle) : 0;
					break;
				case "duration":
				case "filesize":
					sortValue = this.compare(a[this.groupSort.key], b[this.groupSort.key], this.groupSort.key);
					break;
				case "start_real":
					const aStart = a.entries.map(e => e.start_real).sort();
					const bStart = b.entries.map(e => e.start_real).sort();
					if(!this.groupSort.ascending){
						aStart.reverse();
						bStart.reverse();
					}
					sortValue = this.groupSort.ascending ? aStart[0] - bStart[0]: aStart[0] - bStart[0];
					break;
				default:
					sortValue = 0;
			}
			return this.groupSort.ascending ? sortValue : -sortValue;
		});
		this.displayedColumnUpdate();
	}
	private sortEntries() {
		const sortList = Object.entries(this.columns)
			.filter(([key, value]) => value.sort)
			.sort(([key_a, value_a], [key_b, value_b]) => (value_a.sortOrder - value_b.sortOrder))
			.map(([key, value]) => ({ key: key as sortkeys, descending: value.ascending }));
		for (let g of this.entryGroups) {
			g.entries.sort((a, b) => {
				for (let s of sortList) {
					if (this.columns[s.key].display) {
						const v = this.compare(a[s.key], b[s.key], s.key);
						if (v != 0) { return s.descending ? v : -v; }
					}
				}
				return 0;
			});
		}

		this.changeDetectorRef.markForCheck();
	}
	private compare<T extends string | number>(a: T, b: T, type?: sortkeys): number {
		if (type === "episode_disp") {
			const a_parsed = parse_episode_disp(<string>a);
			const b_parsed = parse_episode_disp(<string>b);
			if (a_parsed?.season === b_parsed?.season)
				return (a_parsed?.episode ?? 0) - (b_parsed?.episode ?? 0);
			else
				return (a_parsed?.season ?? 0) - (b_parsed?.season ?? 0);
		}
		else if (typeof a === "string")
			return a.localeCompare(<string>b);
		else
			return <number>a - <number>b;
	}
	public expandable = false;
	public collapsable = true;
	public collapse(group: grouped){
		group.collapsed = !group.collapsed;
		if(group.collapsed){
			this.expandable = true;
		}
		else{
			this.expandable = this.entryGroups.some(g => g.collapsed);
		}
		if(group.collapsed){
			this.collapsable = true;
		}
		else{
			this.collapsable = this.entryGroups.some(g => !g.collapsed);
		}
	}
	public collapseAll(collapse?: boolean){
		this.entryGroups.forEach((group) => group.collapsed = collapse);
		if(collapse){
			this.collapsable = false;
			this.expandable = true;
		}else{
			this.collapsable = true;
			this.expandable = false;
		}
	}

	public click(event: MouseEvent, entry: GridUpcomingEntry) {
		event.stopPropagation();
		const foundIndex = this.selectedEntry.findIndex(se => se.uuid === entry.uuid);
		if (event.shiftKey && this.selectedEntry.length) {
			const lastSelected = this.selectedEntry[this.selectedEntry.length - 1];
			let adding: { start: GridUpcomingEntry, end: GridUpcomingEntry } | undefined = undefined;
			this.entryGroups.every(g => g.entries.every(e => {
				if (!adding) {
					if (e.uuid === entry.uuid)
						adding = { start: entry, end: lastSelected };
					if (e.uuid === lastSelected.uuid)
						adding = { start: lastSelected, end: entry };
				}
				if (adding && !this.selectedEntry.find(se => se.uuid === e.uuid)) {
					this.selectedEntry.push(e);
				}
				if (e.uuid === adding?.end.uuid)
					return false;
				else
					return true;
			}));
		}
		else if (event.ctrlKey) {
			if (foundIndex > -1) {
				this.selectedEntry.splice(foundIndex, 1);
			}
			else {
				this.selectedEntry.push(entry);
			}
		}
		else if (this.selectedEntry.length === 1 && this.selectedEntry[0].uuid === entry.uuid)
			this.selectedEntry = [];
		else
			this.selectedEntry = [entry];

		this.changeDetectorRef.markForCheck();
	}

	public selectAllEntries() {
		this.selectedEntry = this.entryGroups.flatMap(g => g.entries);
	}
	public selectAll(entry: GridUpcomingEntry[]) {
		this.selectedEntry = [...entry];
	}
	public selectAllAdd(entry: GridUpcomingEntry[]) {
		this.selectedEntry.push(...entry.filter(e => !this.selectedEntry.some(se => se.uuid === e.uuid)));
	}
	public deselectAll(entry: GridUpcomingEntry[]) {
		this.selectedEntry = this.selectedEntry.filter(se => !entry.some(e => se.uuid === e.uuid))
	}

	public remove(entry: GridUpcomingEntry[]) {
		this.dialog.open(ConfirmDeleteDialog, {
			data: entry
		});
	}

	public groupTrack(index: number, entry: grouped) {
		return entry.grouptitle;
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
	template: "<div *ngIf='d?.season'>Season {{d?.season}}</div><div *ngIf='d?.episode'>Episode {{d?.episode}}</div>",
	styles: ["div {white-space:nowrap;}"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodeDisplayComponent {
	public d: { season?: number, episode: number } | undefined;
	@Input() public set season_episode(season_episode: string) {
		this.d = parse_episode_disp(season_episode);
		this.changeDetectorRef.detectChanges();
	}
	constructor(private changeDetectorRef: ChangeDetectorRef) { }
}
/**
 * Season 1.Episode 4 => {season: 1, episode: 4}
 * Episode 105 => {episode: 105}
 * @param season_episode 
 * @returns 
 */
function parse_episode_disp(season_episode: string): { season?: number, episode: number } | undefined {
	const season_episode_array = season_episode.split(".");
	if (season_episode_array.length === 2) {
		return {
			season: parseInt(season_episode_array[0].split(" ")[1]),
			episode: parseInt(season_episode_array[1].split(" ")[1])
		};
	}
	else if (season_episode_array.length === 1) {
		if (season_episode_array[0].startsWith("E")) return { episode: parseInt(season_episode_array[0].split(" ")[1]) };
	}
	return undefined;
}

@Pipe({
	name: 'sortListPosition', pure: false
})
export class SortListPositionPipe implements PipeTransform {
	transform(sortKey: keyof GridUpcomingEntry, sortList: Array<sortType<sortkeys>>) {
		return sortList.findIndex(s => s.key === sortKey);
	}
}

@Pipe({
	name: 'sortListDirection', pure: false
})
export class SortListDirectionPipe implements PipeTransform {
	transform(sortKey: keyof GridUpcomingEntry, sortList: Array<sortType<sortkeys>>) {
		return sortList.find(s => s.key === sortKey)?.ascending;
	}
}

@Pipe({
	name: 'inDisplayedColumns', pure: false
})
export class InDisplayedColumnsPipe implements PipeTransform {
	transform(columnKey: sortkeys, displayedColumns: Array<sortkeys>) {
		return !!displayedColumns.find((s) => s === columnKey);
	}
}

@Pipe({
	name: 'inSelected', pure: false
})
export class InSelectedPipe implements PipeTransform {
	transform(uuid: string, selected: Array<GridUpcomingEntry>) {
		return !!selected.find((e) => e.uuid === uuid);
	}
}