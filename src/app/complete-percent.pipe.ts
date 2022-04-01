import { Pipe, PipeTransform } from "@angular/core";
import { GridUpcomingEntry } from "./api/dvr/entry/grid_upcoming/responsemodel";
import { GridEntry } from "./api/epg/events/grid/responsemodel";
function toPercent(value: number, total: number): string {
	const percent = Math.min(value / total * 100, 100);
	return percent.toFixed(2) + "%";

};
@Pipe({
	name: 'completePercent'
})
export class CompletePercentPipe implements PipeTransform {
	transform(entry: GridEntry | GridUpcomingEntry, now: number) {
		const start = (entry as GridUpcomingEntry).start_real || entry.start;
		const stop = (entry as GridUpcomingEntry).stop_real || entry.stop;
		const currentLength = now - start;
		if (currentLength < 0) return 0;
		const runLength = stop - start;
		return toPercent(currentLength, runLength);
	}
}

@Pipe({
	name: 'beginPercent'
})
export class BeginPercentPipe implements PipeTransform {
	transform(entry: GridUpcomingEntry) {
		const padLength = entry.start - entry.start_real;
		const runLength = entry.stop_real - entry.start_real;
		return toPercent(padLength, runLength);
	}
}

@Pipe({
	name: 'endPercent'
})
export class EndPercentPipe implements PipeTransform {
	transform(entry: GridUpcomingEntry) {
		const padLength = entry.stop_real - entry.stop;
		const runLength = entry.stop_real - entry.start_real;
		return toPercent(padLength, runLength);
	}
}


