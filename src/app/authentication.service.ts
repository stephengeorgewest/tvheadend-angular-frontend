import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type GuardData = {
	"dvr": boolean,
	"admin": boolean
};

const guardDataKey = "guardData";

type authenticationData = {
	username: string | undefined;
	socketusername: string | undefined;
	basic: string | undefined;
}
const authenticationDataKey = "authenticationData"
@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private guardSubject: BehaviorSubject<GuardData>;
	public guardChanges: Observable<GuardData>;

	public setGuardData(data: GuardData, username?: string) {
		if (username !== undefined) {
			const v = this.authenticationValue;
			if( v.socketusername !== username) {
				this.authenticationSubject.next({
					username: v.username,
					socketusername: username,
					basic: v.basic
				});
				localStorage.setItem(authenticationDataKey, JSON.stringify(this.authenticationValue));
			}
		}

		if (this.guardSubject.value.admin !== data.admin || this.guardSubject.value.dvr !== data.dvr){
			this.guardSubject.next(data);
			localStorage.setItem(guardDataKey, JSON.stringify(data));
		}
	}

	private authenticationSubject: BehaviorSubject<authenticationData>;
	public authentication: Observable<authenticationData>;
	public get authenticationValue(): authenticationData {
		return this.authenticationSubject.value;
	}

	public setAuthentication(username: string, password: string){
		const v = this.authenticationValue;
		const basic = window.btoa(username + ":" + password);
		if(v.username !== username || v.basic !== basic){
			this.authenticationSubject.next({
				username: username,
				basic: basic,
				socketusername: v.socketusername
			});
			localStorage.setItem(authenticationDataKey, JSON.stringify(this.authenticationValue));
		}

	}

	constructor() {
		const guardjson = localStorage.getItem(guardDataKey);
		const guarddata = guardjson && guardjson !== 'undefined' ? JSON.parse(guardjson) as GuardData : undefined;
		this.guardSubject = new BehaviorSubject<GuardData>({
			dvr: guarddata?.dvr || false,
			admin: guarddata?.admin || false
		});
		this.guardChanges = this.guardSubject.asObservable();

		const authenticationjson = localStorage.getItem(authenticationDataKey);
		const authenticationData = authenticationjson && authenticationjson !== 'undefined' ? JSON.parse(authenticationjson) as authenticationData : undefined;
		this.authenticationSubject = new BehaviorSubject<authenticationData>({
			username: authenticationData?.username,
			basic: authenticationData?.basic,
			socketusername: authenticationData?.socketusername
		});
		this.authentication = this.authenticationSubject.asObservable();
	}
}
