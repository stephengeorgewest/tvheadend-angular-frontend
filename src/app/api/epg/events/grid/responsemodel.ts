import { Entry } from "../../../entry";
export interface GridResponse {
	totalCount: number;
	entries: GridEntry[];
}

export interface GridEntry extends Entry {
	title: string;
	description?: string;
	subtitle?: string;

	eventId: number;
	episodeUri?: string;
	channelUuid: string;
	channelName: string;
	channelNumber: string;
	channelIcon: string;
	nextEventId?: number;
	serieslinkUri?: string;

	repeat?: number;
	subtitled?: number;
	seasonNumber?: number;
	episodeNumber?: number;
	episodeOnscreen?: string;
	ageRating?: number;
	new?: number;
}