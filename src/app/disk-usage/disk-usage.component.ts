import { Component, Pipe, PipeTransform } from '@angular/core';
import { DiskUsageService } from './disk-usage.service';
import { diskspaceBase } from '../api/ws/responsemodel';
import { FileSizePipe } from '../file-size.pipe';
type SVG_Path = Array<SVG_Path_commands>;
type SVG_Path_commands = SVG_Move | SVG_Arc;
type SVG_Move = {
	command: "M"
	x: number;
	y: number;
} & SVG_Command;
type SVG_Arc = {
	command: "A";
	radius: number,
	x_axis_rotation: number, // 0-360
	large_arc_flag: number,
	sweep_flag: 0 | 1,
	x: number,
	y: number;
} & SVG_Command;
type SVG_Command = {
	command: "M" | "m" | "A" | "a"
}

@Component({
	selector: 'app-disk-usage',
	templateUrl: './disk-usage.component.html',
	styleUrls: ['./disk-usage.component.css']
})
export class DiskUsageComponent {
	constructor(private diskUsageService: DiskUsageService) {
		this.diskUsageService.onDiskUsage().subscribe(diskspace => this.draw_pie_chart(diskspace));
	}
	public otherSpace: [SVG_Move, SVG_Arc] | undefined;
	public usedSpace: [SVG_Move, SVG_Arc] | undefined;
	public freeSpace: [SVG_Move, SVG_Arc] | undefined;
	public altString = "";

	public readonly height = 25;
	public readonly center = this.height / 2;
	public readonly stroke_radius = 2.5;
	public readonly radius = this.center - this.stroke_radius;
	private fileSizePipe = new FileSizePipe();

	public draw_pie_chart(diskspace: diskspaceBase | undefined) {
		if(!diskspace){
			this.otherSpace = undefined;
			this.usedSpace = undefined;
			this.freeSpace = undefined;
			return;
		}

		const otherSpacePercentage = (diskspace.totaldiskspace - diskspace.freediskspace-diskspace.useddiskspace)/diskspace.totaldiskspace*100;

		this.otherSpace = this.draw_pie_chart_segment({
			percent: otherSpacePercentage, start: {
				x: this.center, y: this.stroke_radius,
				percent: 0
			}
		});

		const usedSpacePercent = diskspace.useddiskspace*100/diskspace.totaldiskspace;
		this.usedSpace = this.draw_pie_chart_segment({
			percent: usedSpacePercent, start: {
				x: this.otherSpace[1].x,
				y: this.otherSpace[1].y,
				percent: otherSpacePercentage
			}
		});

		const freeSpacePercent = diskspace.freediskspace*100/diskspace.totaldiskspace;
		this.freeSpace = this.draw_pie_chart_segment({
			percent: freeSpacePercent, start: {
				x: this.usedSpace[1].x,
				y: this.usedSpace[1].y,
				percent: otherSpacePercentage+usedSpacePercent
			}
		});

		this.altString = "Other: " + Math.round(otherSpacePercentage) + "%\r\nUsed: " + Math.round(usedSpacePercent) + "%\r\nFree: " + Math.round(freeSpacePercent) + "%\r\nTotal: " + this.fileSizePipe.transform(diskspace.totaldiskspace);
	}
	private draw_pie_chart_segment(value: {
		percent: number, start: { x: number, y: number, percent: number }
	}): [SVG_Move, SVG_Arc] {
		const angle = (value.percent + value.start.percent) * 3.6; // 1% = 3.6deg;
		const p: [SVG_Move, SVG_Arc] = [
			{ command: "M", x: value.start.x, y: value.start.y },
			{
				command: "A",
				radius: this.radius,
				x_axis_rotation: 0, // 0-360
				large_arc_flag: value.percent >= 50 ? 1 : 0,
				sweep_flag: 1, // ClockWise
				x: this.center + this.radius * Math.sin(Math.PI * angle / 180),
				y: this.center - this.radius * Math.cos(Math.PI * angle / 180)
			}];

		return p;
	}
}

@Pipe({name: "pathPipe"})
export class PathPipe implements PipeTransform{
	transform  (path: SVG_Path | undefined){
		if(!path) return "";
		let path_string = "";
		path.forEach(p => {
			switch (p.command) {
				case "A":
					path_string += ` A${p.radius},${p.radius}  ${p.x_axis_rotation},${p.large_arc_flag},${p.sweep_flag} ${p.x},${p.y}`
					break;
				case "M":
					path_string += ` M${p.x},${p.y}`;
					break;
			}
		});
		return path_string.slice(1);
	}
}

