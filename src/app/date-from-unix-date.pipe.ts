import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'newDate',
	pure: false
})
export class NewDatePipe implements PipeTransform {
	transform(seconds: number): Date {
		return new Date(seconds * 1000);
	}
}