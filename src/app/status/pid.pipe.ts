import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'pidlist',
	pure: false
})
export class PidPipe implements PipeTransform {
	transform(pid: number[] | undefined): string {
		if (pid) {
			pid.sort();
			return pid[pid.length - 1] === 65535 ?
				"all" :
				pid.join(', ');
		}
		return "";
	}
}