import { Component } from '@angular/core';
import { WebsocketService } from './api/ws/websocket.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	// start up websockets
	constructor(private webSocketService: WebsocketService) { }
}
