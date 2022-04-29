import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivationEnd, Event, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { GuardData, GuardKeys, GuardService } from '../guard.service';
import { LoginComponent } from '../login/login.component';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
	public guardData: GuardData = { dvr: false, admin: false };
	public authenticated: boolean = false;
	@Input() public type: "button" | "list" = "list";
	@Output() public menuClicked: EventEmitter<void> = new EventEmitter();

	public links: { path?: string, icon?: string, friendlyName?: string, guard?: GuardKeys }[];
	public activatedPath: string | undefined;

	constructor(
		public router: Router,
		private guardService: GuardService,
		private authenticationService: AuthenticationService,
		private snackbar: MatSnackBar,
		private titleService: Title
	) {
		this.links = router.config.map(r => ({ path: r.path, icon: r.data?.['icon'], friendlyName: r.data?.['friendlyName'], guard: r.data?.["guard"] }));
		router.events.pipe(
			filter((e: Event): e is ActivationEnd/*NavigationEnd??*/ => e instanceof ActivationEnd),
		)
			.subscribe((event: ActivationEnd) => this.activatedPath = event.snapshot.url[0].path);
		this.guardService.guardChanges.subscribe(data => this.guardData = data);
		this.authenticationService.authentication.subscribe(authentication => this.authenticated = !!authentication);

		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => {
					let route: ActivatedRoute = this.router.routerState.root;
					let routeTitle = '';
					while (route!.firstChild) {
						route = route.firstChild;
					}
					if (route.snapshot.data['friendlyName']) {
						routeTitle = route!.snapshot.data['friendlyName'];
					}
					return routeTitle;
				})
			)
			.subscribe((title: string) => {
				if (title) {
					this.titleService.setTitle(`tvh - ${title}`);
				}
			});
	}
	public login() {
		this.snackbar.openFromComponent(LoginComponent, {
			verticalPosition: 'top',
		});
	}
	public logout() {
		this.authenticationService.logout();
	}
}
