import { environment } from "src/environments/environment";
import { GridRequest } from "./grid-request";

export function formEncode<T>(options: GridRequest<T>) {
	return Object.entries(options).reduce(
		(params, current) => {
			params.append(current[0], current[1].toString());
			return params;
		},
		new URLSearchParams()
	).toString();
}

/*	public httppost() {
		this.errors = undefined;
		//https://stackoverflow.com/questions/50594372/angular-dont-send-content-type-request-header
		//Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://dell-dm051:9981/api/epg/events/grid. (Reason: header ‘content-type’ is not allowed according to header ‘Access-Control-Allow-Headers’ from CORS preflight response).
		this.http.post<GridResponse>(
			'http://' + this.selectedServer + ':9981/api/epg/events/grid',
			formEncode(this.options), { headers: {} }
		)
			.subscribe(d => this.entries = d.entries, errors => this.errors = errors);

	}*/

export function fetchData(page: string, options?: any, fn?:(data: any) => any) {
	fetch('http://' + environment.serverUrl + ':9981/api/' + page, {
		body: formEncode(options),
		method: 'POST',
		mode: 'cors',
		headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
	}).then(response => response.json()).then(fn);
}