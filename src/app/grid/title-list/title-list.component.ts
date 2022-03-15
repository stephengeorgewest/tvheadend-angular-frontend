import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { ignoreEntry, IgnoreListService, listNames } from 'src/app/ignore-list.service';

type t = "past" | "now" | "next" | "tomorrow" | "nextWeek" | "nextMonth";
type t2 = Exclude<t, "past" | "next">;

function getDates(): { [key in t2]: number } {
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
	public grouped: {
		[key in t]: Map<string, GridEntry[]>
	} = {
			past: new Map<string, GridEntry[]>(),
			now: new Map<string, GridEntry[]>(),
			next: new Map<string, GridEntry[]>(),
			tomorrow: new Map<string, GridEntry[]>(),
			nextWeek: new Map<string, GridEntry[]>(),
			nextMonth: new Map<string, GridEntry[]>()
		};

	@Input() public set filteredEntries(filteredEntries: Map<string, GridEntry[]>) {
		this.grouped = [...filteredEntries.entries()].reduce((prev, [key, value]) => {
			if (value[0].stop < this.times.now) {
				prev.past.set(key, value);
			}
			else if (value[0].start <= this.times.now) {
				prev.now.set(key, value);
			}
			else if (this.times.now <= value[0].start && value[0].start < this.times.tomorrow) {
				prev.next.set(key, value);
			}
			else if (this.times.tomorrow <= value[0].start && value[0].start < this.times.nextWeek) {
				prev.tomorrow.set(key, value);
			}
			else if (this.times.nextWeek <= value[0].start && value[0].start < this.times.nextMonth) {
				prev.nextWeek.set(key, value);
			}
			else {
				prev.nextMonth.set(key, value);
			}
			return prev;
		}, {
			past: new Map<string, GridEntry[]>(),
			now: new Map<string, GridEntry[]>(),
			next: new Map<string, GridEntry[]>(),
			tomorrow: new Map<string, GridEntry[]>(),
			nextWeek: new Map<string, GridEntry[]>(),
			nextMonth: new Map<string, GridEntry[]>()
		});
	}
	@Input() public lastignoredcount: number = 0;
	@Output() public selectedEntry: EventEmitter<GridEntry[]> = new EventEmitter();

	public tapped: string = "";

	public ignoreListNames: Array<{name: "Recorded" | "Garbage"| "Meh", icon: string}>= [
		{name: "Recorded", icon: "task_alt"},
		{name: "Garbage", icon: "paid"},
		{name: "Meh", icon: "star_half"},
	];

	constructor(private ignoreService: IgnoreListService) { }

	public select(event: GridEntry[]){
		if(!this.tapped)
			this.selectedEntry.emit(event);
	}
	public tap(event: GridEntry[]){
		if(this.tapped == event[0].title){
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
	public groupOrder(a: KeyValue<t, Map<string, GridEntry[]>>, b: KeyValue<t, Map<string, GridEntry[]>>) {
		if (a.key === b.key)
			return 0;
		if (a.key === "past")
			return -1;
		return -1;
	}
	public otherOrder(a: KeyValue<string, GridEntry[]>, b: KeyValue<string, GridEntry[]>) {
		// if(a === b)
		return -1;
	}
}
