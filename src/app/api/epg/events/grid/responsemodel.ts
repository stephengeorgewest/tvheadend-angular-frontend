import { dvrEntrySchedstatus } from "src/app/api/models";
import { Entry } from "../../../entry";
export interface GridResponse {
	totalCount: number;
	entries: GridEntry[];
}

/**
 * https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/epg.h#L252
 * ->
 * https://tvheadend.org/projects/tvheadend/repository/tvheadend/revisions/master/entry/src/epg.h#L252
 */
export interface GridEntry extends Entry {
	eventId: number;
	episodeUri?: string;
	serieslinkUri?: string;

	//api_epg_add_channel
	channelName: string;
	channelUuid: string;
	/**
	 * "%u.%u" or "%u"
	 */
	channelNumber?: string;
	channelIcon?: string;

	//entry.start
	//entry.stop
	title?: string;
	subtitle?: string;
	summary?: string;
	description?: string;
	/**
	 * Cast/Credits map of name -> role type (actor, presenter, director, etc).
	 */
	credits?: any;
	/**
	 * Extra categories (typically from xmltv) such as "Western" or "Sumo Wrestling".
	 * These extra categories are often a superset of our EN 300 468 DVB genre.
	 * Used with drop-down lists in the GUI.
	 */
	category?: string[];
	/**
	 * Extra keywords (typically from xmltv) such as "Wild West" or "Unicorn".
	 */
	keyword?: string[];
	/**
	 * uint8_t                    is_new;           ///< New series / file premiere
	 */
	new?: number;
	/**
	 * uint8_t                    is_repeat;        ///< Repeat screening
	 */
	repeat?: number;
	/**
	 * uint8_t                    is_widescreen;    ///< Is widescreen
	 */
	widescreen?: number;
	/**
	 * uint8_t                    is_deafsigned;    ///< In screen signing
	 */
	deafsigned?: number;
	/**
	 * uint8_t                    is_subtitled;     ///< Teletext subtitles
	 */
	subtitled?: number;
	/**
	 * uint8_t                    is_audio_desc;    ///< Audio description
	 */
	audiodesc?: number;
	/**
	 * uint8_t                    is_hd;            ///< Is HD
	 */
	hd?: number;
	/**
	 * uint8_t                    is_bw;            ///< Is black and white
	 */
	bw?: number;
	/**
	 * uint16_t                   lines;            ///< Lines in image (quality)
	 */
	lines?: number;
	/**
	 * uint16_t                   aspect;           ///< Aspect ratio (*100)
	 */
	aspect?:number;
	//  /* Episode info */
	//epg_broadcast_get_epnum(eb, &epnum);
	seasonNumber?: number;
	seasonCount?: number;
	episodeNumber?: number;
	episodeCount?: number;
	partNumber?: number;
	partCount?: number;
	episodeOnscreen?: string;

	//entry.image
	/**
	 * uint8_t                    star_rating;      ///< Star rating
	 */
	starRating?: number;
	/**
	 * uint8_t                    age_rating;       ///< Age certificate
	 */
	ageRating?: number;

	/**
	 * time_t                     first_aired;      ///< Original airdate
	 */
	first_aired?: number;

	//entry.copyright_year
	/**
	 * epg_genre_list_t           genre;            ///< Episode genre(s)
	 */
	genre?: string[];

	dvrUuid?:string;
	dvrState?: dvrEntrySchedstatus;

	nextEventId?: number;
}