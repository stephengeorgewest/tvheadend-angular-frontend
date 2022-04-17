import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { cometMessage, diskspaceBase } from "./ws/responsemodel";
import { CreateByEventRequest } from "./dvr/entry/create_by_event/requestmodel";
import { CreateByEventResponse } from "./dvr/entry/create_by_event/responsemodel";
import { GridUpcomingRequest } from "./dvr/entry/grid_upcoming/requestmodel";
import { GridUpcomingResponse } from "./dvr/entry/grid_upcoming/responsemodel";
import { StopBydvrUUIDRequest } from "./dvr/entry/stop/requestmodel";
import { GridEntry, GridResponse } from "./epg/events/grid/responsemodel";
import { GridRequest } from "./grid-request";
import { DeleteBydvrUUIDRequest } from "./idnode/delete/requestmodel";
import { fetchData } from "./util";

/*enum access_enum = {
	ACCESS_ADMIN,
	ACCESS_ANONYMOUS,
	ACCESS_OR,
	ACCESS_WEB_INTERFACE,
	ACCESS_HTSP_INTERFACE
};*/
type access = "ACCESS_ADMIN" |
	"ACCESS_ANONYMOUS" |
	"ACCESS_RECORDER" |
	"ACCESS_OR" |
	"ACCESS_WEB_INTERFACE" |
	"ACCESS_HTSP_INTERFACE";

type webInterface = { path: string; permissions: access | access[]; className: string, dataType: string | null };
const api: Map<string, webInterface[]> = new Map([[
	"api.c", [
		{ path: "serverinfo", permissions: "ACCESS_ANONYMOUS", className: "api_serverinfo", dataType: null },

		{ path: "pathlist", permissions: "ACCESS_ANONYMOUS", className: "api_pathlist", dataType: null },
	]], [
	"api_access.c", [
		{ path: "passwd/entry/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&passwd_entry_class" },
		{ path: "passwd/entry/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_passwd_entry_grid" },
		{ path: "passwd/entry/create", permissions: "ACCESS_ADMIN", className: "api_passwd_entry_create", dataType: null },
		{ path: "ipblock/entry/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&ipblock_entry_class" },
		{ path: "ipblock/entry/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_ipblock_entry_grid" },
		{ path: "ipblock/entry/create", permissions: "ACCESS_ADMIN", className: "api_ipblock_entry_create", dataType: null },
		{ path: "access/entry/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&access_entry_class" },
		{ path: "access/entry/userlist", permissions: "ACCESS_ANONYMOUS", className: "api_access_entry_userlist", dataType: null },
		{ path: "access/entry/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_access_entry_grid" },
		{ path: "access/entry/create", permissions: "ACCESS_ADMIN", className: "api_access_entry_create", dataType: null },
	]], [
	"api_bouquet.c", [
		{ path: "bouquet/list", permissions: "ACCESS_ADMIN", className: "api_bouquet_list", dataType: null },
		{ path: "bouquet/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&bouquet_class" },
		{ path: "bouquet/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_bouquet_grid" },
		{ path: "bouquet/create", permissions: "ACCESS_ADMIN", className: "api_bouquet_create", dataType: null },
		{ path: "bouquet/scan", permissions: "ACCESS_ADMIN", className: "api_bouquet_scan", dataType: null },
		{ path: "bouquet/detach", permissions: "ACCESS_ADMIN", className: "api_bouquet_detach", dataType: null },
	]], [
	"api_caclient.c", [
		{ path: "caclient/list", permissions: "ACCESS_ADMIN", className: "api_caclient_list", dataType: null },
		{ path: "caclient/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&caclient_class" },
		{ path: "caclient/builders", permissions: "ACCESS_ADMIN", className: "api_caclient_builders", dataType: null },
		{ path: "caclient/create", permissions: "ACCESS_ADMIN", className: "api_caclient_create", dataType: null },
	]], [
	"api_channel.c", [
		{ path: "channel/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&channel_class" },
		{ path: "channel/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_channel_grid" },
		{ path: "channel/list", permissions: "ACCESS_ANONYMOUS", className: "api_channel_list", dataType: null },
		{ path: "channel/create", permissions: "ACCESS_ADMIN", className: "api_channel_create", dataType: null },
		{ path: "channel/rename", permissions: "ACCESS_ADMIN", className: "api_channel_rename", dataType: null }, /* User convenience function */
		{ path: "channeltag/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&channel_tag_class" },
		{ path: "channeltag/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_channel_tag_grid" },
		{ path: "channeltag/list", permissions: "ACCESS_ANONYMOUS", className: "api_channel_tag_list", dataType: null },
		{ path: "channeltag/create", permissions: "ACCESS_ADMIN", className: "api_channel_tag_create", dataType: null },
		{ path: "channelcategory/list", permissions: "ACCESS_ANONYMOUS", className: "api_channel_cat_list", dataType: null },
	]], [
	"api_codec.c", [
		{
			path: "codec/list", permissions: "ACCESS_ADMIN", className: "api_codec_list", dataType: null
		},
		{
			path: "codec_profile/list", permissions: "ACCESS_ANONYMOUS", className: "api_codec_profile_list", dataType: null
		},
		{
			path: "codec_profile/create", permissions: "ACCESS_ADMIN", className: "api_codec_profile_create", dataType: null
		},
		{ path: "codec_profile/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&codec_profile_class" },
	]], [
	"api_config.c", [
		{ path: "config/capabilities", permissions: ["ACCESS_OR", "ACCESS_WEB_INTERFACE", "ACCESS_HTSP_INTERFACE"], className: "api_config_capabilities", dataType: null },
		{ path: "config/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&config" },
		{ path: "config/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&config" },
		{ path: "tvhlog/config/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&tvhlog_conf" },
		{ path: "tvhlog/config/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&tvhlog_conf" },
		{ path: "memoryinfo/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void *) & memoryinfo_class" },
		{ path: "memoryinfo/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_memoryinfo_grid" },
	]], [
	"api_dvr.c", [
		{
			path: "dvr/config/class", permissions: ["ACCESS_OR", "ACCESS_ADMIN", "ACCESS_RECORDER"],
			className: "api_idnode_class", dataType: "(void*)&dvr_config_class"
		},
		{
			path: "dvr/config/grid", permissions: ["ACCESS_OR", "ACCESS_ADMIN", "ACCESS_RECORDER"],
			className: "api_idnode_grid", dataType: "api_dvr_config_grid"
		},
		{ path: "dvr/config/create", permissions: "ACCESS_ADMIN", className: "api_dvr_config_create", dataType: null },
		{ path: "dvr/entry/class", permissions: "ACCESS_RECORDER", className: "api_idnode_class", dataType: "(void*)&dvr_entry_class" },
		{ path: "dvr/entry/grid", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_entry_grid" },
		{ path: "dvr/entry/grid_upcoming", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_entry_grid_upcoming" },
		{ path: "dvr/entry/grid_finished", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_entry_grid_finished" },
		{ path: "dvr/entry/grid_failed", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_entry_grid_failed" },
		{ path: "dvr/entry/grid_removed", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_entry_grid_removed" },
		{ path: "dvr/entry/create", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_create", dataType: null },
		{
			path: "dvr/entry/create_by_event",
			permissions: "ACCESS_RECORDER",
			className: "api_dvr_entry_create_by_event",
			dataType: null
		},
		{ path: "dvr/entry/rerecord/toggle", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_rerecord_toggle", dataType: null },
		{ path: "dvr/entry/rerecord/deny", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_rerecord_deny", dataType: null },
		{ path: "dvr/entry/rerecord/allow", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_rerecord_allow", dataType: null },
		{ path: "dvr/entry/stop", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_stop", dataType: null },   /* Stop active recording gracefully */
		{ path: "dvr/entry/cancel", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_cancel", dataType: null }, /* Cancel scheduled or active recording */
		{ path: "dvr/entry/prevrec/toggle", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_prevrec_toggle", dataType: null },
		{ path: "dvr/entry/prevrec/set", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_prevrec_set", dataType: null },
		{ path: "dvr/entry/prevrec/unset", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_prevrec_unset", dataType: null },
		{ path: "dvr/entry/remove", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_remove", dataType: null }, /* Remove recorded files from storage */
		{ path: "dvr/entry/filemoved", permissions: "ACCESS_ADMIN", className: "api_dvr_entry_file_moved", dataType: null },
		{ path: "dvr/entry/move/finished", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_move_finished", dataType: null },
		{ path: "dvr/entry/move/failed", permissions: "ACCESS_RECORDER", className: "api_dvr_entry_move_failed", dataType: null },
		{ path: "dvr/autorec/class", permissions: "ACCESS_RECORDER", className: "api_idnode_class", dataType: "(void*)&dvr_autorec_entry_class" },
		{ path: "dvr/autorec/grid", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_autorec_grid" },
		{ path: "dvr/autorec/create", permissions: "ACCESS_RECORDER", className: "api_dvr_autorec_create", dataType: null },
		{ path: "dvr/autorec/create_by_series", permissions: "ACCESS_RECORDER", className: "api_dvr_autorec_create_by_series", dataType: null },
		{ path: "dvr/timerec/class", permissions: "ACCESS_RECORDER", className: "api_idnode_class", dataType: "(void*)&dvr_timerec_entry_class" },
		{ path: "dvr/timerec/grid", permissions: "ACCESS_RECORDER", className: "api_idnode_grid", dataType: "api_dvr_timerec_grid" },
		{ path: "dvr/timerec/create", permissions: "ACCESS_RECORDER", className: "api_dvr_timerec_create", dataType: null },
	]], [
	"api_epg.c", [
		{ path: "epg/events/grid", permissions: "ACCESS_ANONYMOUS", className: "api_epg_grid", dataType: null },
		{ path: "epg/events/alternative", permissions: "ACCESS_ANONYMOUS", className: "api_epg_alternative", dataType: null },
		{ path: "epg/events/related", permissions: "ACCESS_ANONYMOUS", className: "api_epg_related", dataType: null },
		{ path: "epg/events/load", permissions: "ACCESS_ANONYMOUS", className: "api_epg_load", dataType: null },
		{ path: "epg/content_type/list", permissions: "ACCESS_ANONYMOUS", className: "api_epg_content_type_list", dataType: null },
	]], [
	"api_epggrab.c", [
		{ path: "epggrab/channel/list", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_load_by_class", dataType: "(void*)&epggrab_channel_class" },
		{ path: "epggrab/channel/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&epggrab_channel_class" },
		{ path: "epggrab/channel/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_epggrab_channel_grid" },
		{ path: "epggrab/module/list", permissions: "ACCESS_ADMIN", className: "api_epggrab_module_list", dataType: null },
		{ path: "epggrab/config/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&epggrab_conf.idnode" },
		{ path: "epggrab/config/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&epggrab_conf.idnode" },
		{ path: "epggrab/ota/trigger", permissions: "ACCESS_ADMIN", className: "api_epggrab_ota_trigger", dataType: null },
		{ path: "epggrab/internal/rerun", permissions: "ACCESS_ADMIN", className: "api_epggrab_rerun_internal", dataType: null },
	]], [
	"api_esfilter.c", [
		{ path: "esfilter/video/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&esfilter_class_video" },
		{ path: "esfilter/video/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_esfilter_grid_video" },
		{ path: "esfilter/video/create", permissions: "ACCESS_ADMIN", className: "api_esfilter_create_video", dataType: null },
		{ path: "esfilter/audio/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&esfilter_class_audio" },
		{ path: "esfilter/audio/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_esfilter_grid_audio" },
		{ path: "esfilter/audio/create", permissions: "ACCESS_ADMIN", className: "api_esfilter_create_audio", dataType: null },
		{ path: "esfilter/teletext/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&esfilter_class_teletext" },
		{ path: "esfilter/teletext/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_esfilter_grid_teletext" },
		{ path: "esfilter/teletext/create", permissions: "ACCESS_ADMIN", className: "api_esfilter_create_teletext", dataType: null },
		{ path: "esfilter/subtit/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&esfilter_class_subtit" },
		{ path: "esfilter/subtit/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_esfilter_grid_subtit" },
		{ path: "esfilter/subtit/create", permissions: "ACCESS_ADMIN", className: "api_esfilter_create_subtit", dataType: null },
		{ path: "esfilter/ca/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&esfilter_class_ca" },
		{ path: "esfilter/ca/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_esfilter_grid_ca" },
		{ path: "esfilter/ca/create", permissions: "ACCESS_ADMIN", className: "api_esfilter_create_ca", dataType: null },
		{ path: "esfilter/other/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: "(void*)&esfilter_class_other" },
		{ path: "esfilter/other/grid", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_grid", dataType: "api_esfilter_grid_other" },
		{ path: "esfilter/other/create", permissions: "ACCESS_ADMIN", className: "api_esfilter_create_other", dataType: null },
	]], [
	"api_idnode.c", [
		{ path: "idnode/load", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_load", dataType: null },
		{ path: "idnode/save", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_save", dataType: null },
		{ path: "idnode/tree", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_tree", dataType: null },
		{ path: "idnode/class", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_class", dataType: null },
		{ path: "idnode/delete", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_delete", dataType: null },
		{ path: "idnode/moveup", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_moveup", dataType: null },
		{ path: "idnode/movedown", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_movedown", dataType: null },
	]], [
	"api_imagecache.c", [
		{ path: "imagecache/config/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&imagecache_conf" },
		{ path: "imagecache/config/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&imagecache_conf" },
		{ path: "imagecache/config/clean", permissions: "ACCESS_ADMIN", className: "api_imagecache_clean", dataType: null },
		{ path: "imagecache/config/trigger", permissions: "ACCESS_ADMIN", className: "api_imagecache_trigger", dataType: null },
	]], [
	"api_input.c", [
		{ path: "hardware/tree", permissions: "ACCESS_ADMIN", className: "api_idnode_tree", dataType: "api_input_hw_tree" },
		//#if ENABLE_SATIP_CLIENT
		{ path: "hardware/satip/discover", permissions: "ACCESS_ADMIN", className: "api_input_satip_discover", dataType: null },
		//#endif
	]], [
	"api_intlconv.c", [
		{ path: "intlconv/charsets", permissions: "ACCESS_ANONYMOUS", className: "api_intlconv_charset_enum", dataType: null },
	]], [
	"api_language.c", [
		{ path: "language/list", permissions: "ACCESS_ANONYMOUS", className: "api_language_enum", dataType: null },
		{ path: "language/locale", permissions: "ACCESS_ANONYMOUS", className: "api_language_locale_enum", dataType: null },
		{ path: "language/ui_locale", permissions: "ACCESS_ANONYMOUS", className: "api_language_ui_locale_enum", dataType: null },
	]], [
	"api_mpegts.c", [
		{ path: "mpegts/input/network_list", permissions: "ACCESS_ADMIN", className: "api_mpegts_input_network_list", dataType: null },
		{ path: "mpegts/network/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_mpegts_network_grid" },
		{ path: "mpegts/network/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&mpegts_network_class" },
		{ path: "mpegts/network/builders", permissions: "ACCESS_ADMIN", className: "api_mpegts_network_builders", dataType: null },
		{ path: "mpegts/network/create", permissions: "ACCESS_ADMIN", className: "api_mpegts_network_create", dataType: null },
		{ path: "mpegts/network/mux_class", permissions: "ACCESS_ADMIN", className: "api_mpegts_network_muxclass", dataType: null },
		{ path: "mpegts/network/mux_create", permissions: "ACCESS_ADMIN", className: "api_mpegts_network_muxcreate", dataType: null },
		{ path: "mpegts/network/scan", permissions: "ACCESS_ADMIN", className: "api_mpegts_network_scan", dataType: null },
		{ path: "mpegts/mux/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_mpegts_mux_grid" },
		{ path: "mpegts/mux/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&mpegts_mux_class" },
		{ path: "mpegts/service/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_mpegts_service_grid" },
		{ path: "mpegts/service/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&mpegts_service_class" },
		{ path: "mpegts/mux_sched/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&mpegts_mux_sched_class" },
		{ path: "mpegts/mux_sched/grid", permissions: "ACCESS_ADMIN", className: "api_idnode_grid", dataType: "api_mpegts_mux_sched_grid" },
		{ path: "mpegts/mux_sched/create", permissions: "ACCESS_ADMIN", className: "api_mpegts_mux_sched_create", dataType: null },
		//#if ENABLE_MPEGTS_DVB
		{ path: "dvb/orbitalpos/list", permissions: "ACCESS_ADMIN", className: "api_dvb_orbitalpos_list", dataType: null },
		{ path: "dvb/scanfile/list", permissions: "ACCESS_ADMIN", className: "api_dvb_scanfile_list", dataType: null },
		//#endif
	]], [
	"api_profile.c", [
		{ path: "profile/list", permissions: "ACCESS_ANONYMOUS", className: "api_profile_list", dataType: null },
		{ path: "profile/class", permissions: "ACCESS_ADMIN", className: "api_idnode_class", dataType: "(void*)&profile_class" },
		{ path: "profile/builders", permissions: "ACCESS_ADMIN", className: "api_profile_builders", dataType: null },
		{ path: "profile/create", permissions: "ACCESS_ADMIN", className: "api_profile_create", dataType: null },
	]], [
	"api_raw.c", [
		{ path: "classes", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_classes", dataType: null },
		{ path: "raw/export", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_raw_export", dataType: null },
		{ path: "raw/import", permissions: "ACCESS_ANONYMOUS", className: "api_idnode_raw_import", dataType: null },
	]], [
	"api_satip.c", [
		{ path: "satips/config/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&satip_server_conf" },
		{ path: "satips/config/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&satip_server_conf" },
	]], [
	"api_service.c", [
		{ path: "service/mapper/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&service_mapper_conf" },
		{ path: "service/mapper/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&service_mapper_conf" },
		{ path: "service/mapper/stop", permissions: "ACCESS_ADMIN", className: "api_mapper_stop", dataType: null },
		{ path: "service/mapper/status", permissions: "ACCESS_ADMIN", className: "api_mapper_status", dataType: null },
		{ path: "service/list", permissions: "ACCESS_ADMIN", className: "api_idnode_load_by_class", dataType: "(void*)&service_class" },
		{ path: "service/streams", permissions: "ACCESS_ADMIN", className: "api_service_streams", dataType: null },
		{ path: "service/removeunseen", permissions: "ACCESS_ADMIN", className: "api_service_remove_unseen", dataType: null },
	]], [
	"api_status.c", [
		{ path: "status/connections", permissions: "ACCESS_ADMIN", className: "api_status_connections", dataType: null },
		{ path: "status/subscriptions", permissions: "ACCESS_ADMIN", className: "api_status_subscriptions", dataType: null },
		{ path: "status/inputs", permissions: "ACCESS_ADMIN", className: "api_status_inputs", dataType: null },
		{ path: "status/inputclrstats", permissions: "ACCESS_ADMIN", className: "api_status_input_clear_stats", dataType: null },
		{ path: "connections/cancel", permissions: "ACCESS_ADMIN", className: "api_connections_cancel", dataType: null },
	]], [
	"api_timeshift.c", [
		{ path: "timeshift/config/load", permissions: "ACCESS_ADMIN", className: "api_idnode_load_simple", dataType: "&timeshift_conf" },
		{ path: "timeshift/config/save", permissions: "ACCESS_ADMIN", className: "api_idnode_save_simple", dataType: "&timeshift_conf" },
	]], [
	"api_wizard.c", [
		{ path: "wizard/hello/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_hello" },
		{ path: "wizard/hello/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_hello" },
		{ path: "wizard/login/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_login" },
		{ path: "wizard/login/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_login" },
		{ path: "wizard/network/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_network" },
		{ path: "wizard/network/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_network" },
		{ path: "wizard/muxes/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_muxes" },
		{ path: "wizard/muxes/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_muxes" },
		{ path: "wizard/status/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_status" },
		{ path: "wizard/status/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_status" },
		{ path: "wizard/status/progress", permissions: "ACCESS_ADMIN", className: "wizard_status_progress", dataType: null },
		{ path: "wizard/mapping/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_mapping" },
		{ path: "wizard/mapping/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_mapping" },
		{ path: "wizard/channels/load", permissions: "ACCESS_ADMIN", className: "wizard_idnode_load_simple", dataType: "wizard_channels" },
		{ path: "wizard/channels/save", permissions: "ACCESS_ADMIN", className: "wizard_idnode_save_simple", dataType: "wizard_channels" },
		{ path: "wizard/start", permissions: "ACCESS_ADMIN", className: "wizard_start", dataType: null },
		{ path: "wizard/cancel", permissions: "ACCESS_ADMIN", className: "wizard_cancel", dataType: null },
	]]
]);

const pathlist = ["access/entry/class", "access/entry/create", "access/entry/grid", "access/entry/userlist", "bouquet/class", "bouquet/create", "bouquet/detach", "bouquet/grid", "bouquet/list", "bouquet/scan", "caclient/builders", "caclient/class", "caclient/create", "caclient/list", "channel/class", "channel/create", "channel/grid", "channel/list", "channel/rename", "channelcategory/list", "channeltag/class", "channeltag/create", "channeltag/grid", "channeltag/list", "classes", "codec/list", "codec_profile/class", "codec_profile/create", "codec_profile/list", "config/capabilities", "config/load", "config/save", "connections/cancel", "dvb/orbitalpos/list", "dvb/scanfile/list", "dvr/autorec/class", "dvr/autorec/create", "dvr/autorec/create_by_series", "dvr/autorec/grid", "dvr/config/class", "dvr/config/create", "dvr/config/grid", "dvr/entry/cancel", "dvr/entry/class", "dvr/entry/create", "dvr/entry/create_by_event", "dvr/entry/filemoved", "dvr/entry/grid", "dvr/entry/grid_failed", "dvr/entry/grid_finished", "dvr/entry/grid_removed", "dvr/entry/grid_upcoming", "dvr/entry/move/failed", "dvr/entry/move/finished", "dvr/entry/prevrec/set", "dvr/entry/prevrec/toggle", "dvr/entry/prevrec/unset", "dvr/entry/remove", "dvr/entry/rerecord/allow", "dvr/entry/rerecord/deny", "dvr/entry/rerecord/toggle", "dvr/entry/stop", "dvr/timerec/class", "dvr/timerec/create", "dvr/timerec/grid", "epg/content_type/list", "epg/events/alternative", "epg/events/grid", "epg/events/load", "epg/events/related", "epggrab/channel/class", "epggrab/channel/grid", "epggrab/channel/list", "epggrab/config/load", "epggrab/config/save", "epggrab/internal/rerun", "epggrab/module/list", "epggrab/ota/trigger", "esfilter/audio/class", "esfilter/audio/create", "esfilter/audio/grid", "esfilter/ca/class", "esfilter/ca/create", "esfilter/ca/grid", "esfilter/other/class", "esfilter/other/create", "esfilter/other/grid", "esfilter/subtit/class", "esfilter/subtit/create", "esfilter/subtit/grid", "esfilter/teletext/class", "esfilter/teletext/create", "esfilter/teletext/grid", "esfilter/video/class", "esfilter/video/create", "esfilter/video/grid", "hardware/satip/discover", "hardware/tree", "idnode/class", "idnode/delete", "idnode/load", "idnode/movedown", "idnode/moveup", "idnode/save", "idnode/tree", "imagecache/config/clean", "imagecache/config/load", "imagecache/config/save", "imagecache/config/trigger", "intlconv/charsets", "ipblock/entry/class", "ipblock/entry/create", "ipblock/entry/grid", "language/list", "language/locale", "language/ui_locale", "memoryinfo/class", "memoryinfo/grid", "mpegts/input/network_list", "mpegts/mux/class", "mpegts/mux/grid", "mpegts/mux_sched/class", "mpegts/mux_sched/create", "mpegts/mux_sched/grid", "mpegts/network/builders", "mpegts/network/class", "mpegts/network/create", "mpegts/network/grid", "mpegts/network/mux_class", "mpegts/network/mux_create", "mpegts/network/scan", "mpegts/service/class", "mpegts/service/grid", "passwd/entry/class", "passwd/entry/create", "passwd/entry/grid", "pathlist", "profile/builders", "profile/class", "profile/create", "profile/list", "raw/export", "raw/import", "satips/config/load", "satips/config/save", "serverinfo", "service/list", "service/mapper/load", "service/mapper/save", "service/mapper/status", "service/mapper/stop", "service/removeunseen", "service/streams", "status/connections", "status/inputclrstats", "status/inputs", "status/subscriptions", "timeshift/config/load", "timeshift/config/save", "tvhlog/config/load", "tvhlog/config/save", "wizard/cancel", "wizard/channels/load", "wizard/channels/save", "wizard/hello/load", "wizard/hello/save", "wizard/login/load", "wizard/login/save", "wizard/mapping/load", "wizard/mapping/save", "wizard/muxes/load", "wizard/muxes/save", "wizard/network/load", "wizard/network/save", "wizard/start", "wizard/status/load", "wizard/status/progress", "wizard/status/save"];

@Injectable({
	providedIn: 'root',
})
export class ApiService implements OnDestroy {
	private websocket: WebSocket;
	constructor() {
		this.websocket = new WebSocket("ws" + environment.server.secure + "://" + environment.server.host + ":" + environment.server.port + "/comet/ws");
		this.websocket.onmessage = (m) => this.onMessage(m);
	}
	ngOnDestroy(): void {
		this.websocket.close();
	}

	private onMessage(message: MessageEvent<any>) {
		const data = JSON.parse(message.data) as cometMessage;
		let dvr_uuids_to_reload: Set<string> = new Set();
		let dvr_uuids_to_delete: Set<string> = new Set();
		let epg_id_to_reload: Set<string> = new Set();
		let epg_id_to_delete: Set<string> = new Set();
		let services_to_reload: Set<string> = new Set();
		data.messages.forEach(m => {
			if ("reload" in m) {
				if (m.reload)
					switch (m.notificationClass) {
						case "dvrentry":
							services_to_reload.add(m.notificationClass);
							break;
						default:
							console.log("unhandled reload message", m)
					}
			}
			else {
				switch (m.notificationClass) {
					case "epg":
						if (m.delete)
							m.delete.forEach(epg_id_to_delete.add, epg_id_to_delete);
						if (m.update)
							m.update.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.create)
							m.create.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.dvr_delete)
							m.dvr_delete.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.dvr_update)
							m.dvr_update.forEach(epg_id_to_reload.add, epg_id_to_reload);
						if (m.dvr_create)
							m.dvr_create.forEach(epg_id_to_reload.add, epg_id_to_reload);
						break;
					case "dvrentry":
						if (m.delete)
							m.delete.forEach(dvr_uuids_to_delete.add, dvr_uuids_to_delete);

						if (m.update)
							m.update.forEach(dvr_uuids_to_reload.add, dvr_uuids_to_reload);
						if (m.create)
							m.create.forEach(dvr_uuids_to_reload.add, dvr_uuids_to_reload);
						if (m.change)
							m.change.forEach(dvr_uuids_to_reload.add, dvr_uuids_to_reload);
						break;
					case "diskspaceUpdate":
						this.diskUsageResponse = {
							totaldiskspace: m.totaldiskspace,
							useddiskspace: m.useddiskspace,
							freediskspace: m.freediskspace
						};
						this.diskUsageSubject.next(this.diskUsageResponse);
						break;
					case "accessUpdate":
						if(m.totaldiskspace && m.useddiskspace && m.freediskspace)
						this.diskUsageResponse = {
							totaldiskspace: m.totaldiskspace,
							useddiskspace: m.useddiskspace,
							freediskspace: m.freediskspace
						};
						this.diskUsageSubject.next(this.diskUsageResponse);
						console.log("unhandlede access update message bits", m);
						break;
					default:
						console.log("unhandlede message", m);
				}
			}
		});

		this.refreshEpgByUUID([...dvr_uuids_to_reload, ...dvr_uuids_to_delete], [...epg_id_to_reload].map((id) => parseInt(id)));

		if (dvr_uuids_to_reload.size) {
			if (this.gridUpcomingResponse)
				this.refreshGridUpcoming();
			if (this.gridFinishedResponse)
				this.refreshGridFinished();
		}
		else if (dvr_uuids_to_delete.size) {
			if (this.gridUpcomingResponse) {
				let refresh = false;
				dvr_uuids_to_delete.forEach(d => {
					const index = this.gridUpcomingResponse?.entries.findIndex(e => e.uuid === d) ?? -1;
					if (index !== -1) {
						this.gridUpcomingResponse?.entries.splice(index, 1);
						refresh = true;
					}
				});
				if (refresh)
					this.gridUpcomingSubject.next(this.gridUpcomingResponse);
			}
			if (this.gridFinishedResponse) {
				let refresh = false;
				dvr_uuids_to_delete.forEach(d => {
					const index = this.gridFinishedResponse?.entries.findIndex(e => e.uuid === d) ?? -1;
					if (index !== -1) {
						this.gridFinishedResponse?.entries.splice(index, 1);
						refresh = true;
					}
				});
				if (refresh)
					this.gridFinishedSubject.next(this.gridFinishedResponse);
			}
		}
	}

	private epgGridResponse: GridResponse | undefined = undefined;
	private epgGridSubject: BehaviorSubject<GridResponse | undefined> = new BehaviorSubject(this.epgGridResponse);
	public onEpgGridResponse(): Observable<GridResponse | undefined> {
		return this.epgGridSubject.asObservable();
	}

	private refreshEpgEvents(eventIDs: number[] | number) {
		fetchData("epg/events/load", { eventId: eventIDs }).then((data: GridResponse) => {
			let refreshable = false;
			data.entries.forEach(e => {
				if (!this.epgGridResponse) {
					this.epgGridResponse = {
						totalCount: 1,
						entries: [e]
					};
					refreshable = true;
				}
				else {
					const matchingEntry = this.epgGridResponse?.entries.findIndex(gridEntry => gridEntry.eventId === e.eventId);
					if (matchingEntry !== -1) {
						this.epgGridResponse.entries[matchingEntry] = e;
						refreshable = true;
					}
					else {
						// should never be hit, error instead?
						this.epgGridResponse.entries.push(e);
						this.epgGridResponse.totalCount++;
						refreshable = true;
					}
				}
			});
			if (refreshable)
				this.epgGridSubject.next(this.epgGridResponse);
		});
	}

	private epgOptions: GridRequest<GridResponse> = { dir: "ASC", duplicates: 0, start: 0, limit: 300 };
	public refreshEpgGrid(options?: GridRequest<GridResponse>) {
		if (options) {
			this.epgOptions = options;
		}
		fetchData('epg/events/grid', this.epgOptions).then(data => {
			this.epgGridResponse = data;
			this.epgGridSubject.next(this.epgGridResponse);
		});
	}

	public createByEvent(options: CreateByEventRequest) {
		return fetchData("dvr/entry/create_by_event", options).then(response => {
			const eventResponse = response as CreateByEventResponse;// todo validation?
			eventResponse.uuid.forEach(u => {
				const entry = this.epgGridResponse?.entries.find(e => options.event_id === e.eventId);
				if (entry)
					entry.dvrUuid = u;
			});
			this.epgGridSubject.next(this.epgGridResponse);
		});
	}

	public stopByGridEntry(options: Pick<GridEntry, "dvrUuid" | "eventId">) {
		if (!options.dvrUuid) {
			return Promise.reject(() => "error");
		}
		return this.stopBydvrUUID({ uuid: options.dvrUuid });
	}

	private gridUpcomingResponse: GridUpcomingResponse | undefined = undefined;
	private gridUpcomingSubject: BehaviorSubject<GridUpcomingResponse | undefined> = new BehaviorSubject(this.gridUpcomingResponse);
	public onGridUpcomingResponse(): Observable<GridUpcomingResponse | undefined> {
		return this.gridUpcomingSubject.asObservable();
	}
	public stopBydvrUUID(options: StopBydvrUUIDRequest) {
		return fetchData("dvr/entry/stop", options);
	}
	private options: GridUpcomingRequest = { sort: "start_real", dir: "ASC", duplicates: 0 };
	public refreshGridUpcoming(options?: GridUpcomingRequest) {
		if (options) this.options = options;
		fetchData('dvr/entry/grid_upcoming', this.options).then((data: GridUpcomingResponse) => {
			this.gridUpcomingResponse = data;
			this.gridUpcomingSubject.next(this.gridUpcomingResponse)
		});
	};

	public deleteIdNode(options: DeleteBydvrUUIDRequest) {
		return fetchData("idnode/delete", options);
	}

	private refreshEpgByUUID(uuids: string[], additional?: number[]) {
		const refreshable = this.epgGridResponse?.entries.filter(e => e.dvrUuid && uuids.indexOf(e.dvrUuid) !== -1).map(e => e.eventId) ?? [];

		if (additional)
			refreshable.push(...additional);
		if (refreshable.length) {
			this.refreshEpgEvents(refreshable);
		}
	}

	private gridFinishedResponse: GridUpcomingResponse | undefined = undefined;
	private gridFinishedSubject: BehaviorSubject<GridUpcomingResponse | undefined> = new BehaviorSubject(this.gridFinishedResponse);
	public onGridFinishedResponse(): Observable<GridUpcomingResponse | undefined> {
		return this.gridFinishedSubject.asObservable();
	}
	public refreshGridFinished() {
		fetchData(
			'dvr/entry/grid_finished',
			{ start: 0, dir: "ASC", duplicates: 0, limit: 999999999 } as GridUpcomingRequest).then(
				data => {
					this.gridFinishedResponse = data;
					this.gridFinishedSubject.next(this.gridFinishedResponse);
				}
			);
	}


	private diskUsageResponse: diskspaceBase | undefined = undefined;
	private diskUsageSubject: BehaviorSubject<diskspaceBase | undefined> = new BehaviorSubject(this.diskUsageResponse);
	public onDiskUsage() {
		return this.diskUsageSubject.asObservable();
	}
}