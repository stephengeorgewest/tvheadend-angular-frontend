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