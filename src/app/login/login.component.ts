import { Component, OnDestroy } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
	public authenticated: boolean = false;
	public closing = false;
	private auth_sub: Subscription;
	constructor(public authenticationService: AuthenticationService, public snackbarref: MatSnackBarRef<LoginComponent>) {
		this.auth_sub = this.authenticationService.authentication.subscribe(authentication => {
			if(!this.closing)this.authenticated = !!authentication;
		});
	}
	ngOnDestroy(): void {
		this.auth_sub.unsubscribe();
	}
}
