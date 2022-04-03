
export type CreateByEventRequest = {
	// https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/api/api_dvr.c#L207
	event_id:number;
	config_uuid: string;
	comment?: string;
};
