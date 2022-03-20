import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
	@Input() public type: "button" | "list" = "list";
	@Output() public menuClicked: EventEmitter<void> = new EventEmitter();

	public links: {path?: string, icon?: string, friendlyName?: string}[];

	constructor(public router: Router){
		this.links = router.config.map(r => ({path: r.path, icon: r.data?.['icon'], friendlyName: r.data?.['friendlyName']}));
	}
}
