import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { GridResponse, GridEntry } from '../api/epg/events/grid/responsemodel';
import { ignoreEntry, IgnoreListService, listNames, modificationType } from '../ignore-list.service';
import { EpgService } from '../api/epg/epg.service';
import { EpgEventsGridRequest } from '../api/epg/events/grid/requestmodel';

const halfHour = 30 * 60;
const hour = 60 * 60;
@Component({
	selector: 'app-epg',
	templateUrl: './epg.component.html',
	styleUrls: ['./epg.component.css']
})
export class EpgComponent implements OnInit, OnDestroy {
	private entries: GridEntry[] = [];
	public totalCount: number = 0;
	public filteredEntries: Map<string, GridEntry[]> = new Map();
	public selectedEntry: GridEntry[] = [];
	public lastignoredcount = 0;
	public totalIgnored = 0;
	public filterLength: "short" | "medium" | "long" | undefined;
	public episodic: boolean | undefined;

	public ignoreListNames: Array<listNames> = ["Recorded", "Garbage", "Meh"];
	private ignoreLists: { [key in listNames]: Array<ignoreEntry> } = { "Recorded": [], "Garbage": [], "Meh": [] };

	private subscription: Subscription;
	constructor(
		private ignoreService: IgnoreListService,
		private epgService: EpgService
	) {
		this.epgService.onEpgGridResponse().subscribe(data => (this.refresh(data)));
		this.subscription = this.ignoreService.onList().subscribe((e) => {
			this.ignoreLists = e.list;
			switch (e.type) {
				case modificationType.delete:
					this.filterNew();
					break;
				case modificationType.new:
					this.filterAll();
			}
		});
	}

	ngOnInit(): void {
		if (!this.entries || !this.entries.length)
			this.refreshGrid();
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
	private selectedEntryTitle: string | undefined;
	public selectEntry(entryTitle: string | undefined) {
		this.selectedEntry = this.filteredEntries.get(entryTitle || "") || [];
		this.selectedEntryTitle = this.selectedEntry.length ? entryTitle : undefined;
	}

	private filterNew() {
		const count = this.length(this.filteredEntries);

		for (let k of this.filteredEntries.keys()) {
			if (
				this.ignoreLists.Garbage.some(i => k === i.title) ||
				this.ignoreLists.Meh.some(i => k === i.title) ||
				this.ignoreLists.Recorded.some(i => k === i.title)
			) {
				this.filteredEntries.delete(k);
			} else {
				const li = this.filteredEntries.get(k);
				li?.filter(this.filter1, this);
				if (li?.length === 0) {
					this.filteredEntries.delete(k);
				}
			}
		}
		this.lastignoredcount = count - this.length(this.filteredEntries);
		this.totalIgnored = this.entries.length - this.length(this.filteredEntries);

		this.selectEntry(this.selectedEntryTitle);
	}
	public filterAll() {
		this.filter(this.entries);

		this.selectEntry(this.selectedEntryTitle);
	}
	private filter(list: GridEntry[]) {
		const count = this.length(this.filteredEntries);

		this.filteredEntries = list.reduce((prev, entry) => {
			if (this.filter1(entry)) {
				const l = prev.get(entry.title || "");
				if (l) {
					l.push(entry);
				}
				else {
					prev.set(entry.title || "", [entry]);
				}
			}
			return prev;
		}, new Map<string, GridEntry[]>());
		this.lastignoredcount = count - this.length(this.filteredEntries);
		this.totalIgnored = this.entries.length - this.length(this.filteredEntries);
	}
	private length(a: Map<string, GridEntry[]>) {
		return Array.from(a.values()).reduce((prev, cur) => { return prev + cur.length }, 0);
	}
	private filter1(e: GridEntry): boolean {
		if (this.filterLength) {
			const length = e.stop - e.start;
			switch (this.filterLength) {
				case "short":
					if (length >= halfHour)
						return false;
					break;
				case "long":
					if (length <= hour)
						return false;
					break;
				case "medium":
					if (length < halfHour || length > hour)
						return false;
					break;
			}
		}

		if (!(this.episodic === undefined)) {
			if (this.episodic && e.episodeNumber === undefined)
				return false;
			else if (!this.episodic && e.episodeNumber !== undefined)
				return false;
		}

		return !(
			this.ignoreLists.Garbage.some(i => this.ignore1(i, e)) ||
			this.ignoreLists.Meh.some(i => this.ignore1(i, e)) ||
			this.ignoreLists.Recorded.some(i => this.ignore1(i, e))
		);
	}
	private ignore1(i: ignoreEntry, e: GridEntry): boolean {
		const match_both = (i.channelName && i.title) && e.channelName === i.channelName && e.title === i.title;
		const match_channel = ((i.channelName) && e.channelName === i.channelName);
		const match_title = ((i.title) && e.title === i.title);
		return match_title || match_channel || match_both || false;
	}

	public options: EpgEventsGridRequest = { dir: "ASC", duplicates: 0, start: 0, limit: 300 };
	public refreshGrid() {
		this.epgService.refreshEpgGrid(this.options);
	}
	public refresh(data: GridResponse | undefined) {
		if (data) {
			this.entries = data.entries;
			this.totalCount = data.totalCount;
			this.filteredEntries = new Map();
			this.filterAll();
		}
	}
}