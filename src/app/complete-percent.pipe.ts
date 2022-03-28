import { Pipe, PipeTransform } from "@angular/core";
import { GridUpcomingEntry } from "./api/dvr/entry/grid_upcoming/responsemodel";
import { GridEntry } from "./api/epg/events/grid/responsemodel";

@Pipe({
	name: 'completePercent'
})
export class CompletePercentPipe implements PipeTransform {
	transform(entry: GridEntry | GridUpcomingEntry) {
		const currentLength = Date.now()/1000-entry.start;
		if(currentLength < 0) return 0;
		const runLength = entry.stop - entry.start;
		return (((currentLength)/(runLength)*100).toFixed(0)) + "%";
	}
}

@Pipe({
	name: 'beginPercent'
})
export class BeginPercentPipe implements PipeTransform {
	transform(entry: GridUpcomingEntry) {
		const padLength = entry.start - entry.start_real;
		const runLength = entry.stop - entry.start;
		return (((padLength)/(runLength)*100).toFixed(0)) + "%";
	}
}

@Pipe({
	name: 'endPercent'
})
export class EndPercentPipe implements PipeTransform {
	transform(entry: GridUpcomingEntry) {
		const padLength = entry.stop_real - entry.stop;
		const runLength = entry.stop - entry.start;
		return (((padLength)/(runLength)*100).toFixed(0)) + "%";
	}
}


