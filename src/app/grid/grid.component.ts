import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import example from "../api/epg/events/grid/exampleresponse.json";
import { GridRequest } from '../api/epg/events/grid/requestmodel';
import { GridEntry, GridResponse } from '../api/epg/events/grid/responsemodel';

const halfHour = 30*60;
const hour = 60*60;
	type listNames = "Recorded" | "Garbage" | "Meh";
	type ignoreEntry = { channelName?: string, title?: string };
@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
	private entries: GridEntry[] = example.entries as GridEntry[];
	public totalCount: number = example.totalCount;
	public filteredEntries: Map<string, GridEntry[]> = new Map();
	public selectedEntry: GridEntry[] = [];
	public lastignoredcount = 0;
	public totalIgnored = 0;
	public filterLength: "short" | "medium" | "long" | undefined = "long";
	public episodic: boolean | undefined = false;

	public ignoreListNames: Array<listNames> = ["Recorded" , "Garbage" , "Meh"];
	public ignoreLists: {[key in listNames]: Array<ignoreEntry>} = {"Recorded": [] , "Garbage": [], "Meh": []};
	constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
		const l = localStorage.getItem("ignoreLists");
		if(l){
			this.ignoreLists = JSON.parse(l) as {[key in listNames]: Array<ignoreEntry>};
		}
		this.filterAll();
	}

	ngOnInit(): void {
		//this.filterAll();
	}

	public ignoreChanelName(channelName: string, listName: listNames) {
		const ignoreset = this.ignoreLists[listName];
		if (!ignoreset.some(i => i.channelName === channelName)) {
			ignoreset.push({ channelName });
			this.filterNew();
			this.setStorage();
		}
	}

	public ignoreTitle(title: string, listName: listNames) {
		const ignoreset = this.ignoreLists[listName];
		if (!ignoreset.some(i => i.title === title)) {
			ignoreset.push({ title });
			this.filterNew();
			this.setStorage();
		}
	}

	public ignore(entry: ignoreEntry, listName: listNames) {
		const ignoreset = this.ignoreLists[listName];
		if (!ignoreset.some(i => i.channelName === entry.channelName && i.title === entry.title)) {
			ignoreset.push({ title: entry.title, channelName: entry.channelName });
			this.filterNew();
			this.setStorage();
		}
	}
	public moveEntry(entry: ignoreEntry, to: listNames){
		this.ignoreLists[to].push(entry);
		this.deleteFromAnyList(entry, to);
		this.setStorage();
	}

	private deleteFromAnyList(entry: ignoreEntry, listName: listNames) {
		const p = new ListNamesFilterPipe();
		p.transform(this.ignoreListNames, listName).every(l => 
			this.delete(entry, this.ignoreLists[l])
		);
		
		this.filterAll();
		this.setStorage();
	}
	private delete(entry: ignoreEntry, list:ignoreEntry[]){
		const found = list.findIndex(i => i.channelName && i.title ? 
			i.channelName === entry.channelName && i.title === entry.title
				:i.channelName ?
					i.channelName === entry.channelName
					:i.title === entry.title);
		if(found){
			list.splice(found, 1);
		}
		return !!found;
	}
	public deleteFromList(entry: ignoreEntry, list:ignoreEntry[]){
		this.delete(entry,list);
		this.filterAll();
		this.setStorage();
	}
	private setStorage(){
		localStorage.setItem("ignoreLists", JSON.stringify(this.ignoreLists));
	}

	private filterNew(){
		const count = this.length(this.filteredEntries);

		for(let k of this.filteredEntries.keys()) {
			if(
				this.ignoreLists.Garbage.some(i => k === i.title) ||
				this.ignoreLists.Meh.some(i =>  k === i.title) ||
				this.ignoreLists.Recorded.some(i =>  k === i.title)
			){
				this.filteredEntries.delete(k);
			} else {
				const li = this.filteredEntries.get(k);
				li?.filter(this.filter1, this);
				if(li?.length ===  0){
					this.filteredEntries.delete(k);
				}
			}
		}
		this.lastignoredcount = count - this.length(this.filteredEntries);
		this.totalIgnored = this.entries.length - this.length(this.filteredEntries);
		this._snackBar.open(this.lastignoredcount + "");
	}
	public filterAll() {
		this.filter(this.entries);
	}
	private filter(list:GridEntry[]) {
		const count = this.length(this.filteredEntries);

		this.filteredEntries = list.reduce((prev, entry) => {
			if(this.filter1(entry)){
				const l = prev.get(entry.title);
				if(l){
					l.push(entry);
				}
				else {
					prev.set(entry.title, [entry]);
				}
			}
			return prev;
		}, new Map<string, GridEntry[]>());
		this.lastignoredcount = count - this.length(this.filteredEntries);
		this.totalIgnored = this.entries.length - this.length(this.filteredEntries);
		this._snackBar.open(this.lastignoredcount + "");
	}
	private length(a: Map<string, GridEntry[]>){
		return Array.from(a.values()).reduce((prev, cur)=> {return prev + cur.length}, 0);
	}
	private filter1(e: GridEntry): boolean {
			if (this.filterLength){
				const length = e.stop - e.start;
				switch (this.filterLength) {
					case "short":
						if(length >= halfHour)
							return false;
						break;
					case "long":
						if(length <= hour)
							return false;
						break;
					case "medium":
						if(length < halfHour || length > hour)
							return false;
						break;
				}
			}

			if(!(this.episodic === undefined)) {
				if(this.episodic && e.episodeNumber === undefined)
					return false;
				else if(!this.episodic && e.episodeNumber !== undefined)
					return false;
			}

			return !(
				this.ignoreLists.Garbage.some(i => this.ignore1(i, e)) ||
				this.ignoreLists.Meh.some(i => this.ignore1(i, e)) ||
				this.ignoreLists.Recorded.some(i => this.ignore1(i, e))
			);
	}
	private ignore1(i: ignoreEntry, e: GridEntry): boolean{
		const match_both = (i.channelName && i.title) && e.channelName === i.channelName && e.title === i.title;
		const match_channel = ((i.channelName) && e.channelName === i.channelName);
		const match_title = ((i.title) && e.title === i.title);
		return match_title || match_channel || match_both || false;
	}

	public options: GridRequest = { sort: "dir", dir: "ASC", duplicates: 0, start: 0, limit: 300 };
	public servers = ["dell-dm051", "ao751h.lan"];
	public selectedServer = this.servers[0];
	public errors: any = undefined;

	public httppost() {
		this.errors = undefined;
		//https://stackoverflow.com/questions/50594372/angular-dont-send-content-type-request-header
		//Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://dell-dm051:9981/api/epg/events/grid. (Reason: header ‘content-type’ is not allowed according to header ‘Access-Control-Allow-Headers’ from CORS preflight response).
		this.http.post<GridResponse>(
			'http://' + this.selectedServer + ':9981/api/epg/events/grid',
			this.getOptions(), { headers: {} }
		)
			.subscribe(d => this.entries = d.entries, errors => this.errors = errors);

	}
	public fetch() {
		fetch('http://' + this.selectedServer + ':9981/api/epg/events/grid', {
			body: this.getOptions(),
			method: 'POST',
			mode: 'cors',
			headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
		}).then(response => response.json()).then(data => { this.entries = data.entries; this.totalCount = data.totalCount; this.filteredEntries = new Map(); this.filterAll() });
	}
	private getOptions() {
		return Object.entries(this.options).reduce((prev, current, index) => (prev + index ? "" : "&") + current[0] + "=" + current[1], "");
	}
}

@Pipe({
    name: 'listNamesfilter',
    pure: false
})
export class ListNamesFilterPipe implements PipeTransform {
    transform(items: listNames[], filter: listNames): listNames[] {
        return items.filter(item => item !== filter);
    }
}

@Pipe({
    name: 'newDate',
    pure: false
})
export class NewDatePipe implements PipeTransform {
    transform(seconds: number): Date {
        return new Date(seconds);
    }
}