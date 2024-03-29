import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { APP_CONFIG, AppConfig } from 'src/app/app.config';
import { EpgService } from '../epg/epg.service';
import { GridEntry } from '../epg/events/grid/responsemodel';
import { DeleteBydvrUUIDRequest } from '../idnode/delete/requestmodel';
import { idnodeLoadRequest } from '../idnode/load/request';
import { idnodeLoadResponse } from '../idnode/load/response';
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
		private epgService: EpgService,
		@Inject(APP_CONFIG) private config: AppConfig
	) { }

	public createByEvent(options: CreateByEventRequest) {
		return fetchData(this.config, "dvr/entry/create_by_event", options).then(response => {
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
		return fetchData(this.config, "dvr/entry/stop", options);
	}
	private options: GridUpcomingRequest = { sort: "start_real", dir: "ASC", duplicates: 0 };
	public refreshGridUpcoming(options?: GridUpcomingRequest) {
		if (options) this.options = options;
		fetchData(this.config, 'dvr/entry/grid_upcoming', this.options).then((data: GridUpcomingResponse) => {
			this.gridUpcomingResponse = data;
			this.gridUpcomingSubject.next(this.gridUpcomingResponse)
		});
	};

	public deleteIdNode(options: DeleteBydvrUUIDRequest) {
		return fetchData(this.config, "idnode/delete", options);
	}

	private gridFinishedResponse: GridUpcomingResponse | undefined = undefined;
	private gridFinishedSubject: BehaviorSubject<GridUpcomingResponse | undefined> = new BehaviorSubject(this.gridFinishedResponse);
	public onGridFinishedResponse(): Observable<GridUpcomingResponse | undefined> {
		return this.gridFinishedSubject.asObservable();
	}
	public refreshGridFinished() {
		fetchData(this.config,
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
	private gridUpdateSubject: Subject<idnodeLoadResponse> = new Subject();
	public onGridUpdateResponse(): Observable<idnodeLoadResponse> {
		return this.gridUpdateSubject.asObservable();
	}
	public refreshIfLoaded(dvr_to_reload?: Set<string>) {
		if (dvr_to_reload?.size) {
			const request: idnodeLoadRequest = {uuid: [...dvr_to_reload], grid: "1", list: ["category","enabled","duplicate","disp_title","disp_extratext","episode_disp","channel","image","copyright_year","start_real","stop_real","duration","pri","filesize","sched_status","errors","data_errors","config_name","owner","creator","comment","genre","broadcast"]};
			fetchData(this.config,
				'idnode/load',
				{
					uuid: request.uuid,
					grid: request.grid,
					list: request.list.join(",")
				}
				).then(
					(data:idnodeLoadResponse) => {
						//console.log(data);
						this.gridUpdateSubject.next(data);
					}
				);
		} else {
			if (this.gridFinishedResponse)
				this.refreshGridFinished();
			if (this.gridUpcomingResponse)
				this.refreshGridUpcoming();

		}
	}
}
