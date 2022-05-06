import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';
import { fetchData } from '../../util';
import { ConnectionsResponse } from './responsemodel';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {
	private connectionsResponse: BehaviorSubject<ConnectionsResponse | undefined> = new BehaviorSubject<ConnectionsResponse | undefined>(undefined);
	public get connectionsValue() {
		return this.connectionsResponse.value;
	}
	public onConnectionsResponse() {
		return this.connectionsResponse.asObservable();
	}

	constructor(
		private authenticationService: AuthenticationService,
	) { }

	public getConnections() {
		fetchData("status/connections", {
			//_dc: Date.now()
		}, this.authenticationService.authenticationValue.basic).then((data: ConnectionsResponse) => this.connectionsResponse.next(data));
	}
}
