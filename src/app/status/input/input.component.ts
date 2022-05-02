import { Component, OnInit } from '@angular/core';
import { fetchData } from 'src/app/api/util';
import { AuthenticationService } from 'src/app/authentication.service';
import { InputResponse } from './responsemodel';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
	public inputs: InputResponse[] = [];
	constructor(private authenticationService: AuthenticationService) { }

	ngOnInit(): void {
		fetchData("status/inputs", {}, this.authenticationService.authenticationValue.basic).then((data: InputResponse[]) => this.inputs = data);
	}

}
