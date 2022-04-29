import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { diskspaceBase } from '../api/ws/responsemodel';

@Injectable({
	providedIn: 'root'
})
export class DiskUsageService {
	private diskUsageSubject: BehaviorSubject<diskspaceBase | undefined> = new BehaviorSubject(undefined as diskspaceBase | undefined );
	public onDiskUsage() {
		return this.diskUsageSubject.asObservable();
	}
	public setDiskUsage(diskUsageResponse: diskspaceBase){
		this.diskUsageSubject.next(diskUsageResponse);
	}
}
 