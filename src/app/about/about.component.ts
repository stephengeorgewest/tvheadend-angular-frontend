import { Component, OnInit } from '@angular/core';
import { fetchData } from 'src/app/api/util';
import { environment } from 'src/environments/environment';


@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent {
	public about: any;
	public urls: any;

	constructor() {
		fetchData("serverinfo", {}).then((data: any) => {this.about = data;});
		fetchData("pathlist", {}).then((data: any) => {this.urls = data;});
	}
}
