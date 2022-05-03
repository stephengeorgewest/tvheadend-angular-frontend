import { Grid } from "../../models";

export type InputsResponse = Grid<Input>;

export type Input = {
	uuid: string, // "903fd4a7add1e18e6aa5486b35e595cd",
	input: string, // "HDHomeRun ATSC-T Tuner #0 (192.168.0.215)",
	stream?: string, // "599.028MHz in ATSC-T Network",
	subs: number,
	weight: number,
	/**
	 * @example
	 * r.sort(function(a, b){return a-b});
	 * if (r[r.length - 1] == 65535) return _("all");
	 **/
	pids: number[],
	/**
	 * 
	 */
	signal: number,
	/**
	 * @example
	 * if (scale == 1)
	 *   return v;
	 * if (scale == 2) {
	 *     var snr = v * 0.001;
	 *     return snr.toFixed(1) + " dBm";
	 */
	signal_scale: number,
	ber: number,
	snr: number,
	snr_scale: number,
	unc: number,
	bps: number,
	te: number,
	cc: number,
	ec_bit: number,
	tc_bit: number,
	ec_block: number,
	tc_block: number
};