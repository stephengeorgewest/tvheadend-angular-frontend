// /api/dvr/entry/grid_upcoming
// /api/status/inputs
export type Grid<T> = {
	entries: T[];
	total: number; // 219
};

// /api/epg/events/grid
export type Grid2<T> = {
	entries: T[];
	totalCount: number;
}

// https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/dvr/dvr.h#L142
// https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/dvr/dvr_db.c
export type dvrEntrySchedstatus = "scheduled" |
	"recordingError" | "recording" |
	"completed" | "completedError" | "completedRerecord" | "completedWarning" | "unknown";
