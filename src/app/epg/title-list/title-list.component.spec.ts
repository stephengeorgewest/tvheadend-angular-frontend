import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from "@angular/material/tabs";
import { CompletePercentPipe } from 'src/app/complete-percent.pipe';

import { coarseTimeGroupKeys, GridEntryLite, TitleListComponent } from './title-list.component';

describe('TitleListComponent', () => {
	let component: TitleListComponent;
	let fixture: ComponentFixture<TitleListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatTabsModule, MatIconModule, MatButtonModule, MatMenuModule],
			declarations: [TitleListComponent, CompletePercentPipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TitleListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe("re-shuffle", () => {
		type start = number; type title = string;
		const a_now_entry:GridEntryLite = {start: 0, stop: 10, title: "a"};
		const a_next_entry:GridEntryLite = {start: 10, stop: 20, title: "a"};
		const a_tomorrow_entry:GridEntryLite = {start: 20, stop: 30, title: "a"};

		const b_now_entry:GridEntryLite = {start: 0, stop: 10, title: "b"};
		const b_tomorrow_entry:GridEntryLite = {start: 50, stop: 60, title: "b"};
		
		const c_now_entry:GridEntryLite = {start: 5, stop: 10, title: "c"};
		const c_next_entry:GridEntryLite = {start: 15, stop: 20, title: "c"};
		const c_tomorrow_entry:GridEntryLite = {start: 20, stop: 30, title: "c"};

		
		
		const d_next_entry:GridEntryLite = {start: 10, stop: 20, title: "d"};
		const d_tomorrow_entry:GridEntryLite = {start: 20, stop: 30, title: "d"};
		const d_nextMonth_entry:GridEntryLite = {start: 30, stop: 40, title: "d"};

		const coarseTimeGroups: {
			[key in coarseTimeGroupKeys]: Map<start, Map<title, GridEntryLite[]>>
		} = {
			past: new Map<start, Map<title, GridEntryLite[]>>(),
			now: new Map<start, Map<title, GridEntryLite[]>>([
				[0, new Map([
					["a", [a_now_entry, a_next_entry, a_tomorrow_entry]],
					["b", [b_now_entry, b_tomorrow_entry]]
				])],
				[5, new Map([
					["c", [c_now_entry, c_next_entry, c_tomorrow_entry]]
				])]
			]),
			next: new Map<start, Map<title, GridEntryLite[]>>([
				[10, new Map([["d", [d_next_entry, d_tomorrow_entry, d_nextMonth_entry]]])]
			]),
			tomorrow: new Map<start, Map<title, GridEntryLite[]>>(),
			nextWeek: new Map<start, Map<title, GridEntryLite[]>>(),
			nextMonth: new Map<start, Map<title, GridEntryLite[]>>()
		}
		const times = {
			now: 11,
			tomorrow: 20,
			nextWeek: 40,
			nextMonth: 80
		};
		beforeEach(() => {
			// component.filteredEntries = new Map();
			// fixture.detectChanges();
			component.a(coarseTimeGroups, times);
		});
		it('past', () => {
			expect(coarseTimeGroups.past).toEqual(new Map<start, Map<title, GridEntryLite[]>>([
				[0, new Map([
					["a", [a_now_entry]],
					["b", [b_now_entry]]
				])],
				[5, new Map([
					["c", [c_now_entry]]
				])]
			]));
		});
		it('now', () => {
			expect(coarseTimeGroups.now).toEqual(new Map<start, Map<title, GridEntryLite[]>>([[10, new Map([
				["a", [a_next_entry, a_tomorrow_entry]],
				["d", [d_next_entry, d_tomorrow_entry, d_nextMonth_entry]]
			])]])
		)});
		it('next', () => {
			expect(coarseTimeGroups.next).toEqual(new Map<start, Map<title, GridEntryLite[]>>([[15, new Map([["c", [c_next_entry, c_tomorrow_entry]]])]]));
		});
		it('tomorrow', () => {
			expect(coarseTimeGroups.tomorrow).toEqual(new Map<start, Map<title, GridEntryLite[]>>());
		});
		it('nextWeek', () => {
			expect(coarseTimeGroups.nextWeek).toEqual(new Map<start, Map<title, GridEntryLite[]>>([[50, new Map([["b", [b_tomorrow_entry]]])]]));
		});
		it('nextMonth', () => {
			expect(coarseTimeGroups.nextMonth).toEqual(new Map<start, Map<title, GridEntryLite[]>>());
		});
	});
});
