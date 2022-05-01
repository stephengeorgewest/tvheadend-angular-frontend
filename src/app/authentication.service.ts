import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type GuardData = {
	"dvr": boolean,
	"admin": boolean
};

type accessData = GuardData & { username: string | undefined };

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private guardSubject: BehaviorSubject<GuardData>;
	public guardChanges: Observable<GuardData>;

	public setGuardData(data: accessData) {
		localStorage.setItem("guardData", JSON.stringify(data));
		if (data.username !== undefined) {
			this.authenticationSubject.next(data.username);
		}

		if (this.guardSubject.value.admin !== data.admin || this.guardSubject.value.dvr !== data.dvr)
			this.guardSubject.next(data);
	}

	private authenticationSubject: BehaviorSubject<string | undefined>;
	public authentication: Observable<string | undefined>;
	public get authenticationValue(): string | undefined {
		return this.authenticationSubject.value;
	}

	constructor() {
		const json = localStorage.getItem("guardData");
		const data = json ? JSON.parse(json) as accessData : undefined;
		if (data) {
			this.authenticationSubject = new BehaviorSubject<string | undefined>(data.username);
			this.guardSubject = new BehaviorSubject<GuardData>({
				dvr: data.dvr,
				admin: data.admin
			});
		} else {
			this.authenticationSubject = new BehaviorSubject<string | undefined>(undefined);
			this.guardSubject = new BehaviorSubject<GuardData>({
				dvr: false,
				admin: false
			});
		}

		this.authentication = this.authenticationSubject.asObservable();
		this.guardChanges = this.guardSubject.asObservable()
	}
}
