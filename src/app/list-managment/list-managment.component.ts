import { Component, OnInit } from '@angular/core';
import { ignoreEntry, IgnoreListService, listNames } from '../ignore-list.service';

@Component({
	selector: 'app-list-managment',
	templateUrl: './list-managment.component.html',
	styleUrls: ['./list-managment.component.css']
})
export class ListManagmentComponent implements OnInit {
	public ignoreListNames: Array<listNames> = ["Recorded", "Garbage", "Meh"];
	public ignoreLists: { [key in listNames]: Array<ignoreEntry> } = { "Recorded": [], "Garbage": [], "Meh": [] };
	constructor(private ignoreService: IgnoreListService) {
		this.ignoreService.onList().subscribe((e) => {
			this.ignoreLists = e.list;
		});
	}

	ngOnInit(): void {
	}


	public deleteFromList(entry: ignoreEntry, list: ignoreEntry[]) {
		this.ignoreService.deleteFromList(entry, list);
	}
	public moveEntry(entry: ignoreEntry, to: listNames) {
		this.ignoreService.moveEntry(entry, to);
	}

}
