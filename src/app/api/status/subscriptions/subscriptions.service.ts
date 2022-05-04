import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication.service';
import { fetchData } from '../../util';
import { Subscription, SubscriptionsResponse } from './responsemodel';

@Injectable({
	providedIn: 'root'
})
export class SubscriptionsService {
	private subscriptionsResponse: BehaviorSubject<SubscriptionsResponse | undefined> = new BehaviorSubject<SubscriptionsResponse | undefined>(undefined);
	public onSubscriptionsResponse(){
		return this.subscriptionsResponse.asObservable();
	}

	constructor(
		private authenticationService: AuthenticationService,
	) { }

	public getSubscriptions() {
		fetchData("status/subscriptions", {}, this.authenticationService.authenticationValue.basic).then((data: SubscriptionsResponse) => this.subscriptionsResponse.next(data));
	}
	public refreshIfLoaded(){
		if(this.subscriptionsResponse.value)
			this.getSubscriptions();
	}
	public update(subscriptions: Subscription[]){
		const entries = this.subscriptionsResponse.value?.entries || [];
		subscriptions.forEach(s => {
			const matchingIndex = entries.findIndex(e => e.id === s.id);
			if(matchingIndex !== -1)
				entries.push(s);
			else
				entries[matchingIndex] = s;
		});
		this.subscriptionsResponse.next({
			total: entries.length,
			entries: entries
		})
	}
}
