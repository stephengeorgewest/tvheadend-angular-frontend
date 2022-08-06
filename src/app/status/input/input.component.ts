import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { InputsService } from 'src/app/api/status/inputs/inputs.service';
import { Input } from 'src/app/api/status/inputs/responsemodel';
import { uuidTrack } from 'src/app/util';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.css', '../status.css']
})
export class InputComponent implements OnInit, OnDestroy {
	public inputs: Input[] = [];
	private inputsResponseSub: Subscription | undefined;
	public uuidTrack = uuidTrack;
	constructor(public inputsService: InputsService) { }

	ngOnInit(): void {
		if (!this.inputsService.inputsValue) {
			this.inputsService.getInputs();
		}
		this.inputsResponseSub = this.inputsService.onInputResponse().subscribe(i => {
			if (i?.entries) this.inputs = i.entries;
		});
	}
	ngOnDestroy(): void {
		this.inputsResponseSub?.unsubscribe();
	}
}

@Pipe({
	name: 'scale',
	pure: false
})
export class ScalePipe implements PipeTransform {
	transform(value: number, scale: number, suffix: string): number | string | "unknown" {
		return scale === 1 ?
			(value / (
				value > 255 ? 65535: 255 // Workaround for happaguge driver using 8bits instead of 16
			) * 100).toFixed(0) + "%"
			: scale === 2 && value > 0 ?
				(value * 0.001) + " " + suffix
				: 'unknown';
	}
}