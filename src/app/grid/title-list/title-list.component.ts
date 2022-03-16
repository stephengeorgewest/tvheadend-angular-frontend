import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { ignoreEntry, IgnoreListService, listNames } from 'src/app/ignore-list.service';

type coarseTimeGroupKeys = "past" | "now" | "next" | "tomorrow" | "nextWeek" | "nextMonth";
type dateBoundryKeys = Exclude<coarseTimeGroupKeys, "past" | "next">;

type title = string;
type start = number

function getDates(): { [key in dateBoundryKeys]: number } {
	const now = Date.now() / 1000;

	const todayDate = new Date();
	const tomorrowDate = new Date();
	tomorrowDate.setDate(todayDate.getDate() + 1);
	tomorrowDate.setHours(0, 0, 0, 0);
	const tomorrow = tomorrowDate.getTime() / 1000;

	const nextWeekDate = new Date();
	nextWeekDate.setDate(tomorrowDate.getDate() + 7);
	nextWeekDate.setHours(0, 0, 0, 0);
	const nextWeek = nextWeekDate.getTime() / 1000;

	const nextMonthDate = new Date();
	nextMonthDate.setDate(nextWeekDate.getDate() + 30);
	nextMonthDate.setHours(0, 0, 0, 0);
	const nextMonth = nextMonthDate.getTime() / 1000;
	return { now, tomorrow, nextWeek, nextMonth };
}
@Component({
	selector: 'app-title-list',
	templateUrl: './title-list.component.html',
	styleUrls: ['./title-list.component.css']
})
export class TitleListComponent {
	public times = getDates();
	public coarseTimeGroups: {
		[key in coarseTimeGroupKeys]: Map<start, Map<title, GridEntry[]>>
	} = {
			past: new Map<start, Map<title, GridEntry[]>>(),
			now: new Map<start, Map<title, GridEntry[]>>(),
			next: new Map<start, Map<title, GridEntry[]>>(),
			tomorrow: new Map<start, Map<title, GridEntry[]>>(),
			nextWeek: new Map<start, Map<title, GridEntry[]>>(),
			nextMonth: new Map<start, Map<title, GridEntry[]>>()
		};

	@Input() public set filteredEntries(filteredEntries: Map<title, GridEntry[]>) {
		this.times = getDates();
		this._filteredEntries = filteredEntries;
		this.reGroup();
	}
	private _filteredEntries: Map<title, GridEntry[]> | undefined = undefined;
	private reGroup() {
		if (this._filteredEntries) {
			this.coarseTimeGroups = [...this._filteredEntries.entries()].reduce((prev, [title, entryList]) => {
				let coarseTimeGroup = prev.nextMonth;
				if (entryList[0].stop < this.times.now) {
					coarseTimeGroup = prev.past;
				}
				else if (entryList[0].start <= this.times.now) {
					coarseTimeGroup = prev.now;
				}
				else if (this.times.now <= entryList[0].start && entryList[0].start < this.times.tomorrow) {
					coarseTimeGroup = prev.next;
				}
				else if (this.times.tomorrow <= entryList[0].start && entryList[0].start < this.times.nextWeek) {
					coarseTimeGroup = prev.tomorrow;
				}
				else if (this.times.nextWeek <= entryList[0].start && entryList[0].start < this.times.nextMonth) {
					coarseTimeGroup = prev.nextWeek;
				}

				const fineTimeGroup = coarseTimeGroup.get(entryList[0].start);
				if(fineTimeGroup) {
					fineTimeGroup.set(title, entryList)
				}
				else {
					coarseTimeGroup.set(entryList[0].start, new Map([[title, entryList]]))
				}
				return prev;
			}, {
				past: new Map<start, Map<title, GridEntry[]>>(),
				now: new Map<start, Map<title, GridEntry[]>>(),
				next: new Map<start, Map<title, GridEntry[]>>(),
				tomorrow: new Map<start, Map<title, GridEntry[]>>(),
				nextWeek: new Map<start, Map<title, GridEntry[]>>(),
				nextMonth: new Map<start, Map<title, GridEntry[]>>()
			});
		}
	}

	@Input() public lastignoredcount: number = 0;
	@Output() public selectedEntry: EventEmitter<GridEntry[]> = new EventEmitter();

	public tapped: string = "";

	public ignoreListNames: Array<{ name: "Recorded" | "Garbage" | "Meh", icon: string }> = [
		{ name: "Recorded", icon: "task_alt" },
		{ name: "Garbage", icon: "paid" },
		{ name: "Meh", icon: "star_half" },
	];

	constructor(private ignoreService: IgnoreListService) { }

	public select(event: GridEntry[]) {
		if (!this.tapped)
			this.selectedEntry.emit(event);
	}
	public tap(event: GridEntry[]) {
		if (this.tapped == event[0].title) {
			this.tapped = "";
		}
		else {
			this.tapped = event[0].title;
			this.selectedEntry.emit(event);
		}
	}
	public ignore(entry: ignoreEntry, listName: listNames) {
		this.ignoreService.ignore(entry, listName);
	}
	public ignoreTitle(title: string, listName: listNames) {
		this.ignoreService.ignoreTitle(title, listName);
	}
	public ignoreChanelName(channelName: string, listName: listNames) {
		this.ignoreService.ignoreChanelName(channelName, listName);
	}

	public coarseTimeGroupOrder(a: KeyValue<coarseTimeGroupKeys,any>, b: KeyValue<coarseTimeGroupKeys, any>) {
		const keySortOrder: coarseTimeGroupKeys[] = [
			"past", "now", "next", "tomorrow", "nextWeek", "nextMonth"
		];
		return keySortOrder.indexOf(a.key) - keySortOrder.indexOf(b.key);
	}
	public fineTimeGroupOrder(a: KeyValue<string, GridEntry[]>, b: KeyValue<string, GridEntry[]>) {
		if (a.value[0].start === b.value[0].start) {
			const channel_a = a.value[0].channelNumber.split(".");
			const channel_b = b.value[0].channelNumber.split(".");
			if (channel_a[0] === channel_b[0])
				return parseInt(channel_a[1]) - parseInt(channel_b[1]);
			return parseInt(channel_a[0]) - parseInt(channel_b[0]);
		}
		return a.value[0].start - b.value[0].start;
	}
}
