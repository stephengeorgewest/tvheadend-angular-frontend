export type Entry = {
	uuid: string; // "b441cd01d9c23512ce399537c6fe6357"
	enabled: boolean; // true
	create: number; // 1644126445
	watched: number; // 0
	start: number; // 1644454800
	start_extra: number; //  0
	start_real: number; // 1644454470
	stop: number; // 1644471000
	stop_extra: number; // 0
	stop_real: number; // 1644471300
	duration: number; // 16800
	channel: string; // "ba75b8c445ac1aa0acd2ea0fe192da3a"
	channel_icon: string; // "imagecache/894"
	channelname: string; // "KSL-DT "
	image: string; // "https://zap2it.tmsimg.com/assets/p21254064_b_v13_aa.jpg"
	fanart_image: string; // ""
	title: {
		eng: string; // "2022 Winter Olympics"
	}; // 
	disp_title: string; // "2022 Winter Olympics"
	subtitle: {
		eng: string; // "Snowboarding, Short Track, Figure Skating; Alpine Skiing"
	}; // 
	disp_subtitle: string; // "Snowboarding, Short Track, Figure Skating; Alpine Skiing"
	disp_summary: string; // "Snowboarding, Short Track, Figure Skating; Alpine Skiing"
	disp_description: string; // "Athletes drop in on the halfpipe for a spot on the medal stand in women's snowboarding, short track continues with the men's 1500m final, men's free skate in figure skating, and the men's combined and downhill run in alpine skiing."
	disp_extratext: string; //  "Athletes drop in on the halfpipe for a spot on the medal stand in women's snowboarding, short track continues with the men's 1500m final, men's free skate in figure skating, and the men's combined and downhill run in alpine skiing."
	pri: number; // 6
	retention: number; // 0
	removal: number; // 0
	playposition: number; // 826 
	playcount: number; // 0
	config_name: string; // "035ba226f0e6a53908770ac79a7260b1"
	creator: string; // "::ffff:192.168.0.224"
	filename: string; // "/mnt/Data/tvheadend/2022 Winter Olympics/2022 Winter Olympics - E125 - Snowboarding, Short Track, Figure Skating; Alpine Skiing.ts"
	errorcode: number; // 0
	errors: number; // 0
	data_errors: number; // 36
	dvb_eid: number; // 0
	noresched: boolean; // true
	norerecord: boolean; // false
	fileremoved: number; // 0
	uri: string; // "ddprogid://xmltv/EP04120884.0125"
	autorec: string; // ""
	autorec_caption: string; // ""
	timerec: string; // ""
	timerec_caption: string; // ""
	parent: string; // ""
	child: string; // ""
	content_type: number; // 4
	copyright_year: number; // 2022
	broadcast: number; // 0
	episode_disp: string; // "Episode 125"
	url: string; // "dvrfile/b441cd01d9c23512ce399537c6fe6357"
	filesize: number; // 28007225364
	status: "Completed OK"; // "Completed OK"
	sched_status: "completed" | 'recording'; // "completed"
	duplicate: number; // 0
	first_aired: number; // 0
	comment: string; // "Auto recording: The Ray Bradbury Theater - Created from EPG query" 
	category: []; // []
	credits: {}; // {}
	keyword: []; // []
	genre: []; // []
};

// /api/dvr/entry/grid_upcoming
// /api/epg/events/grid
export type Grid = {
	entries: Entry[];
	total: number; // 219
};