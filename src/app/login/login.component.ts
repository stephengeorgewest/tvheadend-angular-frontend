import { Component, Inject, OnDestroy } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../app.config';
import { WebsocketService } from '../api/ws/websocket.service';
import { AuthenticationService } from '../authentication.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
	public loginUrl;
	public logoutUrl;
	public authenticated: boolean = false;
	public authenticationMatch: boolean = false;
	public closing = false;
	private auth_sub: Subscription;
	constructor(
		public authenticationService: AuthenticationService,
		public websocketService: WebsocketService,
		public snackbarref: MatSnackBarRef<LoginComponent>,
		sanitizer: DomSanitizer,
		@Inject(APP_CONFIG) public config: AppConfig
	) {
		this.loginUrl = sanitizer.bypassSecurityTrustResourceUrl("http" + config.server.secure + "://" + config.server.host + ":" + config.server.port + "/login");
		this.logoutUrl = sanitizer.bypassSecurityTrustResourceUrl("http" + config.server.secure + "://" + config.server.host + ":" + config.server.port + "/logout?logout=1");
		this.auth_sub = this.authenticationService.authentication.subscribe(authentication => {
			if (!this.closing) {
				this.authenticated = !!authentication.socketusername;
				this.authenticationMatch = authentication.username === authentication.socketusername;
			}
		});
	}
	ngOnDestroy(): void {
		this.auth_sub.unsubscribe();
	}
}
