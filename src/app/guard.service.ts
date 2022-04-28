import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export type GuardKeys = "dvr"|"admin";
export type GuardData = {[key in GuardKeys]: boolean};
@Injectable({
	providedIn: 'root'
})
export class GuardService {
	private data = new BehaviorSubject({
		dvr: false,
		admin: false
	});
	public guardChanges: Observable<GuardData> = this.data.asObservable();
	public guard(which: GuardKeys){
		return this.data.value[which];
	}
	public setGuardData(data: {dvr: boolean; admin: boolean;}){
		if(this.data.value.admin !== data.admin || this.data.value.dvr !== data.dvr)
			this.data.next(data);
	}
}
