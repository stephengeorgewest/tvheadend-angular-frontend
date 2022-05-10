import { GridUpcomingEntry } from "../../dvr/entry/grid_upcoming/responsemodel";

export type idnodeLoadResponse = {
	entries: Array<
		{uuid: string} &
		Partial<Omit<GridUpcomingEntry, "uuid">>
	>};