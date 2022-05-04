import { Grid } from "../../models";

export type SubscriptionsResponse = Grid<Subscription>;

/**
 * subscriptions.c#L1000
 */
export type Subscription =
{
	/**
	 * Unix time
	 * 
	 * @example 4901
	 */
	id: number;

	/**
	 * Unix time
	 * 
	 * @example 1651662796
	 */
	start: number;
	errors: number;
	state: "Idle" | "Testing" | "Running" | "Bad";
	/**
	 * @example "::ffff:192.168.0.224"
	 */
	hostname?: string;
	/**
	 * @example "::ffff:192.168.0.224"
	 */
	username?: string;
	/**
	 * @example "Kodi Media Center"
	 */
	client?: string;
	/**
	 * @example "::ffff:192.168.0.224 [ Kodi Media Center ]"
	 */
	title?: string;
	/**
	 * @example "METV"
	 */
	channel?: string;
	/**
	 * @example "Samsung S5H1409 QAM/8VSB Frontend #0 : ATSC-T #0/ATSC-T Network/569.028MHz/METV"
	 * @example "file:///mnt/Data/tvheadend/Curious George/Curious George - S01E26 - Housebound!; Curious George Rides a Bike.ts"
	 */
	service?: string;
	descramble?: string;
	/**
	 * @example [64,65,68]
	 */
	pids?: number[];
	/**
	 * @example "htsp"
	 */
	profile?: string;
	in: number;
	out: number;
	total_in: number;
	total_out: number;
};