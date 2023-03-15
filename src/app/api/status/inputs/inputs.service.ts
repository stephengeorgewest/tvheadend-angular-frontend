import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { APP_CONFIG, AppConfig } from 'src/app/app.config';
import { AuthenticationService } from 'src/app/authentication.service';
import { fetchData } from '../../util';
import { Input, InputsResponse } from './responsemodel';

@Injectable({
	providedIn: 'root'
})
export class InputsService {
	private inputsResponse: BehaviorSubject<InputsResponse | undefined> = new BehaviorSubject<InputsResponse | undefined>(undefined);
	public get inputsValue() {
		return this.inputsResponse.value;
	}
	public onInputResponse() {
		return this.inputsResponse.asObservable();
	}

	constructor(
		private authenticationService: AuthenticationService,
		@Inject(APP_CONFIG) private config: AppConfig
	) { }

	public getInputs() {
		fetchData(this.config, "status/inputs", {
			//_dc: Date.now()
		}, this.authenticationService.authenticationValue.basic).then((data: InputsResponse) => this.inputsResponse.next(data));
	}
	public clear(uuid: string) {
		this.clear1(uuid).then(() => this.getInputs());
	}
	private clear1(uuid: string) {
		return fetchData(this.config, 'api/status/inputclrstats', { uuid: uuid })
	}
	public clearAll() {
		if (this.inputsResponse.value)
			Promise.all(
				this.inputsResponse.value.entries.map(
					i => this.clear1(i.uuid)
				)).then(() => this.getInputs());
	}
	public refreshIfLoaded() {
		if (this.inputsResponse.value)
			this.getInputs();
	}
	public update(inputs: Input[]) {
		const entries = this.inputsResponse.value?.entries;
		if (entries && inputs.length) {
			inputs.forEach(i => {
				const matchingInputIndex = entries.findIndex(e => e.uuid === i.uuid);
				if (matchingInputIndex === -1)
					entries.push(i);
				else
					entries[matchingInputIndex] = i;
			});
			this.inputsResponse.next({
				total: entries.length,
				entries: entries
			});
		}
	}
}
