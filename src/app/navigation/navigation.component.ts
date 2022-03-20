import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  ActivationEnd, Event, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
	@Input() public type: "button" | "list" = "list";
	@Output() public menuClicked: EventEmitter<void> = new EventEmitter();

	public links: {path?: string, icon?: string, friendlyName?: string}[];
	public activatedPath: string | undefined;

	constructor(public router: Router) {
		this.links = router.config.map(r => ({path: r.path, icon: r.data?.['icon'], friendlyName: r.data?.['friendlyName']}));
		router.events.pipe(
			filter((e: Event): e is ActivationEnd/*NavigationEnd??*/ => e instanceof ActivationEnd),
		)
		.subscribe((event: ActivationEnd) => this.activatedPath = event.snapshot.url[0].path);
	}
}
