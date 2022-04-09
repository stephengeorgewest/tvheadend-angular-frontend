
export type Entry = {
	start: number; // 1644454800
	stop: number; // 1644471000

	duration: number; // 16800
	image: string; // "https://zap2it.tmsimg.com/assets/p21254064_b_v13_aa.jpg"
};

// /api/dvr/entry/grid_upcoming
// /api/epg/events/grid
export type Grid = {
	entries: Entry[];
	total: number; // 219
};

export interface LocaleString {
	eng: string;
}

// https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/dvr/dvr.h#L142
// https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/dvr/dvr_db.c
export type dvrEntrySchedstatus = "scheduled" |
	"recordingError" | "recording" |
	"completed" | "completedError" | "completedRerecord" | "completedWarning" | "unknown";
