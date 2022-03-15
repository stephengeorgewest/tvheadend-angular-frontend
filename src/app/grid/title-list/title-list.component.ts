import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';
import { ignoreEntry, IgnoreListService, listNames } from 'src/app/ignore-list.service';


@Component({
  selector: 'app-title-list',
  templateUrl: './title-list.component.html',
  styleUrls: ['./title-list.component.css']
})
export class TitleListComponent implements OnInit {

  @Input() public filteredEntries: Map<string, GridEntry[]> = new Map();
  @Input() public lastignoredcount: number = 0;
  @Output() public selectedEntry: EventEmitter<GridEntry[]> = new EventEmitter();

  public ignoreListNames: Array<listNames> = ["Recorded", "Garbage", "Meh"];

  constructor(private ignoreService: IgnoreListService) { }

  ngOnInit(): void {
  }

	public ignore(entry: ignoreEntry, listName: listNames) {
		this.ignoreService.ignore(entry, listName);
	}
	public ignoreTitle(title: string, listName: listNames) {
		this.ignoreService.ignoreTitle(title, listName);
	}
	public ignoreChanelName(channelName: string, listName: listNames) {
		this.ignoreService.ignoreChanelName(channelName, listName);
	}

}
