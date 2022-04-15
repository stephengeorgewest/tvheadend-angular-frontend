/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/webui/comet.c#L253
 */
export type cometMessage = {
	boxid?: string;
	messages: Array<accessMessage | setServerIpPortMessage | reloadMessage | diskspaceMessage | epgMessage | dvrentryMessage | subscriptionsMessage | titleMessage | servicemapperMessage>;
};

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/notify.c#L48
 */
type messageBase = {
	notificationClass: string;
};

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/idnode.c
 * ->
 * search ".ic_event"
 */
type ic_event =
	"access" |
	"passwd" |
	"ipblocking" |
	"bouquet" |
	"channel" |
	"channeltag" |
	"config" |
	"epggrab" |
	"esfilter" |
	"imagecache" |
	"memoryinfo" |
	"profile" |
	"service_mapper" |
	"service" |
	"service_raw" |
	"timeshift" |
	"tvhlog_conf" |
	"caclient" |
	"dvrautorec" |
	"dvrconfig" |
	"dvrentry" |
	"dvrtimerec" |
	"epggrab_channel" |
	"epggrab_mod" |
	"mpegts_input" |
	"mpegts_mux_sched" |
	"mpegts_mux" |
	"mpegts_network" |
	"linuxdvb_adapter" |
	"linuxdvb_satconf" |
	"linuxdvb_satconf_ele" |
	"linuxdvb_diseqc" |
	"satip_satconf" |
	"satip_client" |
	"satip_server" |
	"codec_profile";
/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/notify.c#L45
 * ->
 * search "notify_reload("
 */
export type reloadMessage = {
	notificationClass: "input_status" | "connections" | "hardware" | "subscriptions" | ic_event;
	reload: number;
} & messageBase;

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/dvr/dvr_vfsmgr.c#L413
 */
type diskspaceBase = {
	freediskspace: number;
	useddiskspace: number;
	totaldiskspace: number;
}
export type diskspaceMessage = {
	notificationClass: "diskspaceUpdate";
} & messageBase & diskspaceBase;

export type epgMessage = {
	notificationClass: "epg";

	/**
	 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/epg.c#L849
	 */
	delete?: string[];

	/**
	 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/epg.c#L907
	 */
	update?: string[];

	/**
	 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/epg.c#L910
	 */
	create?: string[];

	// webui\static\app\epg.js#L55
	/**
	 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/dvr/dvr_db.c#L250
	 */
	dvr_delete?: string[];

	/**
	 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/dvr/dvr_db.c#L225
	 */
	dvr_update?: string[];
	
	/**
	 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/dvr/dvr_db.c#L260
	 */
	dvr_create?: string[];
} & messageBase;

export type dvrentryMessage = {
	notificationClass: "dvrentry";
	delete?: string[];
	update?: string[];
	create?: string[];
	change?: string[];
} & messageBase;

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/subscriptions.c#L1127s
 */
type subscriptionsMessage = {
	notificationClass: "subscriptions";
	id: number;
	start: number;
	errors: number;
	state: string; // "Running";
	title: string; //"epggrab";
	service: string; // "HDHomeRun ATSC-T Tuner #0 (192.168.0.215)/ATSC-T Network/599.028MHz/Raw PID Subscription";
	pids: number[];
	in: number;
	out: number;
	total_in: number;
	total_out: number;
	updateEntry: number;
} & messageBase;

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/idnode.c#L1925
 */
type titleMessage = {
	notificationClass: "title";
	uuid: string;
} & messageBase;

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/api/api_service.c#L67
 * ->
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/api/api_service.c#L42
 */
type servicemapperMessage = {
	notificationClass: "servicemapper";
	total: number;
	ok: number;
	fail: number;
	ignore: number;
	active?: string;
} & messageBase;

/**
 * https://github.com/tvheadend/tvheadend/blob/58df4bf5142a7628b3994ec6c0c4b8e1d8d27694/src/input/mpegts/mpegts_input.c#L2047
 */
export type input_statusMessage = {
	notificationClass: "input_status";
	uuid: string; // "903fd4a7add1e18e6aa5486b35e595cd",
	input: string; // "HDHomeRun ATSC-T Tuner #0 (192.168.0.215)",
	stream: string; // "599.028MHz in ATSC-T Network",
	subs: number;
	weight: number;
	pids: number[];
	signal: number;
	signal_scale: number;
	ber: number;
	snr: number;
	snr_scale: number;
	unc: number;
	bps: number;
	te: number;
	cc: number;
	ec_bit: number;
	tc_bit: number;
	ec_block: number;
	tc_block: number;
	update: number;
} & messageBase;

/**
 * webui\comet.c#L154
 */
export type accessMessage = {
	notificationClass: "accessUpdate";
	uilevel?: "basic" | "expert" | "advanced";
	"uilevel_nochange"?: number;
	/**
	 * access.c#L319
	 * "blue" is unset
	 */
	theme: "blue" | string;
	/**
	 * 0|1?truthy
	 */
	quicktips: number,
	/**
	 * 0|1?truthy
	 */
	chname_num: number,
	/**
	 * 0|1?truthy
	 */
	chname_src: number,
	date_mask: string,
	label_formatting: number,
	username?: string;
	address?: string,
	dvr: number,
	/**
	 * 0|1?truthy
	 */
	admin: number,
	/**
	 * server time now
	 */
	time: number,
	/**
	 * In Days.
	 * Example: 7
	 */
	cookie_expires?: number,
	/**
	 * In Seconds.
	 * Example: 300
	 */
	ticket_expires?: number,
	/**
	 * Example: "login,storage,time"
	 */
	info_area?: string,
	wizard?: string;
} & messageBase & Partial<diskspaceBase>;

/**
 * webui\comet.c#L224
 */
export type setServerIpPortMessage = {
	notificationClass: "setServerIpPort",
	ip: string; //"192.168.0.156",
	port: number;
} & messageBase;