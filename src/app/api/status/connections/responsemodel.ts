import { Grid } from "../../models";

export type ConnectionsResponse = Grid<Connection>;

export type Connection = 
{
	/*
	 * @example 15567,
	 */
	id: number;

	/*
	 * @example "::ffff:192.168.0.150",
	 */
	server: string;

	/*
	 * @example 9982,
	 */
	server_port: number;
	/*
	 * @example "::ffff:192.168.0.154",
	 */
	peer: string;
	/*
	 * @example 57638,
	 */
	peer_port: number;
	/*
	 * @example 1648955860,
	 */
	started: number;
	/*
	 * @example 0,
	 */
	streaming: number;
	/*
	 * @example "HTSP"
	 */
	type: string;

	username?: string;
	proxy_address?: string;
};