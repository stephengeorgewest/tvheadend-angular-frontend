import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridRequest } from '../grid-request';
import { fetchData } from '../util';
import { GridEntry, GridResponse } from './events/grid/responsemodel';

@Injectable({
	providedIn: 'root'
})
export class EpgService {
	private epgGridResponse: GridResponse | undefined = undefined;
	private epgGridSubject: BehaviorSubject<GridResponse | undefined> = new BehaviorSubject(this.epgGridResponse);
	public onEpgGridResponse(): Observable<GridResponse | undefined> {
		return this.epgGridSubject.asObservable();
	}

	public updateRecordingUuidByEventId(uuid: string[], event_id: number) {
		uuid.forEach(u => {
			const entry = this.epgGridResponse?.entries.find(e => event_id === e.eventId);
			if (entry)
				entry.dvrUuid = u;
		});
		this.epgGridSubject.next(this.epgGridResponse);
	}

	public deleteEpg(epg_id_to_delete: number[]) {
		if (this.epgGridResponse) {
			this.epgGridResponse.entries = this.epgGridResponse?.entries.filter(e => !epg_id_to_delete.some(id => e.eventId === id));
		}
	}

	public refreshEpgByUUID(uuids: string[], additional?: number[]) {
		const refreshable = this.epgGridResponse?.entries.filter(e => e.dvrUuid && uuids.indexOf(e.dvrUuid) !== -1).map(e => e.eventId) ?? [];

		if (additional)
			refreshable.push(...additional);
		if (refreshable.length) {
			this.refreshEpgEvents(refreshable);
		}
	}

	public refreshEpgEvents(eventIDs: number[] | number) {
		fetchData("epg/events/load", { eventId: eventIDs }).then((data: GridResponse) => {
			//? refreshable = !!eventIDs.length
			let refreshable = false;
			data.entries.forEach(e => {
				if (!this.epgGridResponse) {
					this.epgGridResponse = {
						totalCount: 1,
						entries: [e]
					};
					refreshable = true;
				}
				else {
					const matchingEntry = this.epgGridResponse?.entries.findIndex(gridEntry => gridEntry.eventId === e.eventId);
					if (matchingEntry !== -1) {
						this.epgGridResponse.entries[matchingEntry] = e;
						refreshable = true;
					}
					else {
						// should never be hit, error instead?
						this.epgGridResponse.entries.push(e);
						this.epgGridResponse.totalCount++;
						refreshable = true;
					}
				}
			});
			if (refreshable)
				this.epgGridSubject.next(this.epgGridResponse);
		});
	}

	private epgOptions: GridRequest<GridEntry> = { dir: "ASC", duplicates: 0, start: 0, limit: 300 };
	public refreshEpgGrid(options?: GridRequest<GridEntry>) {
		if (options) {
			this.epgOptions = options;
		}
		fetchData('epg/events/grid', this.epgOptions).then(data => {
			this.epgGridResponse = data;
			this.epgGridSubject.next(this.epgGridResponse);
		});
	}
}
