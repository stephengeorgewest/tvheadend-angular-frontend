import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { GridEntry } from 'src/app/api/epg/events/grid/responsemodel';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent {
	@Input() public selectedEntry: GridEntry[] = [];
}