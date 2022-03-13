import { Pipe, PipeTransform } from "@angular/core";
import { listNames } from "./ignore-list.service";

@Pipe({
	name: 'listNamesfilter',
	pure: false
})
export class ListNamesFilterPipe implements PipeTransform {
	transform(items: listNames[], filter: listNames): listNames[] {
		return items.filter(item => item !== filter);
	}
}