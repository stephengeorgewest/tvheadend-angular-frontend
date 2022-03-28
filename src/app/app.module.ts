import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule } from "@angular/forms"
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { UpcomingComponent } from './dvr/upcoming/upcoming.component';
import { UpcomingEntryListComponent } from './dvr/upcoming/entry-list/upcoming-entry-list.component';
import { DvrUpcomingEntryComponent, UpcomingEntryDialog } from './dvr/upcoming/entry-list/entry/upcoming-entry.component';
import { DurationPipe, EpisodeDisplayPipe, FileSizePipe, FinishedComponent, SortListDirectionPipe, SortListPositionPipe } from './dvr/finished/finished.component';


import { EpgComponent } from './epg/epg.component';
import { EntryListComponent } from './epg/entry-list/entry-list.component';
import { TitleListComponent } from './epg/title-list/title-list.component';
import { EntryComponent, EntryDialog } from './epg/entry-list/entry/entry.component';
import { NavigationComponent } from './navigation/navigation.component';

import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';

import { NewDatePipe } from './date-from-unix-date.pipe';
import { ListNamesFilterPipe } from './list-name.pipe';
import { AboutComponent } from './about/about.component';
import { BeginPercentPipe, CompletePercentPipe, EndPercentPipe } from './complete-percent.pipe';

@NgModule({
	declarations: [
		AppComponent,

		UpcomingComponent,
		UpcomingEntryListComponent,
		DvrUpcomingEntryComponent,
		UpcomingEntryDialog,
		FinishedComponent,

		EpgComponent,
		EntryListComponent,
		TitleListComponent,
		EntryDialog,
		EntryComponent,
		EntryDialog,

		IgnoreListManagmentComponent,
 		NavigationComponent,
		
		AboutComponent,

		CompletePercentPipe,
		BeginPercentPipe,
		EndPercentPipe,
		NewDatePipe,
		ListNamesFilterPipe,
		FileSizePipe,
		DurationPipe,
		EpisodeDisplayPipe,
		SortListPositionPipe,
		SortListDirectionPipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		MatButtonModule,
		MatDialogModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatSelectModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatTabsModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
