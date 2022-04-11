import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

import { DvrUpcomingEntryComponent } from './upcoming-entry.component';
import { NewDatePipe } from 'src/app/date-from-unix-date.pipe';

describe('DvrUpcomingEntryComponent', () => {
	let component: DvrUpcomingEntryComponent;
	let fixture: ComponentFixture<DvrUpcomingEntryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: {} },
				{ provide: MatDialogRef, useValue: {} }
			],
			declarations: [DvrUpcomingEntryComponent, NewDatePipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DvrUpcomingEntryComponent);
		component = fixture.componentInstance;
		component.entry = {
			uuid: "uuid",
			channel: "channel",
		
			title: {eng: "title"},
			description: {eng: "description"},
			subtitle: {eng: "subtitle"},
			channel_icon: "channel_icon",
			channelname: "channelname",
			image: "image",
		
			enabled: true,
			create: 1,
			watched: 1,
		
			start: 1,
			stop: 2,
			start_extra: 1,
			start_real: 1, 
			stop_extra: 1,
			stop_real: 1,
			duration: 1,
			fanart_image: "fanart_image",
			disp_title: "disp_title",
			disp_subtitle: "disp_subtitle",
			disp_summary: "disp_summary",
			disp_description: "disp_description",
			disp_extratext: "disp_extratext",
			pri: 1,
			retention: 1,
			removal: 1,
			playposition: 1,
			playcount: 1,
			config_name: "config_name",
			creator: "creator?",
			filename: "filename",
			errorcode: 1,
			errors: 1,
			data_errors: 1,
			dvb_eid: 1,
			noresched: true,
			norerecord: true,
			fileremoved: 1,
			uri: "uri?",
			autorec: "autorec",
			autorec_caption: "autorec_caption",
			timerec: "timerec",
			timerec_caption: "timerec_caption",
			parent: "parent",
			child: "child",
			content_type: 1,
			broadcast: 1,
			episode_disp: "episode_disp",
			url: "url",
			filesize: 1,
			status: "status",
			sched_status: "scheduled",
			duplicate: 1,
			first_aired: 1,
			comment: "comment?",
			category: [],
			credits: {},
			keyword: [],
			genre: [],
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
