import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { UpcomingComponent } from './dvr/upcoming/upcoming.component';
import { UpcomingEntryListComponent } from './dvr/upcoming/entry-list/upcoming-entry-list.component';
import { DvrUpcomingEntryComponent, UpcomingEntryDialog } from './dvr/upcoming/entry-list/entry/upcoming-entry.component';
import { DurationPipe, EpisodeDisplayComponent, FinishedComponent, InDisplayedColumnsPipe, InSelectedPipe, SortListDirectionPipe, SortListPositionPipe } from './dvr/finished/finished.component';
import { ConfirmDeleteDialog } from './dvr/finished/confirm-delete/confirm-delete.dialog';
import { ConfirmDvrStopDialog } from './dvr/upcoming/confirm-stop/confirm-stop.dialog';


import { EpgComponent } from './epg/epg.component';
import { AboutComponent } from './about/about.component';
import { EntryListComponent } from './epg/entry-list/entry-list.component';
import { TitleListComponent } from './epg/title-list/title-list.component';
import { EntryComponent, EntryDialog } from './epg/entry-list/entry/entry.component';
import { ConfirmStopDialog } from './epg/confirm-stop/confirm-stop.dialog';

import { NavigationComponent } from './navigation/navigation.component';

import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';
import { DiskUsageComponent } from './disk-usage/disk-usage.component';

import { BeginPercentPipe, CompletePercentPipe, EndPercentPipe } from './complete-percent.pipe';
import { NewDatePipe } from './date-from-unix-date.pipe';
import { FileSizePipe } from './file-size.pipe';
import { ListNamesFilterPipe } from './list-name.pipe';

import { LoginComponent } from './login/login.component';
import { StreamComponent } from './status/stream/stream.component';

import { IgnoreListService } from './ignore-list.service';
import { AuthenticationService } from './authentication.service';
import { WebsocketService } from './api/ws/websocket.service';
import { DvrService } from './api/dvr/dvr.service';
import { EpgService } from './api/epg/epg.service';

@NgModule({
	declarations: [
		AppComponent,

		UpcomingComponent,
		UpcomingEntryListComponent,
		DvrUpcomingEntryComponent,
		UpcomingEntryDialog,
		FinishedComponent,
		ConfirmDeleteDialog,
		ConfirmDvrStopDialog,

		EpgComponent,
		EntryListComponent,
		TitleListComponent,
		EntryDialog,
		EntryComponent,
		EntryDialog,
		ConfirmStopDialog,

		IgnoreListManagmentComponent,
		NavigationComponent,
		LoginComponent,

		DiskUsageComponent,

		StreamComponent,
		AboutComponent,

		CompletePercentPipe,
		BeginPercentPipe,
		EndPercentPipe,
		NewDatePipe,
		ListNamesFilterPipe,
		FileSizePipe,
		DurationPipe,
		EpisodeDisplayComponent,
		SortListPositionPipe,
		SortListDirectionPipe,
		InDisplayedColumnsPipe,
		InSelectedPipe,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatTabsModule,
		AppRoutingModule
	],
	providers: [
		AuthenticationService,
		DvrService,
		EpgService,
		IgnoreListService,
		WebsocketService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
