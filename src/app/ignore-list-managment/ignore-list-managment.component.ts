import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ignoreEntry, IgnoreListService, listNames } from '../ignore-list.service';

@Component({
	selector: 'app-list-managment',
	templateUrl: './ignore-list-managment.component.html',
	styleUrls: ['./ignore-list-managment.component.css']
})
export class IgnoreListManagmentComponent implements OnDestroy {
	public ignoreListNames: Array<listNames> = ["Recorded", "Garbage", "Meh"];
	public ignoreLists: { [key in listNames]: Array<ignoreEntry> } = { "Recorded": [], "Garbage": [], "Meh": [] };
	private subscription: Subscription;

	constructor(private ignoreService: IgnoreListService) {
		this.subscription = this.ignoreService.onList().subscribe((e) => {
			this.ignoreLists = e.list;
		});
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	public deleteFromList(entry: ignoreEntry, list: ignoreEntry[]) {
		this.ignoreService.deleteFromList(entry, list);
	}
	public moveEntry(entry: ignoreEntry, to: listNames) {
		this.ignoreService.moveEntry(entry, to);
	}

}
