import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private authenticationSubject: BehaviorSubject<string|null>;
	public authentication: Observable<string | null>;
	public get authenticationValue(): string | null {
		return this.authenticationSubject.value;
	}

	constructor(){
		this.authenticationSubject = new BehaviorSubject(localStorage.getItem("authentication"));
		this.authentication = this.authenticationSubject.asObservable();
	}

	public login(username: string, password: string){
		const authentication = window.btoa(username + ":" + password);
		localStorage.setItem("authentication", authentication);
		this.authenticationSubject.next(authentication);
	}
	public logout(){
		this.authenticationSubject.next(null);
		localStorage.removeItem("authentication");
	}
}
