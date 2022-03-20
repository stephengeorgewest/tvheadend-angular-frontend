import { Entry } from "../../../entry";

export interface GridUpcomingResponse {
	entries: GridUpcomingEntry[];
	total: number;
}

export interface GridUpcomingEntry extends Entry {
	title: Title;
	description?: Title;
	subtitle?: Title;
	channel_icon: string;
	channelname: string;
	image: string;

	uuid: string;
	enabled: boolean;
	create: number;
	watched: number;
	start_extra: number;
	start_real: number;
	stop_extra: number;
	stop_real: number;
	duration: number;
	channel: string;
	fanart_image: string;
	disp_title: string;
	disp_subtitle: string;
	disp_summary: string;
	disp_description: string;
	disp_extratext: string;
	pri: number;
	retention: number;
	removal: number;
	playposition: number;
	playcount: number;
	config_name: string;
	creator?: string;
	filename: string;
	errorcode: number;
	errors: number;
	data_errors: number;
	dvb_eid: number;
	noresched: boolean;
	norerecord: boolean;
	fileremoved: number;
	uri?: string;
	autorec: string;
	autorec_caption: string;
	timerec: string;
	timerec_caption: string;
	parent: string;
	child: string;
	content_type: number;
	broadcast: number;
	episode_disp: string;
	url: string;
	filesize: number;
	status: string;
	sched_status: string;
	duplicate: number;
	first_aired: number;
	comment?: string;
	category: any[];
	credits: Credits;
	keyword: any[];
	genre: any[];
}

interface Credits {
}

interface Title {
	eng: string;
}