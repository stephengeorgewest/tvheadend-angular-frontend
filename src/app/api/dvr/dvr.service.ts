import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EpgService } from '../epg/epg.service';
import { GridEntry } from '../epg/events/grid/responsemodel';
import { DeleteBydvrUUIDRequest } from '../idnode/delete/requestmodel';
import { fetchData } from '../util';
import { CreateByEventRequest } from './entry/create_by_event/requestmodel';
import { CreateByEventResponse } from './entry/create_by_event/responsemodel';
import { GridUpcomingRequest } from './entry/grid_upcoming/requestmodel';
import { GridUpcomingResponse } from './entry/grid_upcoming/responsemodel';
import { StopBydvrUUIDRequest } from './entry/stop/requestmodel';

@Injectable({
	providedIn: 'root'
})
export class DvrService {
	constructor(
		private epgService: EpgService
	) { }
	public createByEvent(options: CreateByEventRequest) {
		return fetchData("dvr/entry/create_by_event", options).then(response => {
			const eventResponse = response as CreateByEventResponse;// todo validation?
			this.epgService.updateRecordingUuidByEventId(eventResponse.uuid, options.event_id);
		});
	}

	public stopByGridEntry(options: Pick<GridEntry, "dvrUuid" | "eventId">) {
		if (!options.dvrUuid) {
			return Promise.reject(() => "error");
		}
		return this.stopBydvrUUID({ uuid: options.dvrUuid });
	}

	private gridUpcomingResponse: GridUpcomingResponse | undefined = undefined;
	private gridUpcomingSubject: BehaviorSubject<GridUpcomingResponse | undefined> = new BehaviorSubject(this.gridUpcomingResponse);
	public onGridUpcomingResponse(): Observable<GridUpcomingResponse | undefined> {
		return this.gridUpcomingSubject.asObservable();
	}
	public stopBydvrUUID(options: StopBydvrUUIDRequest) {
		return fetchData("dvr/entry/stop", options);
	}
	private options: GridUpcomingRequest = { sort: "start_real", dir: "ASC", duplicates: 0 };
	public refreshGridUpcoming(options?: GridUpcomingRequest) {
		if (options) this.options = options;
		fetchData('dvr/entry/grid_upcoming', this.options).then((data: GridUpcomingResponse) => {
			this.gridUpcomingResponse = data;
			this.gridUpcomingSubject.next(this.gridUpcomingResponse)
		});
	};

	public deleteIdNode(options: DeleteBydvrUUIDRequest) {
		return fetchData("idnode/delete", options);
	}

	private gridFinishedResponse: GridUpcomingResponse | undefined = undefined;
	private gridFinishedSubject: BehaviorSubject<GridUpcomingResponse | undefined> = new BehaviorSubject(this.gridFinishedResponse);
	public onGridFinishedResponse(): Observable<GridUpcomingResponse | undefined> {
		return this.gridFinishedSubject.asObservable();
	}
	public refreshGridFinished() {
		fetchData(
			'dvr/entry/grid_finished',
			{ start: 0, dir: "ASC", duplicates: 0, limit: 999999999 } as GridUpcomingRequest).then(
				data => {
					this.gridFinishedResponse = data;
					this.gridFinishedSubject.next(this.gridFinishedResponse);
				}
			);
	}

	public clearFromServiceByUUID(dvr_uuids_to_delete: Set<string>) {
		if (this.gridUpcomingResponse) {
			let refresh = false;
			dvr_uuids_to_delete.forEach(d => {
				const index = this.gridUpcomingResponse?.entries.findIndex(e => e.uuid === d) ?? -1;
				if (index !== -1) {
					this.gridUpcomingResponse?.entries.splice(index, 1);
					refresh = true;
				}
			});
			if (refresh)
				this.gridUpcomingSubject.next(this.gridUpcomingResponse);
		}
		if (this.gridFinishedResponse) {
			let refresh = false;
			dvr_uuids_to_delete.forEach(d => {
				const index = this.gridFinishedResponse?.entries.findIndex(e => e.uuid === d) ?? -1;
				if (index !== -1) {
					this.gridFinishedResponse?.entries.splice(index, 1);
					refresh = true;
				}
			});
			if (refresh)
				this.gridFinishedSubject.next(this.gridFinishedResponse);
		}
	}

	public refreshIfLoaded() {
		if (this.gridFinishedResponse)
			this.refreshGridFinished();
		if (this.gridUpcomingResponse)
			this.refreshGridUpcoming();
	}
}
