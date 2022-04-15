import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'filesize'
})
export class FileSizePipe implements PipeTransform {
	transform(size: number) {
		const sizes = [
			"b",
			"Kb",
			"Mb",
			"Gb",
			"Tb"
		];

		let s = size;
		let bin = 0;
		while (s > 1024) {
			s /= 1024;
			bin++;
		}
		return (bin > 2 ? (s).toFixed(1) : Math.round(s)) + sizes[bin];
	}
}
