import { environment } from "src/environments/environment";

function formEncode(options: { [key: string]: any }) {
	return Object.entries(options).reduce(
		(params, current) => {
			const value = Array.isArray(current[1]) ? JSON.stringify(current[1]) : current[1].toString();
			params.append(current[0], value);
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

export function fetchData(page: string, options?: any, auth?: string) {
	const headers: HeadersInit = { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" };
	if(auth)
		headers["Authorization"] = "Basic " + auth;
	return fetch(
		'http' + environment.server.secure + '://' + environment.server.host + ':' + environment.server.port + '/api/' + page,
		{
			body: formEncode(options||{}),
			method: 'POST',
			mode: 'cors',
			headers
		}
		).then(response => response.json());
}