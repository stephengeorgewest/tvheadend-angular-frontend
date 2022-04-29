import { Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { DiskUsageService } from 'src/app/disk-usage/disk-usage.service';
import { GuardService } from 'src/app/guard.service';
import { DvrService } from '../dvr/dvr.service';

import { environment } from 'src/environments/environment';
import { cometMessage } from './responsemodel';
import { EpgService } from '../epg/epg.service';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService implements OnDestroy  {
	private websocket!: WebSocket;
	private boxid: string | null;

	constructor(
		private guardService: GuardService,
		private authenticationService: AuthenticationService,
		private diskUsageService: DiskUsageService,
		private epgService: EpgService,
		private dvrService: DvrService,
	) {
		this.boxid = localStorage.getItem("boxid");
		this.createWebSocket();

		this.authenticationService.authentication.subscribe(a =>{
			this.websocket.close();
			this.boxid = null;
			this.createWebSocket();
		});
	}
	ngOnDestroy(): void {
		this.websocket.close();
	}
	private createWebSocket(){
		const url = "ws" + environment.server.secure + "://" + environment.server.host + ":" + environment.server.port + "/comet/ws" + (this.boxid ? '?boxid=' + this.boxid : "");
		this.websocket = new WebSocket(url);
		this.websocket.onmessage = (m) => this.onMessage(m);
		this.websocket.onerror = (e) => {console.log(e)};
	}

	private onMessage(message: MessageEvent<any>) {
		const data = JSON.parse(message.data) as cometMessage;
		let dvr_uuids_to_reload: Set<string> = new Set();
		let dvr_uuids_to_delete: Set<string> = new Set();
		let epg_id_to_reload: Set<string> = new Set();
		let epg_id_to_delete: Set<string> = new Set();
		let services_to_reload: Set<string> = new Set();
		if(data.boxid){
			this.boxid = data.boxid;
			localStorage.setItem("boxid", this.boxid);
		}
		data.messages.forEach(m => {
			if ("reload" in m) {
				if (m.reload)
					switch (m.notificationClass) {
						case "dvrentry":
							services_to_reload.add(m.notificationClass);
							break;
						default:
							console.log("unhandled reload message", m)
					}
			}
			else {
				switch (m.notificationClass) {
					case "epg":
						if (m.delete)
							m.delete.forEach(epg_id_to_delete.add, epg_id_to_delete);
						if (m.update)
							m.update.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.create)
							m.create.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.dvr_delete)
							m.dvr_delete.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.dvr_update)
							m.dvr_update.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.dvr_create)
							m.dvr_create.forEach(epg_id_to_reload.add, epg_id_to_reload);
						break;
					case "dvrentry":
						if (m.delete)
							m.delete.forEach(dvr_uuids_to_delete.add, dvr_uuids_to_delete);

						if (m.update)
							m.update.forEach(dvr_uuids_to_reload.add, dvr_uuids_to_reload);
						if (m.create)
							m.create.forEach(dvr_uuids_to_reload.add, dvr_uuids_to_reload);
						if (m.change)
							m.change.forEach(dvr_uuids_to_reload.add, dvr_uuids_to_reload);
						break;
					case "diskspaceUpdate":
						this.diskUsageService.setDiskUsage({
							totaldiskspace: m.totaldiskspace,
							useddiskspace: m.useddiskspace,
							freediskspace: m.freediskspace
						});
						break;
					case "accessUpdate":
						if(m.totaldiskspace && m.useddiskspace && m.freediskspace)
						this.diskUsageService.setDiskUsage({
							totaldiskspace: m.totaldiskspace,
							useddiskspace: m.useddiskspace,
							freediskspace: m.freediskspace
						});
						this.guardService.setGuardData({dvr: !!m.dvr, admin: !!m.admin});
						console.log("unhandlede access update message bits", m);
						break;
					default:
						console.log("unhandlede message", m);
				}
			}
		});

		this.epgService.deleteEpg([...epg_id_to_delete].map((id) => parseInt(id)));
		this.epgService.refreshEpgByUUID(
			[...dvr_uuids_to_reload, ...dvr_uuids_to_delete],
			[...epg_id_to_reload].map((id) => parseInt(id)),
		);

		this.dvrService.refreshByUUID(dvr_uuids_to_reload, dvr_uuids_to_delete);
	}
}
