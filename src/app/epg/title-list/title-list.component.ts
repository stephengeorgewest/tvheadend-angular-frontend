import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { timer } from 'rxjs';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { ignoreEntry, IgnoreListService, listNames } from 'src/app/ignore-list.service';

export type coarseTimeGroupKeys = "past" | "now" | "next" | "tomorrow" | "nextWeek" | "nextMonth";
type dateBoundryKeys = Exclude<coarseTimeGroupKeys, "past" | "next">;

type title = string;
type start = number;
export type GridEntryLite = Pick<GridEntry, "start" | "stop" | "title">;
type timesType = { [key in dateBoundryKeys]: number };

function getDates(): timesType {
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
export class TitleListComponent implements OnDestroy {
	public now: number = Date.now() / 1000;
	private sub;
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
	public friendlyNames: { [key in coarseTimeGroupKeys]: string } = {
		"past": "Past",
		"now": "Now",
		"next": "Next",
		"tomorrow": "Tomorrow",
		"nextWeek": "Next Week",
		"nextMonth": "Next Month"
	};

	@Input() public set filteredEntries(filteredEntries: Map<title, GridEntry[]>) {
		const times = getDates();
		this.now = times.now;
		this.coarseTimeGroups = this.reGroup(filteredEntries, times);
	}
	public reGroup(filteredEntries: Map<string, GridEntry[]>, times: timesType) {
		const defaultTimeGroups = {
			past: new Map<start, Map<title, GridEntry[]>>(),
			now: new Map<start, Map<title, GridEntry[]>>(),
			next: new Map<start, Map<title, GridEntry[]>>(),
			tomorrow: new Map<start, Map<title, GridEntry[]>>(),
			nextWeek: new Map<start, Map<title, GridEntry[]>>(),
			nextMonth: new Map<start, Map<title, GridEntry[]>>()
		};
		if (filteredEntries) {
			const coarseTimeGroups = [...filteredEntries.entries()].reduce((prev, [title, entryList]) => {
				let coarseTimeGroup = this.getCoarseTimeGroup(prev, entryList, times);

				const fineTimeGroup = coarseTimeGroup.get(entryList[0].start);
				if (fineTimeGroup) {
					fineTimeGroup.set(title, entryList)
				}
				else {
					coarseTimeGroup.set(entryList[0].start, new Map([[title, entryList]]))
				}
				return prev;
			}, defaultTimeGroups);
			return coarseTimeGroups
		}
		return defaultTimeGroups;
	}

	private getCoarseTimeGroup(
		prev: {
			[key in coarseTimeGroupKeys]: Map<start, Map<title, GridEntryLite[]>>
		},
		entryList: GridEntryLite[],
		times: {
			now: number;
			tomorrow: number;
			nextWeek: number;
			nextMonth: number;
		}
	) {
		let coarseTimeGroup = prev.nextMonth;
		if (entryList[0].stop < times.now) {
			coarseTimeGroup = prev.past;
		}
		else if (entryList[0].start <= times.now) {
			coarseTimeGroup = prev.now;
		}
		else if (times.now <= entryList[0].start && entryList[0].start < times.tomorrow) {
			coarseTimeGroup = prev.next;
		}
		else if (times.tomorrow <= entryList[0].start && entryList[0].start < times.nextWeek) {
			coarseTimeGroup = prev.tomorrow;
		}
		else if (times.nextWeek <= entryList[0].start && entryList[0].start < times.nextMonth) {
			coarseTimeGroup = prev.nextWeek;
		}
		return coarseTimeGroup;
	}

	@Input() public lastignoredcount: number = 0;
	@Output() public selectedEntry: EventEmitter<GridEntry[]> = new EventEmitter();

	public track(index: number, entry: GridEntry[]) {
		return entry[0].title
	}
	public tapped?: string;

	public ignoreListNames: Array<{ name: "Recorded" | "Garbage" | "Meh", icon: string }> = [
		{ name: "Recorded", icon: "task_alt" },
		{ name: "Garbage", icon: "paid" },
		{ name: "Meh", icon: "star_half" },
	];

	constructor(private ignoreService: IgnoreListService) {
		this.sub = timer(1000, 1000).subscribe(() => {
			const times = getDates();
			this.now = times.now;
			this.a(this.coarseTimeGroups, times);
		});
	}

	public a(coarseTimeGroups: {
		[key in coarseTimeGroupKeys]: Map<start, Map<title, GridEntryLite[]>>
	}, times: {
		now: number;
		tomorrow: number;
		nextWeek: number;
		nextMonth: number;
	}) {
		// move now entries that have past to past.
		outer: for (let [coarseTimeGroupNowKey, titleEntryListMap] of coarseTimeGroups.now.entries()) {
			inner: for (let [title, entryList] of titleEntryListMap) {
				let pastEntries = [];
				while(entryList.length && entryList[0].stop < times.now){
					pastEntries.push(entryList.shift() as GridEntryLite);
				}
				if (pastEntries.length) {
					titleEntryListMap.delete(title);
					if (titleEntryListMap.size === 0) {
						coarseTimeGroups.now.delete(coarseTimeGroupNowKey);
					}
					if (entryList.length !== 0) {
						const newCoarseTimeGroup = this.getCoarseTimeGroup(coarseTimeGroups, entryList, times);
						const newCTGGroup = newCoarseTimeGroup.get(entryList[0].start);
						if (newCTGGroup) {
							newCTGGroup.set(title, entryList)
						}
						else {
							newCoarseTimeGroup.set(entryList[0].start, new Map([[title, entryList]]));
						}

					}
					let timegroup = coarseTimeGroups.past.get(pastEntries[0].start);
					if (timegroup) {
						const entryGroup = timegroup.get(pastEntries[0].title || "");
						if (entryGroup) {
							entryGroup.push(pastEntries[0]);
						}
						else {
							timegroup.set(pastEntries[0].title || "", pastEntries)
						}
					}
					else {
						timegroup = new Map([[pastEntries[0].title || "", pastEntries]]);
						coarseTimeGroups.past.set(pastEntries[0].start, timegroup);
					}
				}
			}
		}
		const later: coarseTimeGroupKeys[] = ["next", "tomorrow", "nextWeek", "nextMonth"];
		for (let coarseTimeKey of later) {
			const group = coarseTimeGroups[coarseTimeKey];
			for (let [coarseTimeGroupLaterKey, entryMap] of group.entries()) {
				const newCoarseTimeGroup = this.getCoarseTimeGroup(coarseTimeGroups, [{ start: coarseTimeGroupLaterKey, stop: coarseTimeGroupLaterKey + 1 }], times);
				if (newCoarseTimeGroup !== group) {
					group.delete(coarseTimeGroupLaterKey);

					const g = newCoarseTimeGroup.get(coarseTimeGroupLaterKey);
					if(g){
						newCoarseTimeGroup.set(coarseTimeGroupLaterKey, new Map([...g, ...entryMap]));
					}
					else{
						newCoarseTimeGroup.set(coarseTimeGroupLaterKey, entryMap);
					}
				}
				else {
					continue;
				}
			}
		}
	}

	public ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	public mouseenter(event: GridEntry[]) {
		if (!this.tapped)
			this.selectedEntry.emit(event);
	}
	public click(event: GridEntry[]) {
		if (this.tapped == event[0].title) {
			this.tapped = undefined;
		}
		else {
			this.tapped = event[0].title;
			this.selectedEntry.emit(event);
		}
	}
	public ignore(entry: ignoreEntry, listName: listNames) {
		this.ignoreService.ignore(entry, listName);
	}
	public ignoreTitle(title: string | undefined, listName: listNames) {
		if (title)
			this.ignoreService.ignoreTitle(title, listName);
	}
	public ignoreChanelName(channelName: string, listName: listNames) {
		this.ignoreService.ignoreChanelName(channelName, listName);
	}

	public coarseTimeGroupOrder(a: KeyValue<coarseTimeGroupKeys, any>, b: KeyValue<coarseTimeGroupKeys, any>) {
		const keySortOrder: coarseTimeGroupKeys[] = [
			"past", "now", "next", "tomorrow", "nextWeek", "nextMonth"
		];
		return keySortOrder.indexOf(a.key) - keySortOrder.indexOf(b.key);
	}
	public fineTimeGroupOrder(a: KeyValue<string, GridEntry[]>, b: KeyValue<string, GridEntry[]>) {
		if (a.value[0].start === b.value[0].start) {
			const channel_a = (a.value[0].channelNumber || "0").split(".");
			const channel_b = (b.value[0].channelNumber || "0").split(".");
			if (channel_a[0] === channel_b[0]) {
				return (parseInt(channel_a[1]) || -1) - (parseInt(channel_b[1]) || -1);
			}
			return parseInt(channel_a[0]) - parseInt(channel_b[0]);
		}
		return a.value[0].start - b.value[0].start;
	}
}