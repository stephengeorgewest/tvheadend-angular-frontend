import { Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { DiskUsageService } from 'src/app/disk-usage/disk-usage.service';
import { DvrService } from '../dvr/dvr.service';

import { environment } from 'src/environments/environment';
import { cometMessage } from './responsemodel';
import { EpgService } from '../epg/epg.service';
import { Input } from '../status/inputs/responsemodel';
import { InputsService } from '../status/inputs/inputs.service';
import { Subscription } from '../status/subscriptions/responsemodel';
import { SubscriptionsService } from '../status/subscriptions/subscriptions.service';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
	private websocket!: WebSocket;
	private boxid: string | null;
	private authenticationSubscription;
	private authusername: string | undefined;

	constructor(
		private authenticationService: AuthenticationService,
		private diskUsageService: DiskUsageService,
		private epgService: EpgService,
		private dvrService: DvrService,
		private inputsService: InputsService,
		private subscriptionsService: SubscriptionsService
	) {
		this.boxid = localStorage.getItem("boxid");
		this.createWebSocket();
		this.authusername = this.authenticationService.authenticationValue.username;
		this.authenticationSubscription = this.authenticationService.authentication.subscribe(d => {
			if (d.username !== this.authusername) {
				this.authusername = d.username;
				this.reload();
			}
		});
	}
	public reload() {
		this.websocket.close();
		this.boxid = null;
		this.createWebSocket();
	}
	ngOnDestroy(): void {
		this.websocket.close();
		this.authenticationSubscription.unsubscribe();
	}
	private createWebSocket() {
		const url = "ws" + environment.server.secure + "://" + environment.server.host + ":" + environment.server.port + "/comet/ws" + (this.boxid ? '?boxid=' + this.boxid : "");
		this.websocket = new WebSocket(url);
		this.websocket.onmessage = (m) => this.onMessage(m);
		this.websocket.onerror = (e) => { console.log(e) };
	}

	private onMessage(message: MessageEvent<any>) {
		const data = JSON.parse(message.data) as cometMessage;
		let dvr_uuids_to_reload: Set<string> = new Set();
		let dvr_uuids_to_delete: Set<string> = new Set();
		let epg_id_to_reload: Set<string> = new Set();
		let epg_id_to_delete: Set<string> = new Set();
		let services_to_reload: Set<"dvrentry" | "input_status" | "subscriptions"/* TODO: reloadMessage->notificationClass */> = new Set();
		let input_status_to_update: Map<string, Input> = new Map();
		let subcriptions_to_update: Map<number, Subscription> = new Map();

		if (data.boxid) {
			this.boxid = data.boxid;
			localStorage.setItem("boxid", this.boxid);
		}
		data.messages.forEach(m => {
			if ("reload" in m) {
				switch (m.notificationClass) {
					case "dvrentry":
						services_to_reload.add(m.notificationClass);
						break;
					case "input_status":
						services_to_reload.add(m.notificationClass);
						break;
					case "subscriptions":
						services_to_reload.add(m.notificationClass);
						break;
					default:
						console.log("unhandled reload message", m)
				}
			}
			else if("updateEntry" in m){
				subcriptions_to_update.set(m.id, m);
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
					case "input_status":
						if (m.update) {
							input_status_to_update.set(m.uuid, m);
						}
						break;
					case "diskspaceUpdate":
						this.diskUsageService.setDiskUsage({
							totaldiskspace: m.totaldiskspace,
							useddiskspace: m.useddiskspace,
							freediskspace: m.freediskspace
						});
						break;
					case "accessUpdate":
						if (m.totaldiskspace && m.useddiskspace && m.freediskspace)
							this.diskUsageService.setDiskUsage({
								totaldiskspace: m.totaldiskspace,
								useddiskspace: m.useddiskspace,
								freediskspace: m.freediskspace
							});
						this.authenticationService.setGuardData({ dvr: !!m.dvr, admin: !!m.admin }, m.username);
						console.log("unhandlede access update message bits", m);
						break;
					default:
						console.log("unhandlede message", m);
				}
			}
		});

		// Push data out to services. ensure updates happnen before reloads.
		this.epgService.deleteEpg([...epg_id_to_delete].map((id) => parseInt(id)));
		this.dvrService.clearFromServiceByUUID(dvr_uuids_to_delete);
		this.inputsService.update([...input_status_to_update.values()]);
		this.subscriptionsService.update([...subcriptions_to_update.values()]);

		//Reloads ensure they happen after updates
		this.epgService.refreshEpgByUUID(
			[...dvr_uuids_to_reload, ...dvr_uuids_to_delete],
			[...epg_id_to_reload].map((id) => parseInt(id)),
		);

		if (dvr_uuids_to_reload.size && !services_to_reload.has("dvrentry"))
			this.dvrService.refreshIfLoaded(dvr_uuids_to_reload);// TODO? more specific like epg

		for (let service of services_to_reload.values()) {
			switch (service) {
				case "dvrentry":
					this.dvrService.refreshIfLoaded();
					break;
				case "input_status":
					this.inputsService.refreshIfLoaded();
					break;
				case "subscriptions":
					this.subscriptionsService.refreshIfLoaded();
					break;
				default:
					console.log("unhandled reload message:", service);
			}
		}
	}
}
