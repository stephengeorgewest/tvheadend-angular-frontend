import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subscription as tvhSubscription } from 'src/app/api/status/subscriptions/responsemodel';
import { SubscriptionsService } from 'src/app/api/status/subscriptions/subscriptions.service';
import { idTrack } from 'src/app/util';

@Component({
	selector: 'app-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.css', '../status.css']
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
	public subscriptions: tvhSubscription[] = [];
	private subcriptionsResponseSubs: Subscription |undefined;
	public idTrack = idTrack;
	constructor(private subscriptionsService: SubscriptionsService) { }

	ngOnInit(): void {
		this.subscriptionsService.getSubscriptions();
		this.subcriptionsResponseSubs = this.subscriptionsService.onSubscriptionsResponse().subscribe(s => {if(s?.entries) this.subscriptions = s.entries})
	}
	ngOnDestroy(): void {
		this.subcriptionsResponseSubs?.unsubscribe();
	}
}
