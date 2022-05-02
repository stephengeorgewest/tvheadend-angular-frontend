import { Component, OnDestroy } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
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
		public snackbarref: MatSnackBarRef<LoginComponent>,
		sanitizer: DomSanitizer
	) {
		this.loginUrl = sanitizer.bypassSecurityTrustResourceUrl("http" + environment.server.secure + "://" + environment.server.host + ":" + environment.server.port + "/login");
		this.logoutUrl = sanitizer.bypassSecurityTrustResourceUrl("http" + environment.server.secure + "://" + environment.server.host + ":" + environment.server.port + "/logout?logout=1");
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
