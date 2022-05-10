import { GridUpcomingEntry } from "../../dvr/entry/grid_upcoming/responsemodel";
export type idnodeLoadRequest = idnodeLoadGridRequest | idnodeLoadMetaRequest;
type idnodeLoadGridRequest = {
	"grid": "1",
	uuid: string[],
	list: Array<
		keyof Omit<GridUpcomingEntry, "uuid"> | "copyright_year" | "owner"
	>
	};
type idnodeLoadMetaRequest = {"meta": "1"};