import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { InputsService } from 'src/app/api/status/inputs/inputs.service';
import { Input } from 'src/app/api/status/inputs/responsemodel';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnDestroy {
	public inputs: Input[] = [];
	private inputsResponseSub: Subscription | undefined;
	constructor(public inputsService: InputsService) { }

	ngOnInit(): void {
		if (!this.inputsService.inputsValue) {
			this.inputsService.getInputs();
		}
		this.inputsService.onInputResponse().subscribe(i => {
			if (i?.entries) this.inputs = i.entries;
		});
	}
	ngOnDestroy(): void {
		this.inputsResponseSub?.unsubscribe();
	}

	public uuidTrack(index: number, entry: { uuid: string }) {
		return entry.uuid;
	}

}

@Pipe({
	name: 'scale',
	pure: false
})
export class ScalePipe implements PipeTransform {
	transform(value: number, scale: number, suffix: string): number | string | "unknown" {
		return scale === 1 ?
			(value / 65535 * 100).toFixed(0) + "%"
			: scale === 2 && value > 0 ?
				(value * 0.001) + " " + suffix
				: 'unknown';
	}
}

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