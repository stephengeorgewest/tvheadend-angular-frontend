import { Component } from '@angular/core';
import { ApiService } from '../api/api';
import { diskspaceBase } from '../ws/responsemodel';

@Component({
	selector: 'app-disk-usage',
	templateUrl: './disk-usage.component.html',
	styleUrls: ['./disk-usage.component.css']
})
export class DiskUsageComponent {
	public diskspace: diskspaceBase | undefined;

	constructor(private apiservice: ApiService) {
		this.apiservice.onDiskUsage().subscribe(diskUsage => this.diskspace = diskUsage);
	}
}

