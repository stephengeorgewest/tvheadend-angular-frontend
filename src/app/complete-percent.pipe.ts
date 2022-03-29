import { Pipe, PipeTransform } from "@angular/core";
import { GridUpcomingEntry } from "./api/dvr/entry/grid_upcoming/responsemodel";
import { GridEntry } from "./api/epg/events/grid/responsemodel";

@Pipe({
	name: 'completePercent'
})
export class CompletePercentPipe implements PipeTransform {
	transform(entry: GridEntry | GridUpcomingEntry) {
		const start = (entry as GridUpcomingEntry).start_real || entry.start;
		const stop = (entry as GridUpcomingEntry).stop_real || entry.stop;
		const currentLength = Date.now()/1000-start;
		if(currentLength < 0) return 0;
		const runLength = stop - start;
		return (((currentLength)/(runLength)*100).toFixed(0)) + "%";
	}
}

@Pipe({
	name: 'beginPercent'
})
export class BeginPercentPipe implements PipeTransform {
	transform(entry: GridUpcomingEntry) {
		const padLength = entry.start - entry.start_real;
		const runLength = entry.stop_real - entry.start_real;
		return (((padLength)/(runLength)*100).toFixed(0)) + "%";
	}
}

@Pipe({
	name: 'endPercent'
})
export class EndPercentPipe implements PipeTransform {
	transform(entry: GridUpcomingEntry) {
		const padLength = entry.stop_real - entry.stop;
		const runLength = entry.stop_real - entry.start_real;
		return (((padLength)/(runLength)*100).toFixed(0)) + "%";
	}
}


