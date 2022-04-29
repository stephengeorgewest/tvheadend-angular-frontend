import { Component } from '@angular/core';
import { DiskUsageService } from './disk-usage.service';
import { diskspaceBase } from '../api/ws/responsemodel';

@Component({
	selector: 'app-disk-usage',
	templateUrl: './disk-usage.component.html',
	styleUrls: ['./disk-usage.component.css']
})
export class DiskUsageComponent {
	public diskspace: diskspaceBase | undefined;

	constructor(private diskUsageService: DiskUsageService) {
		this.diskUsageService.onDiskUsage().subscribe(diskUsage => this.diskspace = diskUsage);
	}
}

