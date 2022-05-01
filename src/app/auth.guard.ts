import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthenticationService, GuardData } from './authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private authenticationService: AuthenticationService) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const guard: keyof GuardData | undefined = route.data["guard"];
		if (!guard)
			return true;
		return this.authenticationService.guardChanges.pipe(map(data => data[guard]));
	}
}
