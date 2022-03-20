import { Component, EventEmitter, Output } from '@angular/core';
import { GridUpcomingRequest } from 'src/app/api/dvr/entry/grid_upcoming/requestmodel';
import { GridUpcomingEntry, GridUpcomingResponse } from 'src/app/api/dvr/entry/grid_upcoming/responsemodel';
import { formEncode } from 'src/app/api/util';

@Component({
	selector: 'app-upcoming-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css']
})
export class GridUpcomingComponent {
	public entries: Map<string, GridUpcomingEntry[]> = new Map();
	public totalCount = 0;

	public selectedEntry: GridUpcomingEntry[] = [];
	
	constructor() { 
		this.fetch();
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

	public options: GridUpcomingRequest = { sort: "start_real", dir: "ASC", duplicates: 0 };
	public servers = ["dell-dm051", "ao751h.lan"];
	public selectedServer = this.servers[0];
	public errors: any = undefined;
/*
	public httppost() {
		this.errors = undefined;
		//https://stackoverflow.com/questions/50594372/angular-dont-send-content-type-request-header
		//Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://dell-dm051:9981/api/epg/events/grid. (Reason: header ‘content-type’ is not allowed according to header ‘Access-Control-Allow-Headers’ from CORS preflight response).
		this.http.post<GridUpcomingResponse>(
			'http://' + this.selectedServer + ':9981/api/dvr/entry/grid_upcoming',
			formEncode(this.options), { headers: {} }
		)
			.subscribe(d => this.entries = d.entries, errors => this.errors = errors);

	}*/
	public fetch() {
		fetch('http://' + this.selectedServer + ':9981/api/dvr/entry/grid_upcoming', {
			body: formEncode(this.options),
			method: 'POST',
			mode: 'cors',
			headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
		}).then(response => response.json()).then(data => {
			this.entries = (data as GridUpcomingResponse).entries.reduce((prev, cur) => {
				const e = prev.get(cur.disp_title);
				if(e) e.push(cur);
				else prev.set(cur.disp_title, [cur]);
				return prev;
			}, new Map<string, GridUpcomingEntry[]>());
			this.totalCount = data.totalCount;
		});
	}
}
