import { Component, Inject, OnInit } from '@angular/core';
import { fetchData } from 'src/app/api/util';
import { AppConfig, APP_CONFIG } from '../app.config';


@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent {
	public about: any;
	public urls: any;

	constructor(@Inject(APP_CONFIG) config: AppConfig) {
		fetchData(config, "serverinfo", {}).then((data: any) => {this.about = data;});
		fetchData(config, "pathlist", {}).then((data: any) => {this.urls = data;});
	}
}
