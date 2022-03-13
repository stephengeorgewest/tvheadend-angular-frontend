import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ListNamesFilterPipe } from './list-name.pipe';

export type listNames = "Recorded" | "Garbage" | "Meh";
export type ignoreEntry = { channelName?: string, title?: string };
export type observableType = {type: modificationType, list: list};
export enum modificationType {
	new, delete, move
}
type list = { [key in listNames]: Array<ignoreEntry> };
@Injectable({
	providedIn: 'root'
})
export class IgnoreListService {
	public ignoreListNames: Array<listNames> = ["Recorded", "Garbage", "Meh"];
	public ignoreLists: list = { "Recorded": [], "Garbage": [], "Meh": [] };
	private ignoreList: Subject<observableType> = new Subject();


	onList(): Observable<observableType> {
		return this.ignoreList.asObservable();
	}

	constructor() {
		const l = localStorage.getItem("ignoreLists");
		if (l) {
			this.ignoreLists = JSON.parse(l) as { [key in listNames]: Array<ignoreEntry> };
		}
		this.ignoreList = new BehaviorSubject<observableType>({type: modificationType.new, list: this.ignoreLists});
	}

	public ignore(entry: ignoreEntry, listName: listNames) {
		const ignoreset = this.ignoreLists[listName];
		if (!ignoreset.some(i => i.channelName === entry.channelName && i.title === entry.title)) {
			ignoreset.push({ title: entry.title, channelName: entry.channelName });
			this.ignoreList.next({type: modificationType.new, list: this.ignoreLists});
			this.setStorage();
		}
	}

	public ignoreChanelName(channelName: string, listName: listNames) {
		const ignoreset = this.ignoreLists[listName];
		if (!ignoreset.some(i => i.channelName === channelName)) {
			ignoreset.push({ channelName });
			this.ignoreList.next({type: modificationType.new, list: this.ignoreLists});
			this.setStorage();
		}
	}

	public ignoreTitle(title: string, listName: listNames) {
		const ignoreset = this.ignoreLists[listName];
		if (!ignoreset.some(i => i.title === title)) {
			ignoreset.push({ title });
			this.ignoreList.next({type: modificationType.new, list: this.ignoreLists});
			this.setStorage();
		}
	}

	public moveEntry(entry: ignoreEntry, to: listNames) {
		this.ignoreLists[to].push(entry);
		this.deleteFromAnyList(entry, to);

		this.ignoreList.next({type: modificationType.delete, list: this.ignoreLists});
		this.setStorage();
	}

	private deleteFromAnyList(entry: ignoreEntry, listName: listNames) {
		const p = new ListNamesFilterPipe();
		p.transform(this.ignoreListNames, listName).every(l =>
			this.delete(entry, this.ignoreLists[l])
		);
	}

	public deleteFromList(entry: ignoreEntry, list: ignoreEntry[]) {
		this.delete(entry, list);
		this.ignoreList.next({type: modificationType.delete, list: this.ignoreLists});
		this.setStorage();
	}

	private delete(entry: ignoreEntry, list: ignoreEntry[]) {
		const found = list.findIndex(i => i.channelName && i.title ?
			i.channelName === entry.channelName && i.title === entry.title
			: i.channelName ?
				i.channelName === entry.channelName
				: i.title === entry.title);
		if (found) {
			list.splice(found, 1);
		}
		return !!found;
	}

	private setStorage() {
		localStorage.setItem("ignoreLists", JSON.stringify(this.ignoreLists));
	}
}
